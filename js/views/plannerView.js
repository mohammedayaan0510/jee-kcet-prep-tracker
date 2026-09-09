/**
 * Today's Daily Planner View Controller
 */

const PlannerView = {
    selectedDate: null,

    render: function (container, state) {
        if (!this.selectedDate) {
            this.selectedDate = getLocalTodayStr();
        }
        const todayStr = this.selectedDate;
        const plan = Storage.getDailyPlan(todayStr);
        const tasks = plan.tasks || [];


        // Calculate planned vs completed hours and questions
        let plannedMins = 0;
        let completedMins = 0;
        let plannedQ = 0;
        let completedQ = 0;
        let completedTasksCount = 0;

        tasks.forEach(t => {
            const mins = Number(t.durationMins) || 30;
            const q = Number(t.questions) || 0;
            plannedMins += mins;
            plannedQ += q;

            if (t.completed) {
                completedMins += mins;
                completedQ += q;
                completedTasksCount++;
            }
        });

        const plannedHours = (plannedMins / 60).toFixed(1);
        const completedHours = (completedMins / 60).toFixed(1);
        const remainingHours = Math.max(0, (plannedMins - completedMins) / 60).toFixed(1);
        const completionPct = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

        // Group tasks by subject / category
        const groups = {
            physics: [],
            chemistry: [],
            maths: [],
            revision: [],
            custom: []
        };

        tasks.forEach(t => {
            const sub = (t.subject || '').toLowerCase();
            if (t.type === 'revision') groups.revision.push(t);
            else if (sub.includes('phy')) groups.physics.push(t);
            else if (sub.includes('chem')) groups.chemistry.push(t);
            else if (sub.includes('math')) groups.maths.push(t);
            else groups.custom.push(t);
        });

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Today's Daily Study Planner</h1>
                    <p>Structured task list auto-generated from your due revisions, weak chapters, and daily goals.</p>
                </div>

                <div class="header-action-group">
                    <input type="date" id="planner-date-select" value="${todayStr}" onchange="PlannerView.onDateChange(this.value)">
                    <button class="btn btn-primary" onclick="PlannerView.openAddTaskModal()">+ Add Custom Task</button>
                    <button class="btn btn-outline" onclick="PlannerView.regeneratePlan()">🔄 Reset Plan</button>
                </div>
            </div>

            <!-- Planner Overview Metrics Header -->
            <div class="planner-metrics-hero">
                <div class="metrics-left">
                    <div class="hero-progress-box">
                        ${UI.createProgressRing(completionPct, 50, 8, '#6366f1')}
                        <div class="hero-ring-info">
                            <strong>Daily Plan Completion</strong>
                            <span>${completedTasksCount} of ${tasks.length} tasks completed</span>
                        </div>
                    </div>
                </div>

                <div class="metrics-right-grid">
                    <div class="planner-stat-pill">
                        <span>⏱️ Planned Hours</span>
                        <strong>${plannedHours} hrs</strong>
                    </div>
                    <div class="planner-stat-pill">
                        <span>✅ Completed Hours</span>
                        <strong>${completedHours} hrs</strong>
                    </div>
                    <div class="planner-stat-pill">
                        <span>⏳ Remaining Hours</span>
                        <strong>${remainingHours} hrs</strong>
                    </div>
                    <div class="planner-stat-pill">
                        <span>📝 Solved Questions</span>
                        <strong>${completedQ} / ${plannedQ}</strong>
                    </div>
                </div>
            </div>

            <!-- Tasks Groups -->
            <div class="planner-tasks-container">
                
                ${groups.revision.length > 0 ? this.renderTaskSection('🔄 Spaced Revisions Due Today', groups.revision, 'rev') : ''}
                ${groups.physics.length > 0 ? this.renderTaskSection('📚 Physics Tasks', groups.physics, 'phy') : ''}
                ${groups.chemistry.length > 0 ? this.renderTaskSection('🧪 Chemistry Tasks', groups.chemistry, 'chem') : ''}
                ${groups.maths.length > 0 ? this.renderTaskSection('📐 Mathematics Tasks', groups.maths, 'math') : ''}
                ${groups.custom.length > 0 ? this.renderTaskSection('⭐ Custom Study Tasks', groups.custom, 'custom') : ''}

                ${tasks.length === 0 ? `
                    <div class="empty-chart-fallback py-5">
                        <p>📋 No study tasks scheduled for ${UI.formatDate(todayStr)}.</p>
                        <span>Click "+ Add Custom Task" or "Reset Plan" to create your schedule!</span>
                    </div>` : ''}
            </div>
        `;
    },

    renderTaskSection: function (sectionTitle, taskList, sectionClass) {
        return `
            <div class="planner-section-block ${sectionClass}">
                <h3 class="planner-section-title">${sectionTitle} (${taskList.length})</h3>
                <div class="planner-task-list">
                    ${taskList.map(t => `
                        <div class="planner-task-item ${t.completed ? 'completed' : ''}" id="task_card_${t.id}">
                            <div class="task-left">
                                <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="PlannerView.toggleTask('${t.id}')">
                                <div class="task-text-info">
                                    <span class="task-title ${t.completed ? 'strike' : ''}">${t.text}</span>
                                    <div class="task-sub-chips">
                                        <span class="chip-sm">⏱️ ${t.durationMins || 30} mins</span>
                                        ${t.questions ? `<span class="chip-sm">📝 ${t.questions} Questions</span>` : ''}
                                        <span class="chip-sm tag-${t.type || 'general'}">${(t.type || 'general').toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="task-actions">
                                <button class="btn-icon" title="Edit Duration / Questions" onclick="PlannerView.editTaskDetails('${t.id}', ${t.durationMins || 30}, ${t.questions || 0})">✏️ Edit</button>
                                <button class="btn-icon text-red" title="Delete Task" onclick="PlannerView.deleteTask('${t.id}')">🗑️</button>
                            </div>
                        </div>`).join('')}
                </div>
            </div>`;
    },

    onDateChange: function (dateStr) {
        if (dateStr) {
            this.selectedDate = dateStr;
            App.renderCurrentView();
        }
    },

    toggleTask: function (taskId) {
        Storage.togglePlanTask(this.selectedDate, taskId);
        UI.showToast("Task updated!", 'info');
        App.renderCurrentView();
    },

    deleteTask: function (taskId) {
        Storage.deletePlanTask(this.selectedDate, taskId);
        UI.showToast("Task deleted.", 'info');
        App.renderCurrentView();
    },

    editTaskDetails: function (taskId, currentMins, currentQ) {
        const html = `
            <div class="modal-form">
                <div class="form-group">
                    <label>Duration (Minutes)</label>
                    <input type="number" id="modal-task-mins" min="5" value="${currentMins}">
                </div>
                <div class="form-group">
                    <label>Target Questions</label>
                    <input type="number" id="modal-task-q" min="0" value="${currentQ}">
                </div>
            </div>
        `;

        UI.showModal('Edit Task Details', html, () => {
            const mins = Math.max(5, Number(document.getElementById('modal-task-mins').value) || 30);
            const q = Math.max(0, Number(document.getElementById('modal-task-q').value) || 0);

            Storage.updatePlanTaskDetails(this.selectedDate, taskId, mins, q);
            UI.showToast("Task details saved!", 'success');
            App.renderCurrentView();
            return true;
        });
    },

    openAddTaskModal: function () {
        const html = `
            <div class="modal-form">
                <div class="form-group">
                    <label>Task Description / Title</label>
                    <input type="text" id="modal-add-task-title" placeholder="e.g. Solve 30 Integration PYQs">
                </div>

                <div class="form-group">
                    <label>Subject</label>
                    <select id="modal-add-task-subject">
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                        <option value="maths">Mathematics</option>
                        <option value="general">General / Revision</option>
                    </select>
                </div>

                <div class="form-row-2">
                    <div class="form-group">
                        <label>Duration (Mins)</label>
                        <input type="number" id="modal-add-task-mins" value="45" min="5">
                    </div>
                    <div class="form-group">
                        <label>Questions</label>
                        <input type="number" id="modal-add-task-q" value="20" min="0">
                    </div>
                </div>
            </div>
        `;

        UI.showModal('+ Add Custom Study Task', html, () => {
            const text = document.getElementById('modal-add-task-title').value.trim();
            const subject = document.getElementById('modal-add-task-subject').value;
            const durationMins = Math.max(5, Number(document.getElementById('modal-add-task-mins').value) || 45);
            const questions = Math.max(0, Number(document.getElementById('modal-add-task-q').value) || 0);

            if (!text) {
                UI.showToast("Please enter a task description.", 'error');
                return false;
            }

            Storage.addCustomPlanTask(this.selectedDate, { text, subject, durationMins, questions, type: 'custom' });
            UI.showToast("Task added to Today's Plan!", 'success');
            App.renderCurrentView();
            return true;
        });
    },

    regeneratePlan: function () {
        if (confirm("Reset and auto-generate today's task list from your current priorities?")) {
            const state = Storage.get();
            const newPlan = SmartEngine.generateDailyPlan(this.selectedDate, state);
            Storage.saveDailyPlan(this.selectedDate, newPlan);
            UI.showToast("Plan reset and regenerated!", 'success');
            App.renderCurrentView();
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlannerView;
}
