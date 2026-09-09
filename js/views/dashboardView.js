/**
 * Dashboard View Controller (Upgraded with Smart Study Recommendations Widget)
 */

const DashboardView = {
    render: function (container, state) {
        // Calculate Subject Percentages from Chapter Statuses
        const subjectPcts = this.calculateSubjectProgress(state);
        const overallPct = Math.round((subjectPcts.physics + subjectPcts.chemistry + subjectPcts.maths) / 3);

        // Calculate Exam Readiness
        const jeeMainReadiness = UI.calculateExamReadiness(state, 'jeeMain');
        const jeeAdvReadiness = UI.calculateExamReadiness(state, 'jeeAdvanced');
        const kcetReadiness = UI.calculateExamReadiness(state, 'kcet');

        // Smart Recommendations
        const topActions = SmartEngine.getTopRecommendedActions(state);
        const todayStr = getLocalTodayStr();

        // Calculate counts for smart indicators
        const allChapters = SYLLABUS || [];
        const userChapters = state.chapters || {};
        let overdueCount = 0;
        let dueTodayCount = 0;
        let weakCount = 0;

        allChapters.forEach(ch => {
            const uCh = userChapters[ch.id] || {};
            const status = uCh.status || 'Not Started';
            if (status !== 'Not Started' && uCh.nextRevision) {
                if (uCh.nextRevision < todayStr) overdueCount++;
                if (uCh.nextRevision === todayStr) dueTodayCount++;
            }
            const wScore = SmartEngine.calculateWeaknessScore(ch.id, state);
            if (wScore !== null && wScore >= 75) weakCount++;
        });

        const todayPlan = Storage.getDailyPlan(todayStr);
        const tasks = todayPlan.tasks || [];
        const completedTasks = tasks.filter(t => t.completed).length;
        const planCompletionPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

        // Today's Daily Target
        const daily = state.daily || {};
        const hoursPct = Math.min(100, Math.round(((daily.hours || 0) / (daily.targetHours || 6)) * 100));
        const qPct = Math.min(100, Math.round(((daily.questions || 0) / (daily.targetQuestions || 50)) * 100));
        const chPct = Math.min(100, Math.round(((daily.chapters || 0) / (daily.targetChapters || 2)) * 100));
        const dailyOverallPct = Math.round((hoursPct + qPct + chPct) / 3);

        // Streak & Stats
        const streak = state.stats ? state.stats.studyStreak || 0 : 0;
        const totalQuestions = state.stats ? state.stats.overallQuestions || 0 : 0;
        const totalHours = state.stats ? state.stats.overallHours || 0 : 0;
        const totalTests = state.mockTests ? state.mockTests.length : 0;

        container.innerHTML = `
            <!-- Top Hero Banner -->
            <div class="dashboard-hero">
                <div class="hero-content">
                    <span class="hero-badge">🎯 TARGET EXAM: ${state.settings.targetExam || 'JEE & KCET 2026'}</span>
                    <h1>Preparation Dashboard</h1>
                    <p>Track your daily progress, chapter completion, mock test scores, and exam readiness.</p>
                    
                    <div class="hero-quick-actions">
                        <button class="btn btn-primary" onclick="App.openLogStudyModal()">⏱️ Log Today's Study</button>
                        <button class="btn btn-secondary" onclick="App.openMockTestModal()">📝 Record Mock Test</button>
                        <button class="btn btn-outline" onclick="App.switchTab('planner')">📅 Open Today's Plan</button>
                    </div>
                </div>

                <div class="hero-progress-box">
                    ${UI.createProgressRing(overallPct, 55, 9, '#6366f1')}
                    <div class="hero-ring-info">
                        <strong>Overall Prep</strong>
                        <span>Physics, Chem & Math</span>
                    </div>
                </div>
            </div>

            <!-- SMART WIDGET: What Should I Study Today? -->
            <div class="smart-recommendations-card mb-4">
                <div class="smart-card-header">
                    <div>
                        <h2>💡 What Should I Study Today?</h2>
                        <p>Intelligent recommendations based on your revision schedule and weak topics.</p>
                    </div>
                    <button class="btn btn-primary" onclick="App.switchTab('planner')">View Full Today's Plan →</button>
                </div>

                <!-- Top 3 Action Cards -->
                <div class="smart-actions-grid">
                    ${topActions.map((act, idx) => `
                        <div class="smart-action-item">
                            <div class="action-num">${idx + 1}</div>
                            <div class="action-details">
                                <div class="chip-row">
                                    <span class="prio-pill ${act.badgeClass}">${act.badge}</span>
                                    <span class="sub-pill-sm ${act.subject}">${(act.subject || 'GENERAL').toUpperCase()}</span>
                                </div>
                                <h4>${act.title}</h4>
                                <span class="action-reason">${act.reason}</span>
                            </div>
                            <button class="btn btn-secondary btn-xs" onclick="App.switchTab('planner')">Do Today</button>
                        </div>`).join('')}
                </div>

                <!-- Quick Smart Stats Bar -->
                <div class="smart-stats-footer">
                    <div class="smart-stat-chip">
                        <span>🔄 Today's Revisions:</span> <strong>${dueTodayCount} Due</strong>
                    </div>
                    <div class="smart-stat-chip">
                        <span>🚨 Overdue Revisions:</span> <strong class="${overdueCount > 0 ? 'text-red' : ''}">${overdueCount} Overdue</strong>
                    </div>
                    <div class="smart-stat-chip">
                        <span>🔴 Critical Weak Chapters:</span> <strong>${weakCount} Weak</strong>
                    </div>
                    <div class="smart-stat-chip">
                        <span>📅 Today's Plan Completion:</span> <strong>${planCompletionPct}% Completed</strong>
                    </div>
                </div>
            </div>

            <!-- Quick Stats Cards Row -->
            <div class="stats-overview-grid">
                <div class="stat-box">
                    <div class="stat-icon-wrapper fire">🔥</div>
                    <div class="stat-info">
                        <span class="stat-value">${streak} Days</span>
                        <span class="stat-label">Current Study Streak</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper blue">📝</div>
                    <div class="stat-info">
                        <span class="stat-value">${totalQuestions}</span>
                        <span class="stat-label">Total Questions Solved</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper green">⏱️</div>
                    <div class="stat-info">
                        <span class="stat-value">${totalHours} hrs</span>
                        <span class="stat-label">Total Study Hours Logged</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper purple">🏆</div>
                    <div class="stat-info">
                        <span class="stat-value">${totalTests}</span>
                        <span class="stat-label">Mock Tests Completed</span>
                    </div>
                </div>
            </div>

            <!-- Subject Progress Section -->
            <div class="section-title">
                <h2>📚 Subject Mastery</h2>
                <button class="btn-text" onclick="App.switchTab('subjects')">View Subject Breakdown →</button>
            </div>

            <div class="subject-cards-grid">
                <!-- Physics -->
                <div class="subject-card phy-border">
                    <div class="subject-card-header">
                        <div class="subject-title-wrap">
                            <span class="subj-icon">📚</span>
                            <div>
                                <h3>Physics</h3>
                                <span class="subj-sub">11th & 12th Standard</span>
                            </div>
                        </div>
                        ${UI.createProgressRing(subjectPcts.physics, 35, 6, '#3b82f6')}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill phy" style="width: ${subjectPcts.physics}%;"></div>
                    </div>
                    <div class="subject-card-stats">
                        <span>Completed: <strong>${subjectPcts.phyCompleted} / ${subjectPcts.phyTotal}</strong></span>
                        <span>Learning: <strong>${subjectPcts.phyLearning}</strong></span>
                    </div>
                </div>

                <!-- Chemistry -->
                <div class="subject-card chem-border">
                    <div class="subject-card-header">
                        <div class="subject-title-wrap">
                            <span class="subj-icon">🧪</span>
                            <div>
                                <h3>Chemistry</h3>
                                <span class="subj-sub">Physical, Organic & Inorganic</span>
                            </div>
                        </div>
                        ${UI.createProgressRing(subjectPcts.chemistry, 35, 6, '#10b981')}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill chem" style="width: ${subjectPcts.chemistry}%;"></div>
                    </div>
                    <div class="subject-card-stats">
                        <span>Completed: <strong>${subjectPcts.chemCompleted} / ${subjectPcts.chemTotal}</strong></span>
                        <span>Learning: <strong>${subjectPcts.chemLearning}</strong></span>
                    </div>
                </div>

                <!-- Mathematics -->
                <div class="subject-card math-border">
                    <div class="subject-card-header">
                        <div class="subject-title-wrap">
                            <span class="subj-icon">📐</span>
                            <div>
                                <h3>Mathematics</h3>
                                <span class="subj-sub">Algebra, Calculus, Geometry</span>
                            </div>
                        </div>
                        ${UI.createProgressRing(subjectPcts.maths, 35, 6, '#f59e0b')}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill math" style="width: ${subjectPcts.maths}%;"></div>
                    </div>
                    <div class="subject-card-stats">
                        <span>Completed: <strong>${subjectPcts.mathCompleted} / ${subjectPcts.mathTotal}</strong></span>
                        <span>Learning: <strong>${subjectPcts.mathLearning}</strong></span>
                    </div>
                </div>
            </div>

            <!-- Exam Target Cards Section -->
            <div class="section-title">
                <h2>🎯 Exam Target Tracker</h2>
                <button class="btn-text" onclick="App.switchTab('exams')">Exam Details & Weights →</button>
            </div>

            <div class="exam-cards-grid">
                <div class="exam-card">
                    <div class="exam-badge main">JEE MAIN</div>
                    <div class="exam-readiness-circle">
                        <strong>${jeeMainReadiness.overall}%</strong>
                        <span>Readiness</span>
                    </div>
                    <div class="exam-metrics">
                        <div class="exam-metric-row"><span>Syllabus Covered</span><strong>${jeeMainReadiness.syllabus}%</strong></div>
                        <div class="exam-metric-row"><span>PYQs Practiced</span><strong>${jeeMainReadiness.pyq}%</strong></div>
                        <div class="exam-metric-row"><span>Revision Pass</span><strong>${jeeMainReadiness.revision}%</strong></div>
                    </div>
                </div>

                <div class="exam-card">
                    <div class="exam-badge adv">JEE ADVANCED</div>
                    <div class="exam-readiness-circle">
                        <strong>${jeeAdvReadiness.overall}%</strong>
                        <span>Readiness</span>
                    </div>
                    <div class="exam-metrics">
                        <div class="exam-metric-row"><span>Syllabus Covered</span><strong>${jeeAdvReadiness.syllabus}%</strong></div>
                        <div class="exam-metric-row"><span>PYQs Practiced</span><strong>${jeeAdvReadiness.pyq}%</strong></div>
                        <div class="exam-metric-row"><span>Revision Pass</span><strong>${jeeAdvReadiness.revision}%</strong></div>
                    </div>
                </div>

                <div class="exam-card">
                    <div class="exam-badge kcet">KCET</div>
                    <div class="exam-readiness-circle">
                        <strong>${kcetReadiness.overall}%</strong>
                        <span>Readiness</span>
                    </div>
                    <div class="exam-metrics">
                        <div class="exam-metric-row"><span>Syllabus Covered</span><strong>${kcetReadiness.syllabus}%</strong></div>
                        <div class="exam-metric-row"><span>PYQs Practiced</span><strong>${kcetReadiness.pyq}%</strong></div>
                        <div class="exam-metric-row"><span>Revision Pass</span><strong>${kcetReadiness.revision}%</strong></div>
                    </div>
                </div>
            </div>

            <!-- Daily Target Box -->
            <div class="daily-tracker-card">
                <div class="daily-card-header">
                    <div>
                        <h3>🎯 Today's Target (${UI.formatDate(todayStr)})</h3>
                        <p>Stay disciplined. Track your daily hours, solved questions, and chapters studied.</p>
                    </div>
                    <div class="daily-overall-badge">${dailyOverallPct}% Completed</div>
                </div>

                <div class="daily-targets-row">
                    <div class="target-item">
                        <div class="target-head"><span>⏱️ Study Hours</span><strong>${daily.hours || 0} / ${daily.targetHours || 6} hrs</strong></div>
                        <div class="progress-bar-container"><div class="progress-bar-fill phy" style="width: ${hoursPct}%;"></div></div>
                    </div>

                    <div class="target-item">
                        <div class="target-head"><span>📝 Solved Questions</span><strong>${daily.questions || 0} / ${daily.targetQuestions || 50}</strong></div>
                        <div class="progress-bar-container"><div class="progress-bar-fill chem" style="width: ${qPct}%;"></div></div>
                    </div>

                    <div class="target-item">
                        <div class="target-head"><span>📖 Chapters Studied</span><strong>${daily.chapters || 0} / ${daily.targetChapters || 2}</strong></div>
                        <div class="progress-bar-container"><div class="progress-bar-fill math" style="width: ${chPct}%;"></div></div>
                    </div>
                </div>
            </div>
        `;
    },

    calculateSubjectProgress: function (state) {
        const userChapters = state.chapters || {};
        const result = {
            physics: 0, phyCompleted: 0, phyLearning: 0, phyTotal: 0,
            chemistry: 0, chemCompleted: 0, chemLearning: 0, chemTotal: 0,
            maths: 0, mathCompleted: 0, mathLearning: 0, mathTotal: 0
        };

        if (typeof SYLLABUS !== 'undefined') {
            SYLLABUS.forEach(ch => {
                const sub = ch.subject;
                const status = userChapters[ch.id] ? userChapters[ch.id].status : 'Not Started';

                if (sub === 'physics') {
                    result.phyTotal++;
                    if (status === 'Completed' || status === 'Revised' || status === 'PYQs Completed') result.phyCompleted++;
                    if (status === 'Learning') result.phyLearning++;
                } else if (sub === 'chemistry') {
                    result.chemTotal++;
                    if (status === 'Completed' || status === 'Revised' || status === 'PYQs Completed') result.chemCompleted++;
                    if (status === 'Learning') result.chemLearning++;
                } else if (sub === 'maths') {
                    result.mathTotal++;
                    if (status === 'Completed' || status === 'Revised' || status === 'PYQs Completed') result.mathCompleted++;
                    if (status === 'Learning') result.mathLearning++;
                }
            });

            if (result.phyTotal > 0) result.physics = Math.round((result.phyCompleted / result.phyTotal) * 100);
            if (result.chemTotal > 0) result.chemistry = Math.round((result.chemCompleted / result.chemTotal) * 100);
            if (result.mathTotal > 0) result.maths = Math.round((result.mathCompleted / result.mathTotal) * 100);
        }

        return result;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardView;
}
