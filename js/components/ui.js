/**
 * UI Utilities Component (Toasts, Modals, Theme, Progress Rings, Formatting)
 */

const UI = {
    /**
     * Initializes theme toggle listener
     */
    initTheme: function (theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },

    toggleTheme: function () {
        const isDark = document.body.classList.toggle('dark-theme');
        const state = Storage.get();
        state.settings.theme = isDark ? 'dark' : 'light';
        Storage.save(state);
        this.showToast(isDark ? '🌙 Dark Mode Enabled' : '☀️ Light Mode Enabled', 'info');
        return isDark;
    },

    /**
     * Shows toast notification
     */
    showToast: function (message, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = '✅';
        if (type === 'error') icon = '⚠️';
        if (type === 'info') icon = 'ℹ️';

        toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Generates SVG Circular Progress Ring Markup with correct SVG radius formula
     */
    createProgressRing: function (percent, radius = 40, stroke = 8, color = '#6366f1') {
        const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
        const normalizedRadius = radius - stroke / 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const strokeDashoffset = circumference - (safePercent / 100) * circumference;

        return `
            <div class="progress-ring-wrapper" style="width:${radius*2}px; height:${radius*2}px;">
                <svg height="${radius * 2}" width="${radius * 2}" class="progress-ring">
                    <circle
                        stroke="rgba(0,0,0,0.08)"
                        fill="transparent"
                        stroke-width="${stroke}"
                        r="${normalizedRadius}"
                        cx="${radius}"
                        cy="${radius}"
                    />
                    <circle
                        stroke="${color}"
                        fill="transparent"
                        stroke-width="${stroke}"
                        stroke-linecap="round"
                        stroke-dasharray="${circumference} ${circumference}"
                        style="stroke-dashoffset: ${strokeDashoffset}"
                        r="${normalizedRadius}"
                        cx="${radius}"
                        cy="${radius}"
                    />
                </svg>
                <div class="progress-ring-text">${safePercent}%</div>
            </div>
        `;
    },

    /**
     * Modal Helper: Shows a modal with custom title, body HTML, and submit handler
     */
    showModal: function (title, bodyHtml, onSubmit) {
        let modal = document.getElementById('app-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'app-modal';
            modal.className = 'modal-backdrop';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="UI.closeModal()">&times;</button>
                </div>
                <div class="modal-body">${bodyHtml}</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
                    <button class="btn btn-primary" id="modal-submit-btn">Save / Submit</button>
                </div>
            </div>
        `;

        modal.classList.add('active');

        document.getElementById('modal-submit-btn').onclick = () => {
            if (onSubmit()) {
                UI.closeModal();
            }
        };
    },

    closeModal: function () {
        const modal = document.getElementById('app-modal');
        if (modal) modal.classList.remove('active');
    },

    /**
     * Calculates readiness score for JEE Main, JEE Advanced, KCET accurately
     */
    calculateExamReadiness: function (state, exam) {
        const chapters = state.chapters || {};
        const allSyllabus = SYLLABUS || [];

        // Match exam key accurately
        let key = 'jeeMain';
        const lowerExam = (exam || '').toLowerCase();
        if (lowerExam.includes('adv')) key = 'jeeAdvanced';
        else if (lowerExam.includes('kcet')) key = 'kcet';

        const examSyllabus = allSyllabus.filter(ch => ch[key]);

        if (examSyllabus.length === 0) return { overall: 0, syllabus: 0, pyq: 0, mock: 0, revision: 0 };

        let completedCount = 0;
        let revisedCount = 0;
        let pyqDoneCount = 0;

        examSyllabus.forEach(ch => {
            const userCh = chapters[ch.id] || {};
            const status = userCh.status || 'Not Started';

            if (status === 'Completed' || status === 'Revised' || status === 'PYQs Completed') {
                completedCount++;
            }
            if (status === 'Revised' || status === 'PYQs Completed' || (userCh.revisionLevel && userCh.revisionLevel > 0)) {
                revisedCount++;
            }
            if (status === 'PYQs Completed' || (userCh.pyqsSolved && userCh.pyqsSolved >= ch.targetPyqs)) {
                pyqDoneCount++;
            }
        });

        const total = examSyllabus.length;
        const syllabusPct = Math.round((completedCount / total) * 100);
        const revisionPct = Math.round((revisedCount / total) * 100);
        const pyqPct = Math.round((pyqDoneCount / total) * 100);

        // Filter mock tests matching exam name
        const examTests = (state.mockTests || []).filter(t => {
            const tExam = (t.exam || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const targetExamNorm = key.toLowerCase();
            return tExam.includes(targetExamNorm) || targetExamNorm.includes(tExam);
        });

        let mockPct = 0;
        if (examTests.length > 0) {
            const totalScorePctSum = examTests.reduce((acc, t) => acc + ((t.totalScore || 0) / (t.maxMarks || 300)) * 100, 0);
            mockPct = Math.min(100, Math.round(totalScorePctSum / examTests.length));
        }

        // Weighted Overall Readiness Formula: 40% Syllabus, 25% Revision, 20% PYQs, 15% Mock Tests
        const overall = Math.round(
            (syllabusPct * 0.4) +
            (revisionPct * 0.25) +
            (pyqPct * 0.20) +
            (mockPct * 0.15)
        );

        return {
            overall: Math.min(100, overall),
            syllabus: syllabusPct,
            revision: revisionPct,
            pyq: pyqPct,
            mock: mockPct
        };
    },

    /**
     * Format date helper (Timezone-safe for YYYY-MM-DD strings and Date objects)
     */
    formatDate: function (dateVal) {
        if (!dateVal) return 'N/A';
        let d;
        if (dateVal instanceof Date) {
            d = dateVal;
        } else if (typeof dateVal === 'string' && dateVal.includes('-') && !dateVal.includes('T')) {
            const [y, m, day] = dateVal.split('-').map(Number);
            d = new Date(y, m - 1, day);
        } else {
            d = new Date(dateVal);
        }
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
