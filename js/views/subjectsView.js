/**
 * =========================================================
 * Subjects View Controller
 * =========================================================
 *
 * Subject Mastery layout:
 *
 * Subject
 *   ├── Class 11 / 1st PUC
 *   │     ├── Category
 *   │     │     ├── Chapter
 *   │     │     ├── Chapter
 *   │     │     └── ...
 *   │     └── Category
 *   │           └── ...
 *   │
 *   └── Class 12 / 2nd PUC
 *         ├── Category
 *         │     └── ...
 *         └── Category
 *               └── ...
 *
 * Chemistry additionally supports:
 *   All
 *   Physical Chemistry
 *   Inorganic Chemistry
 *   Organic Chemistry
 * =========================================================
 */

const SubjectsView = {

    // =====================================================
    // STATE
    // =====================================================

    activeSubject: 'physics',

    activeChemBranch: 'all',

    // Tracks collapsed Class 11 / Class 12 sections
    // Example:
    // physics_std_11
    // physics_std_12
    // chemistry_std_11
    // chemistry_std_12
    collapsed: {},

    searchQuery: '',

    statusFilter: 'all',


    // =====================================================
    // MAIN RENDER
    // =====================================================

    render: function (container, state) {

        const sub = this.activeSubject;

        const userChapters = state.chapters || {};

        // Get all chapters belonging to selected subject
        const allSubjectChapters = (SYLLABUS || []).filter(
            ch => ch.subject === sub
        );


        // =================================================
        // OVERALL SUBJECT STATISTICS
        // =================================================

        let totalCh = allSubjectChapters.length;

        let completedCh = 0;
        let learningCh = 0;
        let revisedCh = 0;
        let notStartedCh = 0;
        let pyqCh = 0;

        let totalTopics = 0;
        let completedTopics = 0;


        allSubjectChapters.forEach(ch => {

            const uCh = userChapters[ch.id] || {};

            const status = uCh.status || 'Not Started';


            // Chapter completion
            if (
                status === 'Completed' ||
                status === 'Revised' ||
                status === 'PYQs Completed'
            ) {
                completedCh++;
            }


            if (status === 'Learning') {
                learningCh++;
            }


            if (status === 'Not Started') {
                notStartedCh++;
            }


            if (
                status === 'Revised' ||
                status === 'PYQs Completed'
            ) {
                revisedCh++;
            }


            if (status === 'PYQs Completed') {
                pyqCh++;
            }


            // Topics
            if (Array.isArray(ch.topics)) {

                totalTopics += ch.topics.length;

                completedTopics += (
                    uCh.topicsCompleted || []
                ).length;
            }

        });


        // =================================================
        // PERCENTAGES
        // =================================================

        const pct = totalCh > 0
            ? Math.round((completedCh / totalCh) * 100)
            : 0;


        const topicPct = totalTopics > 0
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0;


        // =================================================
        // SUBJECT DISPLAY DATA
        // =================================================

        let subjTitle = '📚 Physics';

        if (sub === 'chemistry') {
            subjTitle = '🧪 Chemistry';
        }

        if (sub === 'maths') {
            subjTitle = '📐 Mathematics';
        }


        let ringColor = '#3b82f6';

        if (sub === 'chemistry') {
            ringColor = '#10b981';
        }

        if (sub === 'maths') {
            ringColor = '#f59e0b';
        }


        // =================================================
        // CHEMISTRY BRANCH TABS
        // =================================================

        let chemBranchHTML = '';

        if (sub === 'chemistry') {

            chemBranchHTML = `
                <div class="sub-branch-tabs mb-3">

                    <span class="branch-label">
                        Branch:
                    </span>

                    <button
                        class="tab-pill ${this.activeChemBranch === 'all' ? 'active' : ''}"
                        onclick="SubjectsView.setChemBranch('all')">
                        All
                    </button>

                    <button
                        class="tab-pill ${this.activeChemBranch === 'Physical Chemistry' ? 'active' : ''}"
                        onclick="SubjectsView.setChemBranch('Physical Chemistry')">
                        ⚗️ Physical
                    </button>

                    <button
                        class="tab-pill ${this.activeChemBranch === 'Inorganic Chemistry' ? 'active' : ''}"
                        onclick="SubjectsView.setChemBranch('Inorganic Chemistry')">
                        🔩 Inorganic
                    </button>

                    <button
                        class="tab-pill ${this.activeChemBranch === 'Organic Chemistry' ? 'active' : ''}"
                        onclick="SubjectsView.setChemBranch('Organic Chemistry')">
                        🌱 Organic
                    </button>

                </div>
            `;
        }


        // =================================================
        // PAGE HTML
        // =================================================

        container.innerHTML = `

            <div class="view-header">

                <div>

                    <h1>
                        Subject Mastery
                    </h1>

                    <p>
                        Detailed chapter-by-chapter tracking
                        organized by class and category.
                    </p>

                </div>


                <!-- SUBJECT TABS -->

                <div class="tab-pill-buttons">

                    <button
                        class="tab-pill ${sub === 'physics' ? 'active phy' : ''}"
                        onclick="SubjectsView.switchSubject('physics')">
                        📚 Physics
                    </button>


                    <button
                        class="tab-pill ${sub === 'chemistry' ? 'active chem' : ''}"
                        onclick="SubjectsView.switchSubject('chemistry')">
                        🧪 Chemistry
                    </button>


                    <button
                        class="tab-pill ${sub === 'maths' ? 'active math' : ''}"
                        onclick="SubjectsView.switchSubject('maths')">
                        📐 Mathematics
                    </button>

                </div>

            </div>



            <!-- =========================================
                 SUBJECT OVERVIEW
                 ========================================= -->

            <div class="subject-summary-banner ${sub}">

                <div class="summary-text-box">

                    <h2>
                        ${subjTitle} — Syllabus Overview
                    </h2>

                    <p>
                        11th &amp; 12th Standard
                        • ${totalCh} Chapters
                        • ${totalTopics} Topics
                    </p>


                    <div class="summary-chips">

                        <span class="chip">
                            ✅ Completed:
                            <strong>${completedCh}</strong>
                        </span>

                        <span class="chip">
                            📖 Learning:
                            <strong>${learningCh}</strong>
                        </span>

                        <span class="chip">
                            ⬜ Not Started:
                            <strong>${notStartedCh}</strong>
                        </span>

                        <span class="chip">
                            🔄 Revised:
                            <strong>${revisedCh}</strong>
                        </span>

                        <span class="chip">
                            📝 Topics:
                            <strong>
                                ${completedTopics}/${totalTopics}
                                (${topicPct}%)
                            </strong>
                        </span>

                    </div>

                </div>


                <div class="summary-ring-box">

                    ${UI.createProgressRing(
                        pct,
                        55,
                        9,
                        ringColor
                    )}

                </div>

            </div>



            <!-- =========================================
                 SEARCH + FILTER
                 ========================================= -->

            <div class="subjects-filter-bar">

                <div class="filter-group">

                    <label>
                        🔍 Search Chapters
                    </label>

                    <input
                        type="text"
                        id="subjects-search"
                        placeholder="Search chapter name..."
                        value="${this.escapeHTML(this.searchQuery)}"
                        oninput="SubjectsView.onSearch(this.value)"
                    >

                </div>


                <div class="filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        onchange="SubjectsView.onStatusFilter(this.value)"
                    >

                        <option
                            value="all"
                            ${this.statusFilter === 'all' ? 'selected' : ''}>
                            All Statuses
                        </option>

                        <option
                            value="Not Started"
                            ${this.statusFilter === 'Not Started' ? 'selected' : ''}>
                            Not Started
                        </option>

                        <option
                            value="Learning"
                            ${this.statusFilter === 'Learning' ? 'selected' : ''}>
                            Learning
                        </option>

                        <option
                            value="Completed"
                            ${this.statusFilter === 'Completed' ? 'selected' : ''}>
                            Completed
                        </option>

                        <option
                            value="Revised"
                            ${this.statusFilter === 'Revised' ? 'selected' : ''}>
                            Revised
                        </option>

                        <option
                            value="PYQs Completed"
                            ${this.statusFilter === 'PYQs Completed' ? 'selected' : ''}>
                            PYQs Completed
                        </option>

                    </select>

                </div>

            </div>



            <!-- =========================================
                 CHEMISTRY BRANCH FILTER
                 ========================================= -->

            ${chemBranchHTML}



            <!-- =========================================
                 GROUPED CHAPTERS
                 ========================================= -->

            <div id="subjects-chapter-groups">

                ${this.renderChapterGroups(
                    allSubjectChapters,
                    userChapters,
                    sub
                )}

            </div>

        `;
    },


    // =====================================================
    // RENDER CHAPTER GROUPS
    // =====================================================

    renderChapterGroups: function (
        allChapters,
        userChapters,
        sub
    ) {

        // -----------------------------------------------
        // FILTER
        // -----------------------------------------------

        const filtered = allChapters.filter(ch => {

            const uCh = userChapters[ch.id] || {};

            const status =
                uCh.status || 'Not Started';


            // Status filter
            if (
                this.statusFilter !== 'all' &&
                status !== this.statusFilter
            ) {
                return false;
            }


            // Search
            if (this.searchQuery.trim()) {

                const q =
                    this.searchQuery
                        .trim()
                        .toLowerCase();


                const title =
                    (ch.title || '').toLowerCase();


                const category =
                    (ch.category || '').toLowerCase();


                if (
                    !title.includes(q) &&
                    !category.includes(q)
                ) {
                    return false;
                }

            }


            // Chemistry branch
            if (
                sub === 'chemistry' &&
                this.activeChemBranch !== 'all'
            ) {

                if (
                    ch.category !==
                    this.activeChemBranch
                ) {
                    return false;
                }

            }


            return true;

        });


        // -----------------------------------------------
        // EMPTY STATE
        // -----------------------------------------------

        if (filtered.length === 0) {

            return `
                <div class="empty-chart-fallback py-5">

                    <p>
                        🔍 No chapters match your search or filter.
                    </p>

                    <span>
                        Try changing the status filter
                        or clearing the search.
                    </span>

                </div>
            `;
        }


        // -----------------------------------------------
        // CLASS 11 / CLASS 12
        // -----------------------------------------------

        const std11 =
            filtered.filter(
                ch => Number(ch.standard) === 11
            );


        const std12 =
            filtered.filter(
                ch => Number(ch.standard) === 12
            );


        let html = '';


        // Class 11
        if (std11.length > 0) {

            const key =
                `${sub}_std_11`;

            const isCollapsed =
                this.collapsed[key] === true;


            html += this.renderStandardSection(
                'Class 11 / 1st PUC',
                key,
                std11,
                userChapters,
                isCollapsed,
                sub
            );

        }


        // Class 12
        if (std12.length > 0) {

            const key =
                `${sub}_std_12`;

            const isCollapsed =
                this.collapsed[key] === true;


            html += this.renderStandardSection(
                'Class 12 / 2nd PUC',
                key,
                std12,
                userChapters,
                isCollapsed,
                sub
            );

        }


        return html;
    },


    // =====================================================
    // RENDER STANDARD SECTION
    // =====================================================

    renderStandardSection: function (
        label,
        sectionKey,
        chapters,
        userChapters,
        isCollapsed,
        sub
    ) {

        // -----------------------------------------------
        // GROUP BY CATEGORY
        // -----------------------------------------------

        const catGroups = {};


        chapters.forEach(ch => {

            const cat =
                ch.category || 'General';


            if (!catGroups[cat]) {
                catGroups[cat] = [];
            }


            catGroups[cat].push(ch);

        });


        // -----------------------------------------------
        // SECTION PROGRESS
        // -----------------------------------------------

        const completedInSection =
            chapters.filter(ch => {

                const status =
                    (userChapters[ch.id] || {})
                        .status || 'Not Started';


                return (
                    status === 'Completed' ||
                    status === 'Revised' ||
                    status === 'PYQs Completed'
                );

            }).length;


        const sectionPct =
            chapters.length > 0
                ? Math.round(
                    (completedInSection /
                        chapters.length) * 100
                )
                : 0;


        // -----------------------------------------------
        // SECTION HTML
        // -----------------------------------------------

        return `

            <div class="std-section-block">


                <!-- SECTION HEADER -->

                <div
                    class="std-section-header"
                    data-section-key="${sectionKey}"
                    onclick="SubjectsView.toggleSection('${sectionKey}')"
                >

                    <div class="std-section-title-row">

                        <span
                            class="std-collapse-arrow"
                            data-arrow-key="${sectionKey}">
                            ${isCollapsed ? '▶' : '▼'}
                        </span>


                        <h2>
                            ${label}
                        </h2>


                        <span class="std-section-meta">

                            ${chapters.length}
                            chapters

                            •
                            
                            ${completedInSection}
                            completed

                            (${sectionPct}%)

                        </span>

                    </div>


                    <div class="std-section-progress-bar">

                        <div
                            class="std-section-progress-fill ${sub}"
                            style="width: ${sectionPct}%">
                        </div>

                    </div>

                </div>



                <!-- SECTION BODY -->

                <div
                    class="std-section-body ${isCollapsed ? 'collapsed' : ''}"
                    data-body-key="${sectionKey}"
                >

                    ${
                        Object.entries(catGroups)
                            .map(
                                ([catName, catChapters]) => `

                                <div class="category-group-block">

                                    <div class="category-group-label">

                                        📂
                                        ${this.escapeHTML(catName)}

                                    </div>


                                    <div class="chapter-cards-list">

                                        ${
                                            catChapters
                                                .map(
                                                    (ch, idx) =>
                                                        this.renderChapterCard(
                                                            ch,
                                                            userChapters[ch.id] || {},
                                                            idx + 1
                                                        )
                                                )
                                                .join('')
                                        }

                                    </div>

                                </div>

                            `
                            )
                            .join('')
                    }

                </div>

            </div>

        `;
    },


    // =====================================================
    // RENDER INDIVIDUAL CHAPTER CARD
    // =====================================================

    renderChapterCard: function (
        ch,
        uCh,
        num
    ) {

        const status =
            uCh.status || 'Not Started';


        const topicsComp =
            Array.isArray(uCh.topicsCompleted)
                ? uCh.topicsCompleted
                : [];


        const totalTopics =
            Array.isArray(ch.topics)
                ? ch.topics.length
                : 0;


        const pyqsSolved =
            Number(uCh.pyqsSolved) || 0;


        const targetPyqs =
            Number(ch.targetPyqs) || 50;


        const revLevel =
            Number(uCh.revisionLevel) || 0;


        // -----------------------------------------------
        // CHAPTER PROGRESS
        // -----------------------------------------------

        let chProgress = 0;


        if (status === 'Learning') {

            chProgress =
                Math.max(
                    10,
                    totalTopics > 0
                        ? Math.round(
                            (topicsComp.length /
                                totalTopics) * 70
                        )
                        : 30
                );

        }

        else if (status === 'Completed') {

            chProgress = 75;

        }

        else if (status === 'Revised') {

            chProgress = 90;

        }

        else if (status === 'PYQs Completed') {

            chProgress = 100;

        }


        // -----------------------------------------------
        // STATUS BADGE
        // -----------------------------------------------

        let badgeClass =
            'status-not-started';


        if (status === 'Learning') {
            badgeClass = 'status-learning';
        }

        else if (status === 'Completed') {
            badgeClass = 'status-completed';
        }

        else if (status === 'Revised') {
            badgeClass = 'status-revised';
        }

        else if (status === 'PYQs Completed') {
            badgeClass = 'status-pyq';
        }


        // -----------------------------------------------
        // PYQ %
        // -----------------------------------------------

        const pyqPct =
            targetPyqs > 0
                ? Math.min(
                    100,
                    Math.round(
                        (pyqsSolved /
                            targetPyqs) * 100
                    )
                )
                : 0;


        // -----------------------------------------------
        // TOPICS
        // -----------------------------------------------

        const topicsHTML =
            (ch.topics || [])
                .map((topic, idx) => {

                    const isChecked =
                        topicsComp.includes(idx);


                    return `

                        <label
                            class="topic-check-item ${isChecked ? 'done' : ''}"
                        >

                            <input
                                type="checkbox"
                                ${isChecked ? 'checked' : ''}
                                onchange="
                                    SubjectsView.toggleTopicCheck(
                                        '${ch.id}',
                                        ${idx}
                                    )
                                "
                            >

                            <span>
                                ${this.escapeHTML(topic)}
                            </span>

                        </label>

                    `;

                })
                .join('');


        // -----------------------------------------------
        // CARD
        // -----------------------------------------------

        return `

            <div
                class="chapter-mastery-card"
                id="card_${ch.id}"
            >

                <div class="chapter-card-main">


                    <!-- NUMBER -->

                    <div class="chapter-num-badge">
                        ${num}
                    </div>


                    <!-- INFORMATION -->

                    <div class="chapter-card-info">

                        <div class="chapter-card-title-row">

                            <h4>
                                ${this.escapeHTML(ch.title)}
                            </h4>


                            <button
                                class="status-btn ${badgeClass}"
                                onclick="SubjectsView.toggleChapterStatus('${ch.id}')"
                                title="Click to cycle status"
                            >
                                ${this.escapeHTML(status)}
                            </button>

                        </div>


                        <!-- PROGRESS -->

                        <div
                            class="progress-bar-container"
                            style="margin: 8px 0;"
                        >

                            <div
                                class="progress-bar-fill ${ch.subject}"
                                style="width: ${chProgress}%;"
                            ></div>

                        </div>


                        <!-- STATISTICS -->

                        <div class="chapter-card-stats-row">

                            <span class="card-stat-chip">

                                📝 Topics:

                                <strong>
                                    ${topicsComp.length}/${totalTopics}
                                </strong>

                            </span>


                            <span class="card-stat-chip">

                                🎯 PYQs:

                                <strong>
                                    ${pyqsSolved}/${targetPyqs}
                                </strong>

                            </span>


                            ${
                                revLevel > 0
                                    ? `
                                        <span class="card-stat-chip">

                                            🔄 Rev:

                                            <strong>
                                                Pass ${revLevel}
                                            </strong>

                                        </span>
                                      `
                                    : ''
                            }


                            <span class="card-stat-chip pyq-pct-chip">

                                ${pyqPct}%
                                PYQ done

                            </span>

                        </div>

                    </div>


                    <!-- TOPICS BUTTON -->

                    <button
                        class="topics-toggle-btn"
                        onclick="SubjectsView.toggleTopicView('${ch.id}')"
                        title="Show / Hide topics"
                    >
                        Topics ▼
                    </button>

                </div>



                <!-- =====================================
                     TOPIC CHECKLIST
                     ===================================== -->

                <div
                    class="topic-checklist"
                    id="topics_${ch.id}"
                    style="display: none;"
                >

                    <div class="topics-grid">

                        ${topicsHTML}

                    </div>

                </div>

            </div>

        `;
    },


    // =====================================================
    // SUBJECT SWITCH
    // =====================================================

    switchSubject: function (sub) {

        this.activeSubject = sub;

        // Reset Chemistry branch when switching subjects
        this.activeChemBranch = 'all';

        // Reset filters
        this.searchQuery = '';

        this.statusFilter = 'all';

        App.renderCurrentView();
    },


    // =====================================================
    // CHEMISTRY BRANCH
    // =====================================================

    setChemBranch: function (branch) {

        this.activeChemBranch = branch;

        App.renderCurrentView();
    },


    // =====================================================
    // COLLAPSE / EXPAND STANDARD
    // =====================================================

    toggleSection: function (key) {

        this.collapsed[key] =
            !this.collapsed[key];


        const body =
            document.querySelector(
                `[data-body-key="${key}"]`
            );


        const arrow =
            document.querySelector(
                `[data-arrow-key="${key}"]`
            );


        if (body) {

            body.classList.toggle(
                'collapsed',
                this.collapsed[key]
            );

        }


        if (arrow) {

            arrow.textContent =
                this.collapsed[key]
                    ? '▶'
                    : '▼';

        }


        // If partial elements aren't available,
        // fall back to full render.
        if (!body) {

            App.renderCurrentView();

        }

    },


    // =====================================================
    // SEARCH
    // =====================================================

    onSearch: function (val) {

        this.searchQuery = val;


        const state =
            Storage.get();


        const allSubjectChapters =
            (SYLLABUS || []).filter(
                ch =>
                    ch.subject ===
                    this.activeSubject
            );


        const groupContainer =
            document.getElementById(
                'subjects-chapter-groups'
            );


        if (groupContainer) {

            groupContainer.innerHTML =
                this.renderChapterGroups(
                    allSubjectChapters,
                    state.chapters || {},
                    this.activeSubject
                );

        }

    },


    // =====================================================
    // STATUS FILTER
    // =====================================================

    onStatusFilter: function (val) {

        this.statusFilter = val;


        const state =
            Storage.get();


        const allSubjectChapters =
            (SYLLABUS || []).filter(
                ch =>
                    ch.subject ===
                    this.activeSubject
            );


        const groupContainer =
            document.getElementById(
                'subjects-chapter-groups'
            );


        if (groupContainer) {

            groupContainer.innerHTML =
                this.renderChapterGroups(
                    allSubjectChapters,
                    state.chapters || {},
                    this.activeSubject
                );

        }

    },


    // =====================================================
    // CHAPTER STATUS
    // =====================================================

    toggleChapterStatus: function (chId) {

        const state =
            Storage.get();


        const currentStatus =
            (
                state.chapters[chId] || {}
            ).status || 'Not Started';


        const statuses = [
            'Not Started',
            'Learning',
            'Completed',
            'Revised',
            'PYQs Completed'
        ];


        const currentIndex =
            statuses.indexOf(currentStatus);


        const nextIndex =
            currentIndex >= 0
                ? (currentIndex + 1) %
                    statuses.length
                : 0;


        const nextStatus =
            statuses[nextIndex];


        Storage.updateChapter(
            chId,
            {
                status: nextStatus
            }
        );


        UI.showToast(
            `Updated to "${nextStatus}"`,
            'success'
        );


        // ---------------------------------------------
        // Update only this card
        // ---------------------------------------------

        const newState =
            Storage.get();


        const ch =
            (SYLLABUS || []).find(
                c => c.id === chId
            );


        if (!ch) {

            App.renderCurrentView();

            return;

        }


        const uCh =
            newState.chapters[chId] || {};


        const cardEl =
            document.getElementById(
                `card_${chId}`
            );


        if (cardEl) {

            // Find the chapter position
            // inside its category.
            const siblings =
                (SYLLABUS || []).filter(
                    c =>
                        c.subject === ch.subject &&
                        Number(c.standard) ===
                            Number(ch.standard) &&
                        (c.category || 'General') ===
                            (ch.category || 'General')
                );


            const idx =
                siblings.findIndex(
                    c => c.id === chId
                );


            cardEl.outerHTML =
                this.renderChapterCard(
                    ch,
                    uCh,
                    idx + 1
                );

        }

        else {

            App.renderCurrentView();

        }

    },


    // =====================================================
    // TOPIC VIEW
    // =====================================================

    toggleTopicView: function (chId) {

        const el =
            document.getElementById(
                `topics_${chId}`
            );


        if (!el) {
            return;
        }


        const isHidden =
            el.style.display === 'none' ||
            el.style.display === '';


        el.style.display =
            isHidden
                ? 'block'
                : 'none';


        const card =
            el.closest(
                '.chapter-mastery-card'
            );


        if (card) {

            const btn =
                card.querySelector(
                    '.topics-toggle-btn'
                );


            if (btn) {

                btn.textContent =
                    isHidden
                        ? 'Topics ▲'
                        : 'Topics ▼';

            }

        }

    },


    // =====================================================
    // TOPIC CHECKBOX
    // =====================================================

    toggleTopicCheck: function (
        chId,
        topicIdx
    ) {

        const state =
            Storage.get();


        const uCh =
            state.chapters[chId] || {};


        let topicsComp =
            Array.isArray(
                uCh.topicsCompleted
            )
                ? [...uCh.topicsCompleted]
                : [];


        // Toggle topic
        if (
            topicsComp.includes(topicIdx)
        ) {

            topicsComp =
                topicsComp.filter(
                    i => i !== topicIdx
                );

        }

        else {

            topicsComp.push(topicIdx);

        }


        Storage.updateChapter(
            chId,
            {
                topicsCompleted:
                    topicsComp
            }
        );


        // ---------------------------------------------
        // Update checkbox styling without
        // completely rebuilding the page.
        // ---------------------------------------------

        const topicContainer =
            document.getElementById(
                `topics_${chId}`
            );


        if (!topicContainer) {
            return;
        }


        const labels =
            topicContainer.querySelectorAll(
                '.topic-check-item'
            );


        const label =
            labels[topicIdx];


        if (label) {

            label.classList.toggle(
                'done',
                topicsComp.includes(topicIdx)
            );

        }

    },


    // =====================================================
    // HTML ESCAPE HELPER
    // =====================================================

    escapeHTML: function (value) {

        if (value === null ||
            value === undefined) {
            return '';
        }


        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    }

};


// =========================================================
// COMMONJS SUPPORT
// =========================================================

if (
    typeof module !== 'undefined' &&
    module.exports
) {

    module.exports = SubjectsView;

}