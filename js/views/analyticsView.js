/**
 * Analytics View Controller (Interactive Chart.js visual reports & metrics)
 */

const AnalyticsView = {
    render: function (container, state) {
        const subjectPcts = DashboardView.calculateSubjectProgress(state);
        const pyqData = state.pyqData || {
            jeeMain: { attempted: 0, correct: 0 },
            jeeAdvanced: { attempted: 0, correct: 0 },
            kcet: { attempted: 0, correct: 0 }
        };
        const mockTests = state.mockTests || [];

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Visual Analytics & Reports</h1>
                    <p>In-depth graphical insights into your subject mastery, mock test performance, PYQ accuracy, and study discipline.</p>
                </div>
            </div>

            <!-- 2x2 Analytics Charts Grid -->
            <div class="analytics-grid">
                
                <!-- Chart 1: Subject Progress Comparison -->
                <div class="chart-card-box">
                    <div class="chart-card-header">
                        <h3>📚 Subject Mastery Comparison</h3>
                        <span>Completion %</span>
                    </div>
                    <div class="chart-wrapper" id="analytics-subject-container" style="height: 280px;">
                        <canvas id="analytics-subject-canvas"></canvas>
                    </div>
                </div>

                <!-- Chart 2: PYQ Accuracy Doughnut -->
                <div class="chart-card-box">
                    <div class="chart-card-header">
                        <h3>🎯 PYQ Solving Accuracy</h3>
                        <span>Correct vs Incorrect</span>
                    </div>
                    <div class="chart-wrapper" id="analytics-pyq-container" style="height: 280px;">
                        <canvas id="analytics-pyq-canvas"></canvas>
                    </div>
                </div>

                <!-- Chart 3: Mock Test Score Progression -->
                <div class="chart-card-box chart-span-2">
                    <div class="chart-card-header">
                        <h3>📈 Mock Test Score Progression</h3>
                        <span>Subject & Total Scores Over Time</span>
                    </div>
                    <div class="chart-wrapper" id="analytics-mock-container" style="height: 320px;">
                        <canvas id="analytics-mock-canvas"></canvas>
                    </div>
                </div>

            </div>
        `;

        // Render charts asynchronously after DOM injection
        setTimeout(() => {
            Charts.renderSubjectProgress('analytics-subject-container', 'analytics-subject-canvas', subjectPcts);
            Charts.renderPyqAccuracy('analytics-pyq-container', 'analytics-pyq-canvas', pyqData);
            Charts.renderMockTrend('analytics-mock-container', 'analytics-mock-canvas', mockTests);
        }, 50);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsView;
}
