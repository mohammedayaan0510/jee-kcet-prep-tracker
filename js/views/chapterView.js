/**
 * Chapter Tracker View Controller (Filterable & Searchable Table / Grid)
 */

const ChapterView = {
    filters: {
        subject: 'all',
        standard: 'all',
        status: 'all',
        search: ''
    },

    render: function (container, state) {
        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Chapter Tracker</h1>
                    <p>Filter, search, and update status for all 11th & 12th chapters across Physics, Chemistry, and Math.</p>
                </div>
            </div>

            <!-- Filters Bar -->
            <div class="chapter-filters-bar">
                <div class="filter-group">
                    <label>Search</label>
                    <input type="text" id="chapter-search-input" placeholder="🔍 Search chapter or unit..." value="${this.filters.search}" oninput="ChapterView.onSearchInput(this.value)">
                </div>

                <div class="filter-group">
                    <label>Subject</label>
                    <select onchange="ChapterView.onFilterChange('subject', this.value)">
                        <option value="all" ${this.filters.subject === 'all' ? 'selected' : ''}>All Subjects</option>
                        <option value="physics" ${this.filters.subject === 'physics' ? 'selected' : ''}>Physics</option>
                        <option value="chemistry" ${this.filters.subject === 'chemistry' ? 'selected' : ''}>Chemistry</option>
                        <option value="maths" ${this.filters.subject === 'maths' ? 'selected' : ''}>Mathematics</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label>Class / Standard</label>
                    <select onchange="ChapterView.onFilterChange('standard', this.value)">
                        <option value="all" ${this.filters.standard === 'all' ? 'selected' : ''}>All Standards</option>
                        <option value="11" ${this.filters.standard === '11' ? 'selected' : ''}>11th Standard</option>
                        <option value="12" ${this.filters.standard === '12' ? 'selected' : ''}>12th Standard</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label>Status</label>
                    <select onchange="ChapterView.onFilterChange('status', this.value)">
                        <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>All Statuses</option>
                        <option value="Not Started" ${this.filters.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="Learning" ${this.filters.status === 'Learning' ? 'selected' : ''}>Learning</option>
                        <option value="Completed" ${this.filters.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Revised" ${this.filters.status === 'Revised' ? 'selected' : ''}>Revised</option>
                        <option value="PYQs Completed" ${this.filters.status === 'PYQs Completed' ? 'selected' : ''}>PYQs Completed</option>
                    </select>
                </div>
            </div>

            <!-- Chapters Count Summary -->
            <div class="chapter-count-bar" id="chapter-count-summary">
                <!-- Summary updated dynamically -->
            </div>

            <!-- Chapter Table Container -->
            <div class="chapter-table-wrapper">
                <table class="chapter-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Chapter Name</th>
                            <th>Category</th>
                            <th>Topics Done</th>
                            <th>PYQs Solved</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="chapter-table-body">
                        <!-- Table rows updated dynamically -->
                    </tbody>
                </table>
            </div>
        `;

        this.renderTableContent(state);
    },

    renderTableContent: function (state) {
        const userChapters = (state || Storage.get()).chapters || {};
        const tbody = document.getElementById('chapter-table-body');
        const countBar = document.getElementById('chapter-count-summary');

        if (!tbody || !countBar) return;

        // Filter chapters based on active controls
        const filtered = (SYLLABUS || []).filter(ch => {
            if (this.filters.subject !== 'all' && ch.subject !== this.filters.subject) return false;
            if (this.filters.standard !== 'all' && ch.standard !== Number(this.filters.standard)) return false;

            const uCh = userChapters[ch.id] || {};
            const status = uCh.status || 'Not Started';
            if (this.filters.status !== 'all' && status !== this.filters.status) return false;

            if (this.filters.search.trim() !== '') {
                const q = this.filters.search.toLowerCase();
                const titleMatch = ch.title.toLowerCase().includes(q);
                const catMatch = (ch.category || '').toLowerCase().includes(q);
                if (!titleMatch && !catMatch) return false;
            }

            return true;
        });

        countBar.innerHTML = `<span>Showing <strong>${filtered.length}</strong> of <strong>${(SYLLABUS || []).length}</strong> chapters</span>`;

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">No chapters match the selected filters.</td>
                </tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(ch => {
            const uCh = userChapters[ch.id] || {};
            const status = uCh.status || 'Not Started';
            const topicsComp = uCh.topicsCompleted || [];
            const totalTopics = ch.topics ? ch.topics.length : 0;
            const pyqsSolved = uCh.pyqsSolved || 0;
            const targetPyqs = ch.targetPyqs || 50;

            let subIcon = '📚';
            if (ch.subject === 'chemistry') subIcon = '🧪';
            if (ch.subject === 'maths') subIcon = '📐';

            let statusBadge = 'status-not-started';
            if (status === 'Learning') statusBadge = 'status-learning';
            if (status === 'Completed') statusBadge = 'status-completed';
            if (status === 'Revised') statusBadge = 'status-revised';
            if (status === 'PYQs Completed') statusBadge = 'status-pyq';

            return `
                <tr>
                    <td><span class="sub-pill ${ch.subject}">${subIcon} ${ch.subject.toUpperCase()}</span></td>
                    <td><strong>Class ${ch.standard}th</strong></td>
                    <td><strong>${ch.title}</strong></td>
                    <td><span class="category-tag">${ch.category}</span></td>
                    <td>${topicsComp.length} / ${totalTopics}</td>
                    <td>
                        <div class="mini-pyq-bar">
                            <span>${pyqsSolved} / ${targetPyqs}</span>
                        </div>
                    </td>
                    <td>
                        <button class="status-btn ${statusBadge}" onclick="ChapterView.cycleStatus('${ch.id}')">
                            ${status}
                        </button>
                    </td>
                    <td>
                        <button class="btn-icon" title="Edit Chapter Details" onclick="ChapterView.openEditModal('${ch.id}')">✏️ Edit</button>
                    </td>
                </tr>`;
        }).join('');
    },

    onFilterChange: function (key, val) {
        this.filters[key] = val;
        this.renderTableContent();
    },

    onSearchInput: function (val) {
        this.filters.search = val;
        this.renderTableContent();
    },

    cycleStatus: function (chId) {
        const state = Storage.get();
        const currentStatus = state.chapters[chId] ? state.chapters[chId].status : 'Not Started';

        const statuses = ['Not Started', 'Learning', 'Completed', 'Revised', 'PYQs Completed'];
        const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
        const nextStatus = statuses[nextIdx];

        Storage.updateChapter(chId, { status: nextStatus });
        UI.showToast(`Updated to "${nextStatus}"`, 'success');
        this.renderTableContent();
    },

    openEditModal: function (chId) {
        const state = Storage.get();
        const ch = (SYLLABUS || []).find(c => c.id === chId);
        if (!ch) return;

        const uCh = state.chapters[chId] || {};

        const html = `
            <div class="modal-form">
                <div class="form-group">
                    <label>Chapter Name</label>
                    <input type="text" value="${ch.title}" disabled class="input-disabled">
                </div>

                <div class="form-group">
                    <label>Status</label>
                    <select id="modal-ch-status">
                        <option value="Not Started" ${uCh.status === 'Not Started' ? 'selected' : ''}>Not Started</option>
                        <option value="Learning" ${uCh.status === 'Learning' ? 'selected' : ''}>Learning</option>
                        <option value="Completed" ${uCh.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        <option value="Revised" ${uCh.status === 'Revised' ? 'selected' : ''}>Revised</option>
                        <option value="PYQs Completed" ${uCh.status === 'PYQs Completed' ? 'selected' : ''}>PYQs Completed</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>PYQs Solved Count</label>
                    <input type="number" id="modal-ch-pyqs" min="0" value="${uCh.pyqsSolved || 0}">
                </div>

                <div class="form-group">
                    <label>Revision Pass (0 - 3)</label>
                    <input type="number" id="modal-ch-rev" min="0" max="3" value="${uCh.revisionLevel || 0}">
                </div>

                <div class="form-group">
                    <label>Notes & Key Formulae Reminders</label>
                    <textarea id="modal-ch-notes" rows="3" placeholder="Add study notes or tricky questions to review...">${uCh.notes || ''}</textarea>
                </div>
            </div>
        `;

        UI.showModal(`Edit Chapter: ${ch.title}`, html, () => {
            const status = document.getElementById('modal-ch-status').value;
            const pyqsSolved = Math.max(0, Number(document.getElementById('modal-ch-pyqs').value) || 0);
            const revisionLevel = Math.max(0, Number(document.getElementById('modal-ch-rev').value) || 0);
            const notes = document.getElementById('modal-ch-notes').value;

            Storage.updateChapter(chId, { status, pyqsSolved, revisionLevel, notes });
            UI.showToast(`Saved changes for ${ch.title}`, 'success');
            ChapterView.renderTableContent();
            return true;
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChapterView;
}
