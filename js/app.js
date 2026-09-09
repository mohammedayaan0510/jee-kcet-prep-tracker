/**
 * Main Application Router & Controller
 */

function getLocalTodayStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const App = {
    currentTab: 'dashboard',
    state: null,

    init: function () {
        // Initialize Storage state and migration
        this.state = Storage.init();

        // Initialize Theme
        UI.initTheme(this.state.settings ? this.state.settings.theme : 'light');

        // Setup Sidebar / Mobile Nav Navigation
        this.setupNavigation();

        // Initial View Render
        this.renderCurrentView();

        console.log("JEE & KCET Preparation Tracker Initialized Successfully.");
    },

    setupNavigation: function () {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                if (tab) {
                    this.switchTab(tab);

                    // Close mobile navigation drawer if open
                    const sidebar = document.getElementById('sidebar-container');
                    if (sidebar) sidebar.classList.remove('mobile-open');
                }
            });
        });

        // Mobile drawer toggle
        const toggleBtn = document.getElementById('mobile-nav-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar-container');
                if (sidebar) sidebar.classList.toggle('mobile-open');
            });
        }
    },

    switchTab: function (tabId) {
        this.currentTab = tabId;

        // Update Nav UI active state
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        this.renderCurrentView();
        window.scrollTo(0, 0);
    },

    renderCurrentView: function () {
        const container = document.getElementById('main-content-view');
        if (!container) return;

        // Refresh state
        this.state = Storage.get();

        switch (this.currentTab) {
            case 'dashboard':
                DashboardView.render(container, this.state);
                break;
            case 'planner':
                PlannerView.render(container, this.state);
                break;
            case 'weakness':
                WeaknessView.render(container, this.state);
                break;
            case 'subjects':
                SubjectsView.render(container, this.state);
                break;
            case 'exams':
                ExamView.render(container, this.state);
                break;
            case 'chapters':
                ChapterView.render(container, this.state);
                break;
            case 'study':
                StudyView.render(container, this.state);
                break;
            case 'pyq':
                PyqView.render(container, this.state);
                break;
            case 'mocktests':
                MockTestView.render(container, this.state);
                break;
            case 'revision':
                RevisionView.render(container, this.state);
                break;
            case 'analytics':
                AnalyticsView.render(container, this.state);
                break;
            default:
                DashboardView.render(container, this.state);
        }
    },

    openLogStudyModal: function () {
        const todayStr = getLocalTodayStr();
        const html = `
            <div class="modal-form">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="modal-log-date" value="${todayStr}">
                </div>

                <div class="form-group">
                    <label>Subject</label>
                    <select id="modal-log-subject">
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                        <option value="maths">Mathematics</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Study Hours Logged</label>
                    <input type="number" id="modal-log-hours" min="0" step="0.5" placeholder="e.g. 3.5">
                </div>

                <div class="form-group">
                    <label>Questions Solved</label>
                    <input type="number" id="modal-log-questions" min="0" placeholder="e.g. 40">
                </div>

                <div class="form-group">
                    <label>Chapters Completed Today</label>
                    <input type="number" id="modal-log-chapters" min="0" value="0">
                </div>

                <div class="form-group">
                    <label>Session Notes</label>
                    <textarea id="modal-log-notes" rows="2" placeholder="Topics studied, weak areas identified..."></textarea>
                </div>
            </div>
        `;

        UI.showModal('⏱️ Log Study Session', html, () => {
            const date = document.getElementById('modal-log-date').value || todayStr;
            const subject = document.getElementById('modal-log-subject').value;
            const hours = Math.max(0, Number(document.getElementById('modal-log-hours').value) || 0);
            const questions = Math.max(0, Number(document.getElementById('modal-log-questions').value) || 0);
            const chaptersCompleted = Math.max(0, Number(document.getElementById('modal-log-chapters').value) || 0);
            const notes = document.getElementById('modal-log-notes').value;

            if (hours <= 0 && questions <= 0) {
                UI.showToast("Please enter valid study hours or questions solved.", 'error');
                return false;
            }

            Storage.addStudyLog({ date, subject, hours, questions, chaptersCompleted, notes });
            UI.showToast("Study session logged successfully!", 'success');
            App.renderCurrentView();
            return true;
        });
    },

    openMockTestModal: function () {
        const todayStr = getLocalTodayStr();
        const html = `
            <div class="modal-form">
                <div class="form-group">
                    <label>Test Title / Name</label>
                    <input type="text" id="modal-test-title" placeholder="e.g. Full Syllabus Mock Test 01">
                </div>

                <div class="form-group">
                    <label>Target Exam</label>
                    <select id="modal-test-exam">
                        <option value="JEE Main">JEE Main</option>
                        <option value="JEE Advanced">JEE Advanced</option>
                        <option value="KCET">KCET</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Date Conducted</label>
                    <input type="date" id="modal-test-date" value="${todayStr}">
                </div>

                <div class="form-row-3">
                    <div class="form-group">
                        <label>Physics Marks</label>
                        <input type="number" id="modal-test-phy" value="0">
                    </div>
                    <div class="form-group">
                        <label>Chemistry Marks</label>
                        <input type="number" id="modal-test-chem" value="0">
                    </div>
                    <div class="form-group">
                        <label>Maths Marks</label>
                        <input type="number" id="modal-test-math" value="0">
                    </div>
                </div>

                <div class="form-row-2">
                    <div class="form-group">
                        <label>Max Marks</label>
                        <input type="number" id="modal-test-max" value="300" min="1">
                    </div>
                    <div class="form-group">
                        <label>Accuracy %</label>
                        <input type="number" id="modal-test-acc" min="0" max="100" placeholder="e.g. 85">
                    </div>
                </div>

                <div class="form-group">
                    <label>Duration (Minutes)</label>
                    <input type="number" id="modal-test-dur" value="180" min="1">
                </div>
            </div>
        `;

        UI.showModal('📝 Record Mock Test', html, () => {
            const title = document.getElementById('modal-test-title').value.trim() || 'Mock Test';
            const exam = document.getElementById('modal-test-exam').value;
            const date = document.getElementById('modal-test-date').value || todayStr;
            const phyScore = Number(document.getElementById('modal-test-phy').value) || 0;
            const chemScore = Number(document.getElementById('modal-test-chem').value) || 0;
            const mathScore = Number(document.getElementById('modal-test-math').value) || 0;
            const maxMarks = Math.max(1, Number(document.getElementById('modal-test-max').value) || 300);
            const accuracy = Math.max(0, Math.min(100, Number(document.getElementById('modal-test-acc').value) || 0));
            const duration = Math.max(1, Number(document.getElementById('modal-test-dur').value) || 180);

            Storage.addMockTest({ title, exam, date, phyScore, chemScore, mathScore, maxMarks, accuracy, duration });
            UI.showToast("Mock test recorded!", 'success');
            App.renderCurrentView();
            return true;
        });
    },

    exportBackup: function () {
        Storage.exportJSON();
        UI.showToast("Backup file downloaded!", 'success');
    },

    importBackup: function (fileInput) {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const res = Storage.importJSON(e.target.result);
            if (res.success) {
                UI.showToast("Data restored successfully from backup!", 'success');
                this.renderCurrentView();
            } else {
                UI.showToast("Error importing data: " + res.error, 'error');
            }
            fileInput.value = '';
        };
        reader.readAsText(file);
    },

    confirmReset: function () {
        const userConfirmation = prompt("⚠️ WARNING: This will erase all your logged study sessions, mock tests, and chapter progress.\n\nTo confirm deletion, type 'RESET' below:");
        if (userConfirmation === 'RESET') {
            Storage.resetAll();
            UI.showToast("Data reset to factory defaults.", 'info');
            this.renderCurrentView();
        } else {
            UI.showToast("Reset cancelled.", 'info');
        }
    }
};

// Initialize App when window DOM loads
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
