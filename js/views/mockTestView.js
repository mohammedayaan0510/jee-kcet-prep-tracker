/**
 * Mock Test Tracker View Controller
 */

const MockTestView = {
    render: function (container, state) {
        const tests = state.mockTests || [];

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Mock Test Performance Tracker</h1>
                    <p>Record your test scores, monitor subject-wise breakdown, and track performance progression over time.</p>
                </div>
                <button class="btn btn-primary" onclick="App.openMockTestModal()">+ Record Mock Test</button>
            </div>

            <!-- Performance Trend Chart Card -->
            <div class="chart-card-box mb-4">
                <div class="chart-card-header">
                    <h3>📈 Score Progression Trend</h3>
                    <span>Total Tests Recorded: <strong>${tests.length}</strong></span>
                </div>
                <div class="chart-wrapper" id="mock-chart-container" style="height: 320px;">
                    <canvas id="mock-trend-canvas"></canvas>
                </div>
            </div>

            <!-- Mock Test History Table -->
            <div class="section-title">
                <h2>📋 Test Records History</h2>
            </div>

            <div class="table-card-wrapper">
                <table class="chapter-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Test Title</th>
                            <th>Exam</th>
                            <th>Physics</th>
                            <th>Chemistry</th>
                            <th>Maths</th>
                            <th>Total Score</th>
                            <th>Accuracy %</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tests.length === 0 ? `
                            <tr>
                                <td colspan="10" class="text-center py-4">No mock tests recorded yet. Click "+ Record Mock Test" to add your first test!</td>
                            </tr>` : 
                            tests.map(t => {
                                const pct = Math.round((t.totalScore / (t.maxMarks || 300)) * 100);
                                return `
                                    <tr>
                                        <td><strong>${UI.formatDate(t.date)}</strong></td>
                                        <td><strong>${t.title}</strong></td>
                                        <td><span class="exam-badge ${t.exam.toLowerCase().includes('adv') ? 'adv' : t.exam.toLowerCase().includes('kcet') ? 'kcet' : 'main'}">${t.exam}</span></td>
                                        <td>${t.phyScore}</td>
                                        <td>${t.chemScore}</td>
                                        <td>${t.mathScore}</td>
                                        <td><strong>${t.totalScore} / ${t.maxMarks || 300} (${pct}%)</strong></td>
                                        <td><span class="acc-pill">${t.accuracy}%</span></td>
                                        <td>${t.duration ? t.duration + ' mins' : '-'}</td>
                                        <td>
                                            <button class="btn-icon text-red" onclick="MockTestView.deleteTest('${t.id}')">🗑️ Delete</button>
                                        </td>
                                    </tr>`;
                            }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Render chart after DOM inject
        setTimeout(() => {
            Charts.renderMockTrend('mock-chart-container', 'mock-trend-canvas', tests);
        }, 50);
    },

    deleteTest: function (id) {
        if (confirm("Are you sure you want to delete this mock test record?")) {
            Storage.deleteMockTest(id);
            UI.showToast("Mock test deleted.", 'info');
            App.renderCurrentView();
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MockTestView;
}
