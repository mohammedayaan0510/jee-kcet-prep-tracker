/**
 * LocalStorage Manager with Migration, Export/Import, and State API
 * Extended for Smart Revision, Weakness Analysis, and Today's Daily Planner
 */

const STORAGE_KEY = 'jee_kcet_tracker_v2';

function getLocalTodayStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const Storage = {
    init: function () {
        let raw = localStorage.getItem(STORAGE_KEY);
        let state = null;

        if (raw) {
            try {
                state = JSON.parse(raw);
            } catch (e) {
                console.error("Error parsing stored state, reinitializing...", e);
            }
        }

        if (!state) {
            state = this.migrateOldData();
        } else {
            state = this.ensureSyllabusIntegrity(state);
        }

        this.save(state);
        return state;
    },

    ensureSyllabusIntegrity: function (state) {
        if (!state.chapters) state.chapters = {};

        if (typeof SYLLABUS !== 'undefined' && Array.isArray(SYLLABUS)) {
            SYLLABUS.forEach(ch => {
                if (!state.chapters[ch.id]) {
                    state.chapters[ch.id] = {
                        status: 'Not Started',
                        revisionLevel: 0,
                        revisionsCompleted: 0,
                        pyqsSolved: 0,
                        lastStudied: null,
                        lastRevised: null,
                        nextRevision: null,
                        snoozedUntil: null,
                        revisionHistory: [],
                        topicsCompleted: [],
                        notes: ''
                    };
                } else {
                    const uCh = state.chapters[ch.id];
                    if (!uCh.status) uCh.status = 'Not Started';
                    if (uCh.revisionLevel === undefined) uCh.revisionLevel = 0;
                    if (uCh.revisionsCompleted === undefined) uCh.revisionsCompleted = uCh.revisionLevel || 0;
                    if (uCh.pyqsSolved === undefined) uCh.pyqsSolved = 0;
                    if (!Array.isArray(uCh.topicsCompleted)) uCh.topicsCompleted = [];
                    if (!Array.isArray(uCh.revisionHistory)) uCh.revisionHistory = [];
                    if (uCh.lastStudied === undefined) uCh.lastStudied = null;
                    if (uCh.lastRevised === undefined) uCh.lastRevised = null;
                    if (uCh.nextRevision === undefined) uCh.nextRevision = null;
                    if (uCh.snoozedUntil === undefined) uCh.snoozedUntil = null;
                }
            });
        }

        if (!state.studyLogs) state.studyLogs = [];
        if (!state.mockTests) state.mockTests = [];
        if (!state.dailyPlans) state.dailyPlans = {};
        if (!state.pyqData) {
            state.pyqData = {
                jeeMain: { attempted: 0, correct: 0 },
                jeeAdvanced: { attempted: 0, correct: 0 },
                kcet: { attempted: 0, correct: 0 }
            };
        }
        if (!state.stats) {
            state.stats = {
                overallQuestions: 0,
                overallHours: 0,
                overallTests: 0,
                studyStreak: 0,
                lastStudyDate: null
            };
        }
        if (!state.daily) {
            state.daily = {
                hours: 0,
                questions: 0,
                chapters: 0,
                targetHours: 6,
                targetQuestions: 50,
                targetChapters: 2,
                lastUpdated: getLocalTodayStr()
            };
        }
        if (!state.settings) {
            state.settings = {
                theme: 'light',
                targetExam: 'JEE Main 2026'
            };
        }

        return state;
    },

    migrateOldData: function () {
        console.log("Migrating legacy tracker data...");
        const newState = {
            chapters: {},
            studyLogs: [],
            mockTests: [],
            dailyPlans: {},
            pyqData: {
                jeeMain: { attempted: 0, correct: 0 },
                jeeAdvanced: { attempted: 0, correct: 0 },
                kcet: { attempted: 0, correct: 0 }
            },
            stats: {
                overallQuestions: Number(localStorage.getItem('questions')) || 0,
                overallHours: Number(localStorage.getItem('hours')) || 0,
                overallTests: Number(localStorage.getItem('tests')) || 0,
                studyStreak: 0,
                lastStudyDate: null
            },
            daily: {
                hours: Number(localStorage.getItem('dailyHours')) || 0,
                questions: Number(localStorage.getItem('dailyQuestions')) || 0,
                chapters: Number(localStorage.getItem('dailyChapters')) || 0,
                targetHours: 6,
                targetQuestions: 50,
                targetChapters: 2,
                lastUpdated: getLocalTodayStr()
            },
            settings: {
                theme: 'light',
                targetExam: 'JEE Main 2026'
            }
        };

        if (typeof SYLLABUS !== 'undefined' && Array.isArray(SYLLABUS)) {
            SYLLABUS.forEach(ch => {
                newState.chapters[ch.id] = {
                    status: 'Not Started',
                    revisionLevel: 0,
                    revisionsCompleted: 0,
                    pyqsSolved: 0,
                    lastStudied: null,
                    lastRevised: null,
                    nextRevision: null,
                    snoozedUntil: null,
                    revisionHistory: [],
                    topicsCompleted: [],
                    notes: ''
                };
            });

            ['physics', 'chemistry', 'maths'].forEach(sub => {
                const oldRaw = localStorage.getItem(sub + '-chapters');
                if (oldRaw) {
                    try {
                        const oldList = JSON.parse(oldRaw);
                        const subChapters = SYLLABUS.filter(s => s.subject === sub);
                        oldList.forEach((oldStatus, index) => {
                            if (subChapters[index]) {
                                const chId = subChapters[index].id;
                                let mappedStatus = 'Not Started';
                                if (oldStatus === 'In Progress') mappedStatus = 'Learning';
                                else if (oldStatus === 'Completed') mappedStatus = 'Completed';
                                else if (oldStatus === 'Revised') mappedStatus = 'Revised';

                                newState.chapters[chId].status = mappedStatus;
                                if (mappedStatus !== 'Not Started') {
                                    newState.chapters[chId].lastStudied = getLocalTodayStr();
                                }
                            }
                        });
                    } catch (e) {
                        console.warn("Failed to parse old " + sub + " chapters during migration", e);
                    }
                }
            });
        }

        return newState;
    },

    get: function () {
        let raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return this.init();
        try {
            return JSON.parse(raw);
        } catch (e) {
            return this.init();
        }
    },

    save: function (state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error("Error saving state to localStorage", e);
        }
    },

    updateChapter: function (chapterId, updates) {
        const state = this.get();
        if (!state.chapters[chapterId]) {
            state.chapters[chapterId] = {
                status: 'Not Started',
                revisionLevel: 0,
                revisionsCompleted: 0,
                pyqsSolved: 0,
                lastStudied: null,
                lastRevised: null,
                nextRevision: null,
                snoozedUntil: null,
                revisionHistory: [],
                topicsCompleted: [],
                notes: ''
            };
        }

        // If status changed to Learning/Completed/Revised from Not Started, set lastStudied
        if (updates.status && updates.status !== 'Not Started' && !state.chapters[chapterId].lastStudied) {
            updates.lastStudied = getLocalTodayStr();
        }

        Object.assign(state.chapters[chapterId], updates);
        this.save(state);
        return state;
    },

    /**
     * Marks chapter as revised using Spaced Repetition engine
     */
    markChapterRevised: function (chapterId, notes = '') {
        const state = this.get();
        const uCh = state.chapters[chapterId] || {
            status: 'Completed',
            revisionLevel: 0,
            revisionsCompleted: 0,
            revisionHistory: []
        };

        const todayStr = getLocalTodayStr();
        const currentRev = uCh.revisionLevel || 0;
        const newRev = currentRev + 1;
        const revComp = (uCh.revisionsCompleted || 0) + 1;

        // Calculate next revision date using SmartEngine
        let nextRevDate = null;
        if (typeof SmartEngine !== 'undefined') {
            nextRevDate = SmartEngine.getNextRevisionDate(todayStr, newRev);
        }

        const historyEntry = {
            date: todayStr,
            revisionLevel: newRev,
            notes: notes || 'Revision pass completed'
        };

        const updates = {
            lastRevised: todayStr,
            nextRevision: nextRevDate,
            snoozedUntil: null,
            revisionLevel: newRev,
            revisionsCompleted: revComp,
            status: newRev >= 5 ? 'PYQs Completed' : 'Revised'
        };

        if (!Array.isArray(uCh.revisionHistory)) uCh.revisionHistory = [];
        uCh.revisionHistory.unshift(historyEntry);
        updates.revisionHistory = uCh.revisionHistory;

        Object.assign(state.chapters[chapterId], updates);
        this.save(state);
        return state;
    },

    /**
     * Snoozes a chapter revision by +1 or +3 days
     */
    snoozeChapterRevision: function (chapterId, days = 1) {
        const state = this.get();
        const uCh = state.chapters[chapterId];
        if (!uCh) return state;

        const baseDate = uCh.nextRevision || getLocalTodayStr();
        let [y, m, d] = baseDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        dateObj.setDate(dateObj.getDate() + days);
        const ry = dateObj.getFullYear();
        const rm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const rd = String(dateObj.getDate()).padStart(2, '0');
        const snoozedDate = `${ry}-${rm}-${rd}`;

        uCh.snoozedUntil = snoozedDate;
        uCh.nextRevision = snoozedDate;

        this.save(state);
        return state;
    },

    /**
     * Retrieves or auto-generates daily plan for given dateStr
     */
    getDailyPlan: function (dateStr) {
        const state = this.get();
        const today = dateStr || getLocalTodayStr();
        if (!state.dailyPlans) state.dailyPlans = {};

        if (!state.dailyPlans[today]) {
            if (typeof SmartEngine !== 'undefined') {
                state.dailyPlans[today] = SmartEngine.generateDailyPlan(today, state);
            } else {
                state.dailyPlans[today] = { date: today, tasks: [] };
            }
            this.save(state);
        }

        return state.dailyPlans[today];
    },

    /**
     * Saves daily plan object
     */
    saveDailyPlan: function (dateStr, planObj) {
        const state = this.get();
        const today = dateStr || getLocalTodayStr();
        if (!state.dailyPlans) state.dailyPlans = {};
        state.dailyPlans[today] = planObj;
        this.save(state);
        return state;
    },

    /**
     * Toggles task completion in daily plan
     */
    togglePlanTask: function (dateStr, taskId) {
        const state = this.get();
        const today = dateStr || getLocalTodayStr();
        const plan = this.getDailyPlan(today);

        const task = (plan.tasks || []).find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            state.dailyPlans[today] = plan;

            // Sync with today's study progress
            if (task.completed) {
                state.daily.hours += (task.durationMins || 30) / 60;
                state.daily.questions += task.questions || 0;
            } else {
                state.daily.hours = Math.max(0, state.daily.hours - ((task.durationMins || 30) / 60));
                state.daily.questions = Math.max(0, state.daily.questions - (task.questions || 0));
            }

            this.save(state);
        }
        return state;
    },

    /**
     * Adds a custom task to daily plan
     */
    addCustomPlanTask: function (dateStr, taskObj) {
        const state = this.get();
        const today = dateStr || getLocalTodayStr();
        const plan = this.getDailyPlan(today);

        taskObj.id = 'task_cust_' + Date.now();
        taskObj.completed = false;
        if (!plan.tasks) plan.tasks = [];
        plan.tasks.push(taskObj);

        state.dailyPlans[today] = plan;
        this.save(state);
        return state;
    },

    /**
     * Deletes a task from daily plan
     */
    deletePlanTask: function (dateStr, taskId) {
        const state = this.get();
        const today = dateStr || getLocalTodayStr();
        const plan = this.getDailyPlan(today);

        plan.tasks = (plan.tasks || []).filter(t => t.id !== taskId);
        state.dailyPlans[today] = plan;
        this.save(state);
        return state;
    },

    /**
     * Updates task duration/questions
     */
    updatePlanTaskDetails: function (dateStr, taskId, durationMins, questions) {
        const state = this.get();
        const today = dateStr || getLocalTodayStr();
        const plan = this.getDailyPlan(today);

        const task = (plan.tasks || []).find(t => t.id === taskId);
        if (task) {
            task.durationMins = Math.max(1, Number(durationMins) || 30);
            task.questions = Math.max(0, Number(questions) || 0);
            state.dailyPlans[today] = plan;
            this.save(state);
        }
        return state;
    },

    addStudyLog: function (log) {
        const state = this.get();
        log.id = 'log_' + Date.now();
        log.timestamp = new Date().toISOString();
        state.studyLogs.unshift(log);

        state.stats.overallHours += Number(log.hours) || 0;
        state.stats.overallQuestions += Number(log.questions) || 0;

        const today = getLocalTodayStr();
        if (state.daily.lastUpdated !== today) {
            state.daily.hours = Number(log.hours) || 0;
            state.daily.questions = Number(log.questions) || 0;
            state.daily.chapters = Number(log.chaptersCompleted) || 0;
            state.daily.lastUpdated = today;
        } else {
            state.daily.hours += Number(log.hours) || 0;
            state.daily.questions += Number(log.questions) || 0;
            state.daily.chapters += Number(log.chaptersCompleted) || 0;
        }

        this.recalculateStreak(state);
        this.save(state);
        return state;
    },

    deleteStudyLog: function (id) {
        const state = this.get();
        state.studyLogs = state.studyLogs.filter(l => l.id !== id);
        this.recalculateStreak(state);
        this.save(state);
        return state;
    },

    addMockTest: function (test) {
        const state = this.get();
        test.id = 'test_' + Date.now();
        test.phyScore = Number(test.phyScore) || 0;
        test.chemScore = Number(test.chemScore) || 0;
        test.mathScore = Number(test.mathScore) || 0;
        test.totalScore = test.phyScore + test.chemScore + test.mathScore;
        test.maxMarks = Math.max(1, Number(test.maxMarks) || 300);
        test.accuracy = Math.max(0, Math.min(100, Number(test.accuracy) || 0));

        state.mockTests.unshift(test);
        state.stats.overallTests = state.mockTests.length;

        this.save(state);
        return state;
    },

    deleteMockTest: function (id) {
        const state = this.get();
        state.mockTests = state.mockTests.filter(t => t.id !== id);
        state.stats.overallTests = state.mockTests.length;
        this.save(state);
        return state;
    },

    updatePyqData: function (examKey, attempted, correct) {
        const state = this.get();
        if (!state.pyqData[examKey]) {
            state.pyqData[examKey] = { attempted: 0, correct: 0 };
        }
        state.pyqData[examKey].attempted = Math.max(0, Number(attempted) || 0);
        state.pyqData[examKey].correct = Math.max(0, Number(correct) || 0);
        this.save(state);
        return state;
    },

    recalculateStreak: function (state) {
        if (!state.studyLogs || state.studyLogs.length === 0) {
            state.stats.studyStreak = 0;
            return;
        }

        const dates = Array.from(new Set(state.studyLogs.map(l => l.date))).sort().reverse();
        const todayStr = getLocalTodayStr();
        
        const now = new Date();
        const yesterdayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const y = yesterdayDate.getFullYear();
        const m = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
        const d = String(yesterdayDate.getDate()).padStart(2, '0');
        const yesterdayStr = `${y}-${m}-${d}`;

        if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) {
            state.stats.studyStreak = 0;
            return;
        }

        let streak = 0;
        let startDate = dates.includes(todayStr) ? new Date() : yesterdayDate;
        let checkDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

        for (let i = 0; i < 365; i++) {
            const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
            if (dates.includes(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        state.stats.studyStreak = streak;
    },

    exportJSON: function () {
        const state = this.get();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `JEE_KCET_Tracker_Backup_${getLocalTodayStr()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    },

    importJSON: function (jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (!imported || typeof imported !== 'object' || !imported.chapters) {
                throw new Error("Invalid backup file structure: missing chapters object.");
            }
            const validated = this.ensureSyllabusIntegrity(imported);
            this.save(validated);
            return { success: true, state: validated };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    resetAll: function () {
        localStorage.removeItem(STORAGE_KEY);
        return this.init();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
