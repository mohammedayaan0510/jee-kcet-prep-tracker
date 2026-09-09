/**
 * PYQ Tracker View Controller (JEE Main, JEE Advanced, KCET)
 */

const PyqView = {
    render: function (container, state) {
        const pyqData = state.pyqData || {
            jeeMain: { attempted: 0, correct: 0 },
            jeeAdvanced: { attempted: 0, correct: 0 },
            kcet: { attempted: 0, correct: 0 }
        };

        // Calculate totals across all exams
        const totalAttempted = (pyqData.jeeMain.attempted || 0) + (pyqData.jeeAdvanced.attempted || 0) + (pyqData.kcet.attempted || 0);
        const totalCorrect = (pyqData.jeeMain.correct || 0) + (pyqData.jeeAdvanced.correct || 0) + (pyqData.kcet.correct || 0);
        const totalIncorrect = Math.max(0, totalAttempted - totalCorrect);
        const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>PYQ (Previous Years Questions) Tracker</h1>
                    <p>Track your attempted, correct, incorrect, and accuracy percentage across JEE Main, JEE Advanced, and KCET.</p>
                </div>
            </div>

            <!-- PYQ Overall Stats Header Grid -->
            <div class="stats-overview-grid mb-4">
                <div class="stat-box">
                    <div class="stat-icon-wrapper blue">📝</div>
                    <div class="stat-info">
                        <span class="stat-value">${totalAttempted}</span>
                        <span class="stat-label">Total PYQs Attempted</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper green">✅</div>
                    <div class="stat-info">
                        <span class="stat-value">${totalCorrect}</span>
                        <span class="stat-label">Correct Answers</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper red">❌</div>
                    <div class="stat-info">
                        <span class="stat-value">${totalIncorrect}</span>
                        <span class="stat-label">Incorrect Answers</span>
                    </div>
                </div>

                <div class="stat-box">
                    <div class="stat-icon-wrapper purple">🎯</div>
                    <div class="stat-info">
                        <span class="stat-value">${overallAccuracy}%</span>
                        <span class="stat-label">Overall Accuracy %</span>
                    </div>
                </div>
            </div>

            <!-- Exam-specific PYQ Cards -->
            <div class="pyq-cards-grid">
                
                <!-- JEE MAIN PYQs -->
                <div class="pyq-card main-border">
                    <div class="pyq-card-head">
                        <span class="exam-badge main">JEE MAIN PYQs</span>
                        <span class="acc-badge">${this.getAccuracy(pyqData.jeeMain.attempted, pyqData.jeeMain.correct)}% Accuracy</span>
                    </div>

                    <div class="pyq-input-fields">
                        <div class="form-group">
                            <label>Questions Attempted</label>
                            <input type="number" id="pyq-main-att" min="0" value="${pyqData.jeeMain.attempted || 0}">
                        </div>

                        <div class="form-group">
                            <label>Correct Questions</label>
                            <input type="number" id="pyq-main-corr" min="0" value="${pyqData.jeeMain.correct || 0}">
                        </div>
                    </div>

                    <div class="pyq-stats-breakdown">
                        <div class="pyq-row"><span>Incorrect:</span><strong>${Math.max(0, (pyqData.jeeMain.attempted || 0) - (pyqData.jeeMain.correct || 0))}</strong></div>
                        <div class="pyq-row"><span>Target PYQ Count:</span><strong>1,500 Questions</strong></div>
                        <div class="pyq-row"><span>Questions Remaining:</span><strong>${Math.max(0, 1500 - (pyqData.jeeMain.attempted || 0))}</strong></div>
                    </div>

                    <button class="btn btn-primary btn-full mt-3" onclick="PyqView.saveExamPyq('jeeMain')">Update JEE Main PYQs</button>
                </div>

                <!-- JEE ADVANCED PYQs -->
                <div class="pyq-card adv-border">
                    <div class="pyq-card-head">
                        <span class="exam-badge adv">JEE ADVANCED PYQs</span>
                        <span class="acc-badge">${this.getAccuracy(pyqData.jeeAdvanced.attempted, pyqData.jeeAdvanced.correct)}% Accuracy</span>
                    </div>

                    <div class="pyq-input-fields">
                        <div class="form-group">
                            <label>Questions Attempted</label>
                            <input type="number" id="pyq-adv-att" min="0" value="${pyqData.jeeAdvanced.attempted || 0}">
                        </div>

                        <div class="form-group">
                            <label>Correct Questions</label>
                            <input type="number" id="pyq-adv-corr" min="0" value="${pyqData.jeeAdvanced.correct || 0}">
                        </div>
                    </div>

                    <div class="pyq-stats-breakdown">
                        <div class="pyq-row"><span>Incorrect:</span><strong>${Math.max(0, (pyqData.jeeAdvanced.attempted || 0) - (pyqData.jeeAdvanced.correct || 0))}</strong></div>
                        <div class="pyq-row"><span>Target PYQ Count:</span><strong>1,000 Questions</strong></div>
                        <div class="pyq-row"><span>Questions Remaining:</span><strong>${Math.max(0, 1000 - (pyqData.jeeAdvanced.attempted || 0))}</strong></div>
                    </div>

                    <button class="btn btn-primary btn-full mt-3" onclick="PyqView.saveExamPyq('jeeAdvanced')">Update JEE Advanced PYQs</button>
                </div>

                <!-- KCET PYQs -->
                <div class="pyq-card kcet-border">
                    <div class="pyq-card-head">
                        <span class="exam-badge kcet">KCET PYQs</span>
                        <span class="acc-badge">${this.getAccuracy(pyqData.kcet.attempted, pyqData.kcet.correct)}% Accuracy</span>
                    </div>

                    <div class="pyq-input-fields">
                        <div class="form-group">
                            <label>Questions Attempted</label>
                            <input type="number" id="pyq-kcet-att" min="0" value="${pyqData.kcet.attempted || 0}">
                        </div>

                        <div class="form-group">
                            <label>Correct Questions</label>
                            <input type="number" id="pyq-kcet-corr" min="0" value="${pyqData.kcet.correct || 0}">
                        </div>
                    </div>

                    <div class="pyq-stats-breakdown">
                        <div class="pyq-row"><span>Incorrect:</span><strong>${Math.max(0, (pyqData.kcet.attempted || 0) - (pyqData.kcet.correct || 0))}</strong></div>
                        <div class="pyq-row"><span>Target PYQ Count:</span><strong>1,200 Questions</strong></div>
                        <div class="pyq-row"><span>Questions Remaining:</span><strong>${Math.max(0, 1200 - (pyqData.kcet.attempted || 0))}</strong></div>
                    </div>

                    <button class="btn btn-primary btn-full mt-3" onclick="PyqView.saveExamPyq('kcet')">Update KCET PYQs</button>
                </div>

            </div>
        `;
    },

    getAccuracy: function (att, corr) {
        if (!att || att <= 0) return 0;
        return Math.round(((corr || 0) / att) * 100);
    },

    saveExamPyq: function (examKey) {
        let attId = 'pyq-main-att';
        let corrId = 'pyq-main-corr';
        if (examKey === 'jeeAdvanced') { attId = 'pyq-adv-att'; corrId = 'pyq-adv-corr'; }
        if (examKey === 'kcet') { attId = 'pyq-kcet-att'; corrId = 'pyq-kcet-corr'; }

        const att = Number(document.getElementById(attId).value) || 0;
        const corr = Number(document.getElementById(corrId).value) || 0;

        if (corr > att) {
            UI.showToast("Correct questions cannot exceed attempted questions!", 'error');
            return;
        }

        Storage.updatePyqData(examKey, att, corr);
        UI.showToast("PYQ metrics updated!", 'success');
        App.renderCurrentView();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PyqView;
}
