/**
 * Spaced Repetition Revision System View Controller
 */

const RevisionView = {
    activeTab: 'due',

    render: function (container, state) {
        const userChapters = state.chapters || {};
        const allChapters = SYLLABUS || [];
        const todayStr = getLocalTodayStr();

        // Categorize chapters into spaced revision buckets
        const overdue = [];
        const dueToday = [];
        const dueSoon = [];
        const recentlyRevised = [];
        const fullyRevised = [];

        allChapters.forEach(ch => {
            const uCh = userChapters[ch.id] || {};
            const status = uCh.status || 'Not Started';

            // Only chapters that have been studied/completed/revised
            if (status !== 'Not Started') {
                const nextRev = uCh.nextRevision;
                const revLvl = uCh.revisionLevel || 0;

                if (revLvl >= 5 || status === 'PYQs Completed') {
                    fullyRevised.push(ch);
                } else if (nextRev && nextRev < todayStr) {
                    overdue.push(ch);
                } else if (nextRev === todayStr) {
                    dueToday.push(ch);
                } else if (nextRev && daysDiff(todayStr, nextRev) > 0 && daysDiff(todayStr, nextRev) <= 3) {
                    dueSoon.push(ch);
                } else if (uCh.lastRevised && daysDiff(uCh.lastRevised, todayStr) <= 3) {
                    recentlyRevised.push(ch);
                } else {
                    dueSoon.push(ch);
                }
            }
        });

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Spaced Repetition Revision Dashboard</h1>
                    <p>Scientific spaced revision intervals (1d → 3d → 7d → 14d → 30d) to maximize retention.</p>
                </div>

                <!-- Revision Filter Tabs -->
                <div class="tab-pill-buttons">
                    <button class="tab-pill ${this.activeTab === 'due' ? 'active' : ''}" onclick="RevisionView.switchTab('due')">🚨 Due / Overdue (${overdue.length + dueToday.length})</button>
                    <button class="tab-pill ${this.activeTab === 'soon' ? 'active' : ''}" onclick="RevisionView.switchTab('soon')">⏳ Due Soon (${dueSoon.length})</button>
                    <button class="tab-pill ${this.activeTab === 'recent' ? 'active' : ''}" onclick="RevisionView.switchTab('recent')">🔄 Recently Revised (${recentlyRevised.length})</button>
                    <button class="tab-pill ${this.activeTab === 'fully' ? 'active' : ''}" onclick="RevisionView.switchTab('fully')">🏆 Fully Revised (${fullyRevised.length})</button>
                </div>
            </div>

            <!-- Overdue Warning Banner if any -->
            ${overdue.length > 0 ? `
                <div class="needs-revision-banner">
                    <div class="banner-head">
                        <h3>🚨 ${overdue.length} Chapters Overdue for Revision</h3>
                        <p>Complete these revisions today to prevent concept fading!</p>
                    </div>
                    <div class="needs-revision-chips">
                        ${overdue.map(ch => `
                            <div class="revision-item-chip">
                                <span>${ch.title} (${ch.subject.substring(0, 3).toUpperCase()})</span>
                                <button class="btn-xs" onclick="RevisionView.markRevised('${ch.id}')">Mark Revised ✓</button>
                            </div>`).join('')}
                    </div>
                </div>` : `
                <div class="revision-clean-banner mb-4">
                    <h3>✅ Excellent Revision Discipline!</h3>
                    <p>No chapters are overdue for revision right now.</p>
                </div>`}

            <!-- Active Revision Category Grid -->
            <div class="revision-cards-grid">
                ${this.renderActiveTabGrid(overdue, dueToday, dueSoon, recentlyRevised, fullyRevised, userChapters)}
            </div>
        `;
    },

    switchTab: function (tabKey) {
        this.activeTab = tabKey;
        App.renderCurrentView();
    },

    renderActiveTabGrid: function (overdue, dueToday, dueSoon, recentlyRevised, fullyRevised, userChapters) {
        let list = [];
        let emptyMsg = '';

        if (this.activeTab === 'due') {
            list = [...overdue, ...dueToday];
            emptyMsg = '🎉 No revisions due today or overdue!';
        } else if (this.activeTab === 'soon') {
            list = dueSoon;
            emptyMsg = '⏳ No revisions coming due in the next 3 days.';
        } else if (this.activeTab === 'recent') {
            list = recentlyRevised;
            emptyMsg = '🔄 No chapters revised in the last 3 days.';
        } else if (this.activeTab === 'fully') {
            list = fullyRevised;
            emptyMsg = '🏆 Complete 5 revision passes on chapters to mark them Fully Revised!';
        }

        if (list.length === 0) {
            return `
                <div class="empty-chart-fallback py-5" style="grid-column: span 3;">
                    <p>${emptyMsg}</p>
                </div>`;
        }

        return list.map(ch => this.renderRevisionCard(ch, userChapters[ch.id])).join('');
    },

    renderRevisionCard: function (ch, uCh) {
        const revLvl = uCh ? uCh.revisionLevel || 0 : 0;
        const lastRev = UI.formatDate(uCh ? uCh.lastRevised : null);
        const nextRev = UI.formatDate(uCh ? uCh.nextRevision : null);
        const todayStr = getLocalTodayStr();

        let isOverdue = uCh && uCh.nextRevision && uCh.nextRevision < todayStr;
        let subIcon = '📚';
        if (ch.subject === 'chemistry') subIcon = '🧪';
        if (ch.subject === 'maths') subIcon = '📐';

        return `
            <div class="revision-item-card ${isOverdue ? 'card-overdue' : ''}">
                <div class="rev-card-header">
                    <div>
                        <div class="chip-row">
                            <span class="sub-pill-sm ${ch.subject}">${subIcon} ${ch.subject.toUpperCase()}</span>
                            <span class="std-badge">Class ${ch.standard}th</span>
                        </div>
                        <h4>${ch.title}</h4>
                    </div>
                    <span class="rev-level-badge">Rev Pass ${revLvl}</span>
                </div>

                <div class="rev-dates-info">
                    <div><span>Last Revised:</span> <strong>${lastRev}</strong></div>
                    <div><span>Next Due:</span> <strong class="${isOverdue ? 'text-red' : ''}">${nextRev}</strong></div>
                </div>

                <div class="rev-card-actions">
                    <button class="btn btn-primary btn-xs" onclick="RevisionView.markRevised('${ch.id}')">Mark Revised ✓</button>
                    <button class="btn btn-secondary btn-xs" onclick="RevisionView.snoozeModal('${ch.id}')">💤 Snooze</button>
                    <button class="btn btn-outline btn-xs" onclick="RevisionView.viewHistoryModal('${ch.id}')">📜 History</button>
                </div>
            </div>`;
    },

    markRevised: function (chId) {
        Storage.markChapterRevised(chId, 'Marked revised via Spaced Repetition');
        UI.showToast("Revision pass recorded! Next revision scheduled.", 'success');
        App.renderCurrentView();
    },

    snoozeModal: function (chId) {
        const html = `
            <div class="modal-form">
                <p>Postpone the next revision date for this chapter:</p>
                <div class="snooze-btn-group mt-3">
                    <button class="btn btn-secondary btn-full" onclick="RevisionView.doSnooze('${chId}', 1)">💤 Snooze +1 Day</button>
                    <button class="btn btn-secondary btn-full mt-2" onclick="RevisionView.doSnooze('${chId}', 3)">💤 Snooze +3 Days</button>
                </div>
            </div>
        `;
        UI.showModal('Snooze Revision', html, () => true);
    },

    doSnooze: function (chId, days) {
        Storage.snoozeChapterRevision(chId, days);
        UI.showToast(`Revision snoozed by +${days} day(s)!`, 'info');
        UI.closeModal();
        App.renderCurrentView();
    },

    viewHistoryModal: function (chId) {
        const state = Storage.get();
        const ch = (SYLLABUS || []).find(c => c.id === chId);
        const uCh = (state.chapters || {})[chId] || {};
        const history = uCh.revisionHistory || [];

        const html = `
            <div class="modal-form">
                <h4>Chronological Revision Log for ${ch ? ch.title : ''}</h4>
                <div class="history-list mt-3">
                    ${history.length === 0 ? '<p class="text-muted">No past revision history logged yet.</p>' :
                        history.map(h => `
                            <div class="history-item-row">
                                <div>
                                    <strong>${UI.formatDate(h.date)}</strong>
                                    <span>Pass ${h.revisionLevel}</span>
                                </div>
                                <p>${h.notes || 'Revision completed'}</p>
                            </div>`).join('')}
                </div>
            </div>
        `;

        UI.showModal(`Revision History: ${ch ? ch.title : ''}`, html, () => true);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RevisionView;
}
