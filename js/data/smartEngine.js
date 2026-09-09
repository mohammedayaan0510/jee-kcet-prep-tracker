/**
 * Smart Study Planning & Intelligent Revision Engine
 * Spaced repetition scheduling, weakness analysis, priority ranking, and auto-planner
 */

function getLocalTodayStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function addDaysToStr(dateStr, days) {
    let [y, m, d] = (dateStr || getLocalTodayStr()).split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + days);
    const ry = dateObj.getFullYear();
    const rm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const rd = String(dateObj.getDate()).padStart(2, '0');
    return `${ry}-${rm}-${rd}`;
}

function daysDiff(dateStr1, dateStr2) {
    if (!dateStr1 || !dateStr2) return 0;
    const [y1, m1, d1] = dateStr1.split('-').map(Number);
    const [y2, m2, d2] = dateStr2.split('-').map(Number);
    const date1 = new Date(y1, m1 - 1, d1);
    const date2 = new Date(y2, m2 - 1, d2);
    const diffTime = date2 - date1;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

const SmartEngine = {
    /**
     * Calculates next revision date based on current revision level
     * Level 0 -> Rev 1 (+1d)
     * Level 1 -> Rev 2 (+3d)
     * Level 2 -> Rev 3 (+7d)
     * Level 3 -> Rev 4 (+14d)
     * Level 4+ -> Rev 5 (+30d)
     */
    getNextRevisionDate: function (fromDateStr, revisionLevel) {
        const fromDate = fromDateStr || getLocalTodayStr();
        let daysToAdd = 1;
        if (revisionLevel === 1) daysToAdd = 3;
        else if (revisionLevel === 2) daysToAdd = 7;
        else if (revisionLevel === 3) daysToAdd = 14;
        else if (revisionLevel >= 4) daysToAdd = 30;

        return addDaysToStr(fromDate, daysToAdd);
    },

    /**
     * Calculates deterministic weakness score (0 to 100) or returns null ("Insufficient Data")
     */
    calculateWeaknessScore: function (chId, state) {
        const ch = (SYLLABUS || []).find(c => c.id === chId);
        if (!ch) return null;

        const uCh = (state.chapters || {})[chId] || {};
        const status = uCh.status || 'Not Started';
        const pyqsSolved = uCh.pyqsSolved || 0;
        const revComp = uCh.revisionsCompleted || 0;

        // PYQ Data for exam
        const pyqData = state.pyqData || {};
        let totalAtt = (pyqData.jeeMain ? pyqData.jeeMain.attempted : 0) + (pyqData.jeeAdvanced ? pyqData.jeeAdvanced.attempted : 0) + (pyqData.kcet ? pyqData.kcet.attempted : 0);
        let totalCorr = (pyqData.jeeMain ? pyqData.jeeMain.correct : 0) + (pyqData.jeeAdvanced ? pyqData.jeeAdvanced.correct : 0) + (pyqData.kcet ? pyqData.kcet.correct : 0);

        // Check if there is sufficient data
        if (status === 'Not Started' && pyqsSolved === 0 && revComp === 0 && totalAtt === 0) {
            return null; // Insufficient Data
        }

        // 1. PYQ Accuracy Factor (40%)
        let pyqAcc = 0.5; // default 50%
        if (totalAtt > 0) {
            pyqAcc = totalCorr / totalAtt;
        } else if (pyqsSolved > 0) {
            pyqAcc = Math.min(1, pyqsSolved / (ch.targetPyqs || 50));
        }
        const pyqWeakness = (1 - pyqAcc) * 100;

        // 2. Revision Factor (30%)
        let revWeakness = Math.max(0, 100 - (revComp * 20));
        const todayStr = getLocalTodayStr();
        if (uCh.nextRevision && uCh.nextRevision < todayStr && status !== 'Not Started') {
            const overdueDays = daysDiff(uCh.nextRevision, todayStr);
            revWeakness += Math.min(30, overdueDays * 5);
        }

        // 3. Topic Completion Factor (20%)
        const totalTopics = ch.topics ? ch.topics.length : 1;
        const compTopics = uCh.topicsCompleted ? uCh.topicsCompleted.length : 0;
        const topicWeakness = (1 - (compTopics / totalTopics)) * 100;

        // 4. Subject Mock Performance Factor (10%)
        const mockTests = (state.mockTests || []).filter(t => t.totalScore !== undefined);
        let mockWeakness = 40; // default medium
        if (mockTests.length > 0) {
            const avgPct = mockTests.reduce((acc, t) => acc + (t.totalScore / (t.maxMarks || 300)), 0) / mockTests.length;
            mockWeakness = (1 - avgPct) * 100;
        }

        const score = Math.round(
            (pyqWeakness * 0.40) +
            (revWeakness * 0.30) +
            (topicWeakness * 0.20) +
            (mockWeakness * 0.10)
        );

        return Math.max(0, Math.min(100, score));
    },

    /**
     * Calculates priority score and badge
     */
    calculatePriority: function (chId, state) {
        const uCh = (state.chapters || {})[chId] || {};
        const status = uCh.status || 'Not Started';
        const todayStr = getLocalTodayStr();

        let score = 0;

        // Overdue revision bonus
        if (uCh.nextRevision && uCh.nextRevision < todayStr && status !== 'Not Started') {
            score += 40;
        }

        // Weakness score bonus
        const wScore = this.calculateWeaknessScore(chId, state);
        if (wScore !== null) {
            if (wScore >= 75) score += 35;
            else if (wScore >= 50) score += 20;
        }

        // Learning status bonus
        if (status === 'Learning') score += 15;

        // Never revised bonus
        if ((uCh.revisionsCompleted || 0) === 0 && status !== 'Not Started') score += 15;

        let level = 'Low';
        let badge = '✓ Low';
        let badgeClass = 'prio-low';

        if (score >= 50) {
            level = 'High';
            badge = '🔥 High';
            badgeClass = 'prio-high';
        } else if (score >= 25) {
            level = 'Medium';
            badge = '⚠️ Medium';
            badgeClass = 'prio-medium';
        }

        return { score, level, badge, badgeClass };
    },

    /**
     * Generates top 3 recommended actions for Dashboard Hero Card
     */
    getTopRecommendedActions: function (state) {
        const chapters = SYLLABUS || [];
        const todayStr = getLocalTodayStr();
        const recommendations = [];

        chapters.forEach(ch => {
            const uCh = (state.chapters || {})[ch.id] || {};
            const status = uCh.status || 'Not Started';
            const prio = this.calculatePriority(ch.id, state);
            const wScore = this.calculateWeaknessScore(ch.id, state);

            // 1. Overdue Revision Action
            if (uCh.nextRevision && uCh.nextRevision <= todayStr && status !== 'Not Started') {
                recommendations.push({
                    id: 'rec_rev_' + ch.id,
                    chId: ch.id,
                    subject: ch.subject,
                    title: `Revise ${ch.title}`,
                    reason: `Due for Revision Pass ${(uCh.revisionLevel || 0) + 1}`,
                    priority: 'High',
                    badge: '🔥 High',
                    badgeClass: 'prio-high',
                    type: 'revision'
                });
            }
            // 2. High Weakness PYQ Action
            else if (wScore !== null && wScore >= 60) {
                recommendations.push({
                    id: 'rec_pyq_' + ch.id,
                    chId: ch.id,
                    subject: ch.subject,
                    title: `Solve 20 PYQs in ${ch.title}`,
                    reason: `Weakness Score: ${wScore}/100`,
                    priority: prio.level,
                    badge: prio.badge,
                    badgeClass: prio.badgeClass,
                    type: 'pyq'
                });
            }
            // 3. Learning Chapter Study Action
            else if (status === 'Learning') {
                recommendations.push({
                    id: 'rec_study_' + ch.id,
                    chId: ch.id,
                    subject: ch.subject,
                    title: `Complete ${ch.title}`,
                    reason: `Currently in progress`,
                    priority: 'Medium',
                    badge: '⚠️ Medium',
                    badgeClass: 'prio-medium',
                    type: 'concept'
                });
            }
        });

        // Fallback default recommendations if empty
        if (recommendations.length < 3) {
            const defaults = [
                { id: 'rec_def_1', chId: 'phy_11_01', subject: 'physics', title: 'Revise Units & Measurements', reason: 'Foundation chapter', priority: 'Medium', badge: '⚠️ Medium', badgeClass: 'prio-medium', type: 'revision' },
                { id: 'rec_def_2', chId: 'chem_11_01', subject: 'chemistry', title: 'Solve 20 PYQs in Mole Concept', reason: 'High weightage unit', priority: 'Medium', badge: '⚠️ Medium', badgeClass: 'prio-medium', type: 'pyq' },
                { id: 'rec_def_3', chId: 'math_11_02', subject: 'maths', title: 'Complete Relations & Functions', reason: 'Core calculus prerequisite', priority: 'Low', badge: '✓ Low', badgeClass: 'prio-low', type: 'concept' }
            ];
            defaults.forEach(d => {
                if (recommendations.length < 3 && !recommendations.some(r => r.title === d.title)) {
                    recommendations.push(d);
                }
            });
        }

        // Sort high priority first
        return recommendations.slice(0, 3);
    },

    /**
     * Auto-generates structured daily tasks for a given dateStr
     */
    generateDailyPlan: function (dateStr, state) {
        const todayStr = dateStr || getLocalTodayStr();
        const chapters = SYLLABUS || [];
        const tasks = [];

        // Add due revisions first
        chapters.forEach(ch => {
            const uCh = (state.chapters || {})[ch.id] || {};
            const status = uCh.status || 'Not Started';
            if (uCh.nextRevision && uCh.nextRevision <= todayStr && status !== 'Not Started') {
                tasks.push({
                    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                    text: `Revise ${ch.title} (Pass ${(uCh.revisionLevel || 0) + 1})`,
                    subject: ch.subject,
                    durationMins: 45,
                    questions: 15,
                    completed: false,
                    type: 'revision'
                });
            }
        });

        // Add high priority chapter study/PYQ tasks
        chapters.forEach(ch => {
            const uCh = (state.chapters || {})[ch.id] || {};
            const status = uCh.status || 'Not Started';
            const wScore = this.calculateWeaknessScore(ch.id, state);

            if (tasks.length < 6) {
                if (wScore !== null && wScore >= 60 && status !== 'Not Started') {
                    tasks.push({
                        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        text: `Solve 20 PYQs in ${ch.title}`,
                        subject: ch.subject,
                        durationMins: 40,
                        questions: 20,
                        completed: false,
                        type: 'pyq'
                    });
                } else if (status === 'Learning') {
                    tasks.push({
                        id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        text: `Study ${ch.title} topics`,
                        subject: ch.subject,
                        durationMins: 60,
                        questions: 15,
                        completed: false,
                        type: 'concept'
                    });
                }
            }
        });

        // Fallback default tasks if empty
        if (tasks.length === 0) {
            tasks.push(
                { id: 't_def_1', text: 'Physics: Practice Kinematics PYQs', subject: 'physics', durationMins: 60, questions: 25, completed: false, type: 'pyq' },
                { id: 't_def_2', text: 'Chemistry: Revise Chemical Bonding notes', subject: 'chemistry', durationMins: 45, questions: 15, completed: false, type: 'revision' },
                { id: 't_def_3', text: 'Mathematics: Solve Integration problems', subject: 'maths', durationMins: 60, questions: 20, completed: false, type: 'concept' }
            );
        }

        return {
            date: todayStr,
            tasks: tasks
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartEngine;
}
