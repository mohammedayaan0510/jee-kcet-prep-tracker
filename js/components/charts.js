/**
 * Chart Renderer Helper (Chart.js wrapper with CSS/SVG Fallbacks)
 */

const Charts = {
    instances: {},

    /**
     * Destroys existing chart instance if present
     */
    destroy: function (canvasId) {
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
            delete this.instances[canvasId];
        }
    },

    /**
     * Renders Mock Test Performance Trend (Line Chart)
     */
    renderMockTrend: function (containerId, canvasId, mockTests) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.destroy(canvasId);

        if (!mockTests || mockTests.length === 0) {
            container.innerHTML = `
                <div class="empty-chart-fallback">
                    <p>📊 No mock tests recorded yet.</p>
                    <span>Log your first mock test to see score trends!</span>
                </div>`;
            return;
        }

        // Sort by date ascending for trend
        const sorted = [...mockTests].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sorted.map(t => `${t.title} (${t.exam})`);
        const phyScores = sorted.map(t => t.phyScore);
        const chemScores = sorted.map(t => t.chemScore);
        const mathScores = sorted.map(t => t.mathScore);
        const totalScores = sorted.map(t => t.totalScore);

        if (typeof Chart !== 'undefined') {
            container.innerHTML = `<canvas id="${canvasId}"></canvas>`;
            const ctx = document.getElementById(canvasId).getContext('2d');
            
            const isDark = document.body.classList.contains('dark-theme');
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            const textColor = isDark ? '#9ca3af' : '#6b7280';

            this.instances[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Score',
                            data: totalScores,
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'Physics',
                            data: phyScores,
                            borderColor: '#3b82f6',
                            borderWidth: 2,
                            tension: 0.3
                        },
                        {
                            label: 'Chemistry',
                            data: chemScores,
                            borderColor: '#10b981',
                            borderWidth: 2,
                            tension: 0.3
                        },
                        {
                            label: 'Mathematics',
                            data: mathScores,
                            borderColor: '#f59e0b',
                            borderWidth: 2,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { color: textColor } },
                        y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: true }
                    },
                    plugins: {
                        legend: { labels: { color: textColor } }
                    }
                }
            });
        } else {
            // Render CSS/SVG Fallback Bar Graph
            let barsHtml = sorted.map(t => {
                const max = t.maxMarks || 300;
                const pct = Math.min(100, Math.round((t.totalScore / max) * 100));
                return `
                    <div class="fallback-bar-item">
                        <div class="fallback-bar-fill" style="height: ${pct}%;">
                            <span class="fallback-bar-val">${t.totalScore}</span>
                        </div>
                        <span class="fallback-bar-label">${t.title.substring(0, 8)}..</span>
                    </div>`;
            }).join('');

            container.innerHTML = `
                <div class="fallback-chart-container">
                    <div class="fallback-bars-wrapper">${barsHtml}</div>
                </div>`;
        }
    },

    /**
     * Renders Subject Completion Progress Comparison (Bar Chart)
     */
    renderSubjectProgress: function (containerId, canvasId, subjectPcts) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.destroy(canvasId);

        const labels = ['Physics', 'Chemistry', 'Mathematics'];
        const data = [subjectPcts.physics || 0, subjectPcts.chemistry || 0, subjectPcts.maths || 0];

        if (typeof Chart !== 'undefined') {
            container.innerHTML = `<canvas id="${canvasId}"></canvas>`;
            const ctx = document.getElementById(canvasId).getContext('2d');
            const isDark = document.body.classList.contains('dark-theme');
            const textColor = isDark ? '#9ca3af' : '#6b7280';

            this.instances[canvasId] = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Completion %',
                        data: data,
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 100, ticks: { color: textColor } },
                        x: { ticks: { color: textColor } }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        } else {
            container.innerHTML = `
                <div class="fallback-subject-bars">
                    <div class="fallback-bar-row">
                        <span>📚 Physics</span>
                        <div class="fallback-track"><div class="fallback-fill phy" style="width: ${data[0]}%;"></div></div>
                        <strong>${data[0]}%</strong>
                    </div>
                    <div class="fallback-bar-row">
                        <span>🧪 Chemistry</span>
                        <div class="fallback-track"><div class="fallback-fill chem" style="width: ${data[1]}%;"></div></div>
                        <strong>${data[1]}%</strong>
                    </div>
                    <div class="fallback-bar-row">
                        <span>📐 Mathematics</span>
                        <div class="fallback-track"><div class="fallback-fill math" style="width: ${data[2]}%;"></div></div>
                        <strong>${data[2]}%</strong>
                    </div>
                </div>`;
        }
    },

    /**
     * Renders PYQ Accuracy Doughnut Chart
     */
    renderPyqAccuracy: function (containerId, canvasId, pyqData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.destroy(canvasId);

        const totalAttempted = (pyqData.jeeMain.attempted || 0) + (pyqData.jeeAdvanced.attempted || 0) + (pyqData.kcet.attempted || 0);
        const totalCorrect = (pyqData.jeeMain.correct || 0) + (pyqData.jeeAdvanced.correct || 0) + (pyqData.kcet.correct || 0);
        const totalIncorrect = Math.max(0, totalAttempted - totalCorrect);

        if (totalAttempted === 0) {
            container.innerHTML = `
                <div class="empty-chart-fallback">
                    <p>🎯 No PYQs attempted yet.</p>
                    <span>Update your PYQ counts in the PYQ Tracker!</span>
                </div>`;
            return;
        }

        if (typeof Chart !== 'undefined') {
            container.innerHTML = `<canvas id="${canvasId}"></canvas>`;
            const ctx = document.getElementById(canvasId).getContext('2d');
            const isDark = document.body.classList.contains('dark-theme');
            const textColor = isDark ? '#9ca3af' : '#6b7280';

            this.instances[canvasId] = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Correct Questions', 'Incorrect Questions'],
                    datasets: [{
                        data: [totalCorrect, totalIncorrect],
                        backgroundColor: ['#10b981', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: textColor } }
                    }
                }
            });
        } else {
            const acc = Math.round((totalCorrect / totalAttempted) * 100);
            container.innerHTML = `
                <div class="fallback-doughnut">
                    <div class="doughnut-stat">
                        <strong>${acc}%</strong>
                        <span>Overall PYQ Accuracy</span>
                    </div>
                </div>`;
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Charts;
}
