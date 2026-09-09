/**
 * Weakness Analysis View Controller
 */

const WeaknessView = {
    activeSubject: 'all',

    render: function (container, state) {
        const userChapters = state.chapters || {};
        const allChapters = SYLLABUS || [];

        // Calculate weakness scores for all chapters
        const evaluated = allChapters.map(ch => {
            const wScore = SmartEngine.calculateWeaknessScore(ch.id, state);
            const prio = SmartEngine.calculatePriority(ch.id, state);
            return {
                ch,
                uCh: userChapters[ch.id] || {},
                wScore,
                prio
            };
        });

        // Filter by subject
        let filtered = evaluated.filter(item => {
            if (this.activeSubject !== 'all' && item.ch.subject !== this.activeSubject) return false;
            return true;
        });

        // Sort weakest first (highest wScore first; Insufficient Data at bottom)
        filtered.sort((a, b) => {
            if (a.wScore === null && b.wScore === null) return 0;
            if (a.wScore === null) return 1;
            if (b.wScore === null) return -1;
            return b.wScore - a.wScore;
        });

        // Count summary metrics
        let weakCount = 0;
        let attentionCount = 0;
        let strongCount = 0;
        let insufficientCount = 0;

        evaluated.forEach(item => {
            if (item.wScore === null) insufficientCount++;
            else if (item.wScore >= 75) weakCount++;
            else if (item.wScore >= 50) attentionCount++;
            else strongCount++;
        });

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Weakness Analysis Engine</h1>
                    <p>Identify concept gaps, low PYQ accuracy areas, and overdue revisions evaluated from your actual data.</p>
                </div>

                <!-- Subject selector tabs -->
                <div class="tab-pill-buttons">
                    <button class="tab-pill ${this.activeSubject === 'all' ? 'active' : ''}" onclick="WeaknessView.switchSubject('all')">All Subjects</button>
                    <button class="tab-pill ${this.activeSubject === 'physics' ? 'active phy' : ''}" onclick="WeaknessView.switchSubject('physics')">📚 Physics</button>
                    <button class="tab-pill ${this.activeSubject === 'chemistry' ? 'active chem' : ''}" onclick="WeaknessView.switchSubject('chemistry')">🧪 Chemistry</button>
                    <button class="tab-pill ${this.activeSubject === 'maths' ? 'active math' : ''}" onclick="WeaknessView.switchSubject('maths')">📐 Mathematics</button>
                </div>
            </div>

            <!-- Weakness Overview Summary Grid -->
            <div class="stats-overview-grid mb-4">
                <div class="stat-box">
                    <div class="stat-icon-wrapper red">🔴</div>
                    <div class="stat-info">
                        <span class="stat-value">${weakCount}</span>
                        <span class="stat-label">Critical Weak Chapters</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper fire">🟠</div>
                    <div class="stat-info">
                        <span class="stat-value">${attentionCount}</span>
                        <span class="stat-label">Needs Attention</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper green">🟢</div>
                    <div class="stat-info">
                        <span class="stat-value">${strongCount}</span>
                        <span class="stat-label">Strong Mastery</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper blue">⚪</div>
                    <div class="stat-info">
                        <span class="stat-value">${insufficientCount}</span>
                        <span class="stat-label">Insufficient Data</span>
                    </div>
                </div>
            </div>

            <!-- Weakest Chapters Grid -->
            <div class="section-title">
                <h2>⚠️ Priority Weak Chapters (Ranked Weakest First)</h2>
                <span>Showing ${filtered.length} Chapters</span>
            </div>

            <div class="weakness-cards-grid">
                ${filtered.map(item => this.renderWeaknessCard(item)).join('')}
            </div>
        `;
    },

    switchSubject: function (sub) {
        this.activeSubject = sub;
        App.renderCurrentView();
    },

    renderWeaknessCard: function (item) {
        const ch = item.ch;
        const uCh = item.uCh;
        const wScore = item.wScore;
        const prio = item.prio;

        let subIcon = '📚';
        if (ch.subject === 'chemistry') subIcon = '🧪';
        if (ch.subject === 'maths') subIcon = '📐';

        // Weakness badge & class
        let wBadge = '⚪ Insufficient Data';
        let wClass = 'weak-insufficient';
        let recText = 'Study chapter concepts & solve introductory PYQs';

        if (wScore !== null) {
            if (wScore >= 75) {
                wBadge = `🔴 Weak (${wScore}/100)`;
                wClass = 'weak-critical';
                recText = '⚠️ Revise core concepts + solve 20 PYQs';
            } else if (wScore >= 50) {
                wBadge = `🟠 Needs Attention (${wScore}/100)`;
                wClass = 'weak-attention';
                recText = '📝 Practice 15 speed PYQs & formulas';
            } else if (wScore >= 25) {
                wBadge = `🟡 Average (${wScore}/100)`;
                wClass = 'weak-average';
                recText = '🔄 Schedule Revision Pass';
            } else {
                wBadge = `🟢 Strong (${wScore}/100)`;
                wClass = 'weak-strong';
                recText = '🏆 Master high-difficulty Advanced PYQs';
            }
        }

        const totalTopics = ch.topics ? ch.topics.length : 0;
        const compTopics = uCh.topicsCompleted ? uCh.topicsCompleted.length : 0;
        const revComp = uCh.revisionsCompleted || 0;
        const pyqsSolved = uCh.pyqsSolved || 0;
        const lastStudied = UI.formatDate(uCh.lastStudied || uCh.lastRevised);

        return `
            <div class="weakness-card ${wClass}">
                <div class="weakness-card-top">
                    <div>
                        <div class="chip-row">
                            <span class="sub-pill-sm ${ch.subject}">${subIcon} ${ch.subject.toUpperCase()}</span>
                            <span class="std-badge">Class ${ch.standard}th</span>
                            <span class="prio-pill ${prio.badgeClass}">${prio.badge}</span>
                        </div>
                        <h3>${ch.title}</h3>
                    </div>
                    <div class="weakness-badge-box ${wClass}">${wBadge}</div>
                </div>

                <div class="weakness-metrics-row">
                    <div class="metric-item">
                        <span>Topics Completed</span>
                        <strong>${compTopics} / ${totalTopics}</strong>
                    </div>
                    <div class="metric-item">
                        <span>PYQs Solved</span>
                        <strong>${pyqsSolved} / ${ch.targetPyqs || 50}</strong>
                    </div>
                    <div class="metric-item">
                        <span>Revisions</span>
                        <strong>${revComp} Pass</strong>
                    </div>
                    <div class="metric-item">
                        <span>Last Studied</span>
                        <strong>${lastStudied}</strong>
                    </div>
                </div>

                <div class="weakness-rec-box">
                    <span>💡 Recommendation:</span>
                    <strong>${recText}</strong>
                </div>

                <div class="weakness-card-actions">
                    <button class="btn btn-secondary btn-xs" onclick="ChapterView.openEditModal('${ch.id}')">✏️ Edit Chapter</button>
                    <button class="btn btn-primary btn-xs" onclick="WeaknessView.markRevised('${ch.id}')">Mark Revised ✓</button>
                </div>
            </div>`;
    },

    markRevised: function (chId) {
        Storage.markChapterRevised(chId, 'Revised from Weakness Analysis');
        UI.showToast("Chapter revision pass recorded!", 'success');
        App.renderCurrentView();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeaknessView;
}
