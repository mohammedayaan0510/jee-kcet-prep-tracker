/**
 * Daily Study Tracker View Controller
 */

const StudyView = {
    render: function (container, state) {
        const daily = state.daily || {};
        const logs = state.studyLogs || [];
        const streak = state.stats ? state.stats.studyStreak || 0 : 0;

        const hoursPct = Math.min(100, Math.round(((daily.hours || 0) / (daily.targetHours || 6)) * 100));
        const qPct = Math.min(100, Math.round(((daily.questions || 0) / (daily.targetQuestions || 50)) * 100));
        const chPct = Math.min(100, Math.round(((daily.chapters || 0) / (daily.targetChapters || 2)) * 100));
        const dailyOverallPct = Math.round((hoursPct + qPct + chPct) / 3);

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Study Tracker & Logs</h1>
                    <p>Record your daily study sessions, track hours, solved questions, and monitor your consistency streak.</p>
                </div>
                <button class="btn btn-primary" onclick="App.openLogStudyModal()">+ Log New Study Session</button>
            </div>

            <!-- Streak & Daily Goal Hero -->
            <div class="study-hero-grid">
                <div class="streak-hero-card">
                    <div class="streak-flame">🔥</div>
                    <div class="streak-text-info">
                        <h3>Current Study Streak</h3>
                        <div class="streak-large-val">${streak} <span>Days</span></div>
                        <p>${streak > 0 ? "Fantastic momentum! Don't break the chain." : "Start your daily study streak today!"}</p>
                    </div>
                </div>

                <div class="daily-goals-card">
                    <div class="card-head-row">
                        <h3>Today's Goals (${UI.formatDate(new Date())})</h3>
                        <span class="goal-pct-pill">${dailyOverallPct}% Complete</span>
                    </div>

                    <div class="goal-input-grid">
                        <div class="goal-box">
                            <label>⏱️ Hours Studied</label>
                            <div class="input-with-target">
                                <input type="number" id="study-daily-hours" step="0.5" value="${daily.hours || 0}">
                                <span>/ ${daily.targetHours || 6} hrs</span>
                            </div>
                        </div>

                        <div class="goal-box">
                            <label>📝 Questions Solved</label>
                            <div class="input-with-target">
                                <input type="number" id="study-daily-questions" value="${daily.questions || 0}">
                                <span>/ ${daily.targetQuestions || 50}</span>
                            </div>
                        </div>

                        <div class="goal-box">
                            <label>📚 Chapters Completed</label>
                            <div class="input-with-target">
                                <input type="number" id="study-daily-chapters" value="${daily.chapters || 0}">
                                <span>/ ${daily.targetChapters || 2}</span>
                            </div>
                        </div>
                    </div>

                    <div class="goals-card-footer">
                        <button class="btn btn-secondary" onclick="StudyView.saveDailyGoals()">Save Today's Progress</button>
                        <button class="btn-text" onclick="StudyView.openTargetSettingsModal()">Configure Goals ⚙️</button>
                    </div>
                </div>
            </div>

            <!-- Study History Logs Table -->
            <div class="section-title mt-4">
                <h2>📋 Study Logs History</h2>
                <span>${logs.length} Total Sessions Logged</span>
            </div>

            <div class="logs-table-wrapper">
                <table class="chapter-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Hours</th>
                            <th>Questions</th>
                            <th>Chapters</th>
                            <th>Notes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.length === 0 ? `
                            <tr>
                                <td colspan="7" class="text-center py-4">No study sessions logged yet. Click "+ Log New Study Session" above!</td>
                            </tr>` : 
                            logs.map(log => `
                                <tr>
                                    <td><strong>${UI.formatDate(log.date)}</strong></td>
                                    <td><span class="sub-pill ${log.subject || 'physics'}">${log.subject ? log.subject.toUpperCase() : 'GENERAL'}</span></td>
                                    <td><strong>${log.hours} hrs</strong></td>
                                    <td><strong>${log.questions}</strong></td>
                                    <td>${log.chaptersCompleted || 0}</td>
                                    <td>${log.notes || '-'}</td>
                                    <td>
                                        <button class="btn-icon text-red" onclick="StudyView.deleteLog('${log.id}')">🗑️ Delete</button>
                                    </td>
                                </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    saveDailyGoals: function () {
        const hours = Number(document.getElementById('study-daily-hours').value) || 0;
        const questions = Number(document.getElementById('study-daily-questions').value) || 0;
        const chapters = Number(document.getElementById('study-daily-chapters').value) || 0;

        const state = Storage.get();
        state.daily.hours = hours;
        state.daily.questions = questions;
        state.daily.chapters = chapters;
        state.daily.lastUpdated = new Date().toISOString().split('T')[0];

        Storage.save(state);
        UI.showToast("Today's progress saved successfully!", 'success');
        App.renderCurrentView();
    },

    deleteLog: function (id) {
        if (confirm("Are you sure you want to delete this study log entry?")) {
            Storage.deleteStudyLog(id);
            UI.showToast("Study log deleted.", 'info');
            App.renderCurrentView();
        }
    },

    openTargetSettingsModal: function () {
        const state = Storage.get();
        const daily = state.daily || {};

        const html = `
            <div class="modal-form">
                <div class="form-group">
                    <label>Daily Target Hours</label>
                    <input type="number" id="target-hours-input" step="0.5" value="${daily.targetHours || 6}">
                </div>
                <div class="form-group">
                    <label>Daily Target Solved Questions</label>
                    <input type="number" id="target-q-input" value="${daily.targetQuestions || 50}">
                </div>
                <div class="form-group">
                    <label>Daily Target Chapters</label>
                    <input type="number" id="target-ch-input" value="${daily.targetChapters || 2}">
                </div>
            </div>
        `;

        UI.showModal('Configure Daily Targets', html, () => {
            const th = Number(document.getElementById('target-hours-input').value) || 6;
            const tq = Number(document.getElementById('target-q-input').value) || 50;
            const tc = Number(document.getElementById('target-ch-input').value) || 2;

            const st = Storage.get();
            st.daily.targetHours = th;
            st.daily.targetQuestions = tq;
            st.daily.targetChapters = tc;
            Storage.save(st);

            UI.showToast('Daily targets updated!', 'success');
            App.renderCurrentView();
            return true;
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StudyView;
}
