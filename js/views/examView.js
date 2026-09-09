/**
 * Exam Tracker View Controller (JEE Main, JEE Advanced, KCET)
 */

const ExamView = {
    render: function (container, state) {
        const jeeMain = UI.calculateExamReadiness(state, 'jeeMain');
        const jeeAdv = UI.calculateExamReadiness(state, 'jeeAdvanced');
        const kcet = UI.calculateExamReadiness(state, 'kcet');

        const currentTarget = state.settings.targetExam || 'JEE Main 2026';

        container.innerHTML = `
            <div class="view-header">
                <div>
                    <h1>Exam Readiness Tracker</h1>
                    <p>Track your preparation readiness separately for JEE Main, JEE Advanced, and KCET.</p>
                </div>
            </div>

            <!-- Target Selection Switcher -->
            <div class="target-exam-bar">
                <span>🎯 Primary Target Exam:</span>
                <select id="target-exam-select" onchange="ExamView.updatePrimaryTarget(this.value)">
                    <option value="JEE Main 2026" ${currentTarget === 'JEE Main 2026' ? 'selected' : ''}>JEE Main 2026</option>
                    <option value="JEE Advanced 2026" ${currentTarget === 'JEE Advanced 2026' ? 'selected' : ''}>JEE Advanced 2026</option>
                    <option value="KCET 2026" ${currentTarget === 'KCET 2026' ? 'selected' : ''}>KCET 2026</option>
                </select>
            </div>

            <!-- 3 Detailed Exam Columns -->
            <div class="exam-detailed-grid">
                
                <!-- JEE MAIN -->
                <div class="exam-detail-card ${currentTarget.includes('Main') ? 'featured' : ''}">
                    <div class="exam-card-header main">
                        <div>
                            <h2>JEE Main 2026</h2>
                            <span>NTA Conducted Exam • 300 Marks</span>
                        </div>
                        <div class="exam-score-ring">
                            ${UI.createProgressRing(jeeMain.overall, 45, 7, '#4f46e5')}
                        </div>
                    </div>

                    <div class="exam-progress-breakdown">
                        <div class="breakdown-row">
                            <div class="row-info"><span>📖 Syllabus Completion</span><strong>${jeeMain.syllabus}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill main" style="width:${jeeMain.syllabus}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>📝 PYQ Practice</span><strong>${jeeMain.pyq}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill main" style="width:${jeeMain.pyq}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>🔄 Revision Completion</span><strong>${jeeMain.revision}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill main" style="width:${jeeMain.revision}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>🏆 Mock Test Score Avg</span><strong>${jeeMain.mock}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill main" style="width:${jeeMain.mock}%;"></div></div>
                        </div>
                    </div>

                    <div class="exam-info-footer">
                        <p>💡 <strong>Strategy Tip:</strong> Focus on NCERT speed, accuracy in Single Option MCQs, and numerical value questions.</p>
                    </div>
                </div>

                <!-- JEE ADVANCED -->
                <div class="exam-detail-card ${currentTarget.includes('Advanced') ? 'featured' : ''}">
                    <div class="exam-card-header adv">
                        <div>
                            <h2>JEE Advanced 2026</h2>
                            <span>IIT Conducted Exam • Deep Concepts</span>
                        </div>
                        <div class="exam-score-ring">
                            ${UI.createProgressRing(jeeAdv.overall, 45, 7, '#7c3aed')}
                        </div>
                    </div>

                    <div class="exam-progress-breakdown">
                        <div class="breakdown-row">
                            <div class="row-info"><span>📖 Conceptual Syllabus</span><strong>${jeeAdv.syllabus}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill adv" style="width:${jeeAdv.syllabus}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>📝 Advanced PYQs (10 Yrs)</span><strong>${jeeAdv.pyq}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill adv" style="width:${jeeAdv.pyq}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>🔄 Multi-pass Revision</span><strong>${jeeAdv.revision}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill adv" style="width:${jeeAdv.revision}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>🏆 Advanced Mock Performance</span><strong>${jeeAdv.mock}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill adv" style="width:${jeeAdv.mock}%;"></div></div>
                        </div>
                    </div>

                    <div class="exam-info-footer">
                        <p>💡 <strong>Strategy Tip:</strong> Solve multi-correct, comprehension, and matrix match questions with high precision.</p>
                    </div>
                </div>

                <!-- KCET -->
                <div class="exam-detail-card ${currentTarget.includes('KCET') ? 'featured' : ''}">
                    <div class="exam-card-header kcet">
                        <div>
                            <h2>KCET 2026</h2>
                            <span>KEA Karnataka CET • High Speed</span>
                        </div>
                        <div class="exam-score-ring">
                            ${UI.createProgressRing(kcet.overall, 45, 7, '#059669')}
                        </div>
                    </div>

                    <div class="exam-progress-breakdown">
                        <div class="breakdown-row">
                            <div class="row-info"><span>📖 PUC II & I Syllabus</span><strong>${kcet.syllabus}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill kcet" style="width:${kcet.syllabus}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>📝 KCET PYQs Practice</span><strong>${kcet.pyq}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill kcet" style="width:${kcet.pyq}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>🔄 Formula & Direct Revision</span><strong>${kcet.revision}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill kcet" style="width:${kcet.revision}%;"></div></div>
                        </div>

                        <div class="breakdown-row">
                            <div class="row-info"><span>🏆 KCET Mock Performance</span><strong>${kcet.mock}%</strong></div>
                            <div class="progress-bar-container"><div class="progress-bar-fill kcet" style="width:${kcet.mock}%;"></div></div>
                        </div>
                    </div>

                    <div class="exam-info-footer">
                        <p>💡 <strong>Strategy Tip:</strong> Master 1-minute speed solving per question with direct NCERT textbook line items.</p>
                    </div>
                </div>
            </div>
        `;
    },

    updatePrimaryTarget: function (val) {
        const state = Storage.get();
        state.settings.targetExam = val;
        Storage.save(state);
        UI.showToast(`Primary target exam set to ${val}`, 'info');
        App.renderCurrentView();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExamView;
}
