/* =========================================================
   SUBJECT PROGRESS
========================================================= */

function updatePhysics() {

    var progress = Number(
        document.getElementById("physics-input").value
    ) || 0;

    document.querySelector(".physics-progress").style.width =
        progress + "%";

    document.querySelectorAll(".physics-percent").forEach(function (item) {
        item.textContent = progress + "%";
    });

    localStorage.setItem("physics", progress);

    updateOverall();
}


function updateChemistry() {

    var progress = Number(
        document.getElementById("chemistry-input").value
    ) || 0;

    document.querySelector(".chemistry-progress").style.width =
        progress + "%";

    document.querySelectorAll(".chemistry-percent").forEach(function (item) {
        item.textContent = progress + "%";
    });

    localStorage.setItem("chemistry", progress);

    updateOverall();
}


function updateMaths() {

    var progress = Number(
        document.getElementById("maths-input").value
    ) || 0;

    document.querySelector(".maths-progress").style.width =
        progress + "%";

    document.querySelectorAll(".maths-percent").forEach(function (item) {
        item.textContent = progress + "%";
    });

    localStorage.setItem("maths", progress);

    updateOverall();
}


/* =========================================================
   OVERALL PROGRESS
========================================================= */

function updateOverall() {

    var physics =
        Number(document.getElementById("physics-input").value) || 0;

    var chemistry =
        Number(document.getElementById("chemistry-input").value) || 0;

    var maths =
        Number(document.getElementById("maths-input").value) || 0;

    var overall = Math.round(
        (physics + chemistry + maths) / 3
    );

    document.getElementById("overall-percent").textContent =
        overall + "%";

    document.querySelector(".overall-progress").style.width =
        overall + "%";
}


/* =========================================================
   STATISTICS
========================================================= */

function updateQuestions() {

    var value =
        document.getElementById("questions-input").value || 0;

    document.getElementById("questions-value").textContent =
        value;

    localStorage.setItem("questions", value);
}


function updateHours() {

    var value =
        document.getElementById("hours-input").value || 0;

    document.getElementById("hours-value").textContent =
        value;

    localStorage.setItem("hours", value);
}


function updateTests() {

    var value =
        document.getElementById("tests-input").value || 0;

    document.getElementById("tests-value").textContent =
        value;

    localStorage.setItem("tests", value);
}


/* =========================================================
   SHOW / HIDE CHAPTERS
========================================================= */

function toggleChapters(subject) {

    var list =
        document.getElementById(subject + "-chapters");

    if (!list) return;

    var button =
        list.parentElement.querySelector(".expand-button");

    if (
        list.style.display === "none" ||
        list.style.display === ""
    ) {

        list.style.display = "block";

        if (button) {
            button.textContent = "Hide Chapters ▲";
        }

    } else {

        list.style.display = "none";

        if (button) {
            button.textContent = "Show All Chapters ▼";
        }
    }
}


/* =========================================================
   CHAPTER STATUS
========================================================= */

function toggleChapter(button, subject) {

    var status = button.textContent.trim();


    if (status === "Not Started") {

        button.textContent = "In Progress";

    } else if (status === "In Progress") {

        button.textContent = "Completed";

    } else {

        button.textContent = "Not Started";
    }


    /* Update button colors */

    button.classList.remove(
        "in-progress",
        "completed"
    );


    if (button.textContent.trim() === "In Progress") {

        button.classList.add("in-progress");
    }


    if (button.textContent.trim() === "Completed") {

        button.classList.add("completed");
    }


    updateChapterStats(subject);

    saveChapterStatuses(subject);
}


/* =========================================================
   CHAPTER STATISTICS + AUTOMATIC SUBJECT PROGRESS
========================================================= */

function updateChapterStats(subject) {

    var list =
        document.getElementById(subject + "-chapters");

    if (!list) return;


    var buttons =
        list.querySelectorAll(".chapter button");


    var completed = 0;
    var inProgress = 0;
    var notStarted = 0;


    buttons.forEach(function (button) {

        var status =
            button.textContent.trim();


        if (status === "Completed") {

            completed++;

        } else if (status === "In Progress") {

            inProgress++;

        } else {

            notStarted++;
        }

    });


    var total = buttons.length;


    /* Update chapter numbers */

    var completedElement =
        document.getElementById(subject + "-completed");

    var totalElement =
        document.getElementById(subject + "-total");

    var progressElement =
        document.getElementById(subject + "-in-progress");

    var notStartedElement =
        document.getElementById(subject + "-not-started");


    if (completedElement) {
        completedElement.textContent = completed;
    }


    if (totalElement) {
        totalElement.textContent = total;
    }


    if (progressElement) {
        progressElement.textContent = inProgress;
    }


    if (notStartedElement) {
        notStartedElement.textContent = notStarted;
    }


    /* Calculate percentage */

    var percentage = 0;


    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);
    }


    /* =====================================================
       PHYSICS
    ===================================================== */

    if (subject === "physics") {

        var input =
            document.getElementById("physics-input");

        if (input) {
            input.value = percentage;
        }


        var progressBar =
            document.querySelector(".physics-progress");

        if (progressBar) {
            progressBar.style.width =
                percentage + "%";
        }


        document.querySelectorAll(
            ".physics-percent"
        ).forEach(function (item) {

            item.textContent =
                percentage + "%";

        });


        localStorage.setItem(
            "physics",
            percentage
        );
    }


    /* =====================================================
       CHEMISTRY
    ===================================================== */

    if (subject === "chemistry") {

        var input =
            document.getElementById("chemistry-input");

        if (input) {
            input.value = percentage;
        }


        var progressBar =
            document.querySelector(".chemistry-progress");

        if (progressBar) {
            progressBar.style.width =
                percentage + "%";
        }


        document.querySelectorAll(
            ".chemistry-percent"
        ).forEach(function (item) {

            item.textContent =
                percentage + "%";

        });


        localStorage.setItem(
            "chemistry",
            percentage
        );
    }


    /* =====================================================
       MATHEMATICS
    ===================================================== */

    if (subject === "maths") {

        var input =
            document.getElementById("maths-input");

        if (input) {
            input.value = percentage;
        }


        var progressBar =
            document.querySelector(".maths-progress");

        if (progressBar) {
            progressBar.style.width =
                percentage + "%";
        }


        document.querySelectorAll(
            ".maths-percent"
        ).forEach(function (item) {

            item.textContent =
                percentage + "%";

        });


        localStorage.setItem(
            "maths",
            percentage
        );
    }


    /* Update overall percentage */

    updateOverall();
}


/* =========================================================
   SAVE CHAPTER STATUSES
========================================================= */

function saveChapterStatuses(subject) {

    var list =
        document.getElementById(subject + "-chapters");

    if (!list) return;


    var buttons =
        list.querySelectorAll(".chapter button");


    var statuses = [];


    buttons.forEach(function (button) {

        statuses.push(
            button.textContent.trim()
        );

    });


    localStorage.setItem(
        subject + "-chapters",
        JSON.stringify(statuses)
    );
}


/* =========================================================
   LOAD CHAPTER STATUSES
========================================================= */

function loadChapterStatuses(subject) {

    var list =
        document.getElementById(subject + "-chapters");

    if (!list) return;


    var saved =
        localStorage.getItem(
            subject + "-chapters"
        );


    if (saved) {

        var statuses =
            JSON.parse(saved);


        var buttons =
            list.querySelectorAll(".chapter button");


        buttons.forEach(function (button, index) {

            if (statuses[index]) {

                button.textContent =
                    statuses[index];


                /* Reset color classes */

                button.classList.remove(
                    "in-progress",
                    "completed"
                );


                /* Restore correct color */

                if (
                    statuses[index] ===
                    "In Progress"
                ) {

                    button.classList.add(
                        "in-progress"
                    );
                }


                if (
                    statuses[index] ===
                    "Completed"
                ) {

                    button.classList.add(
                        "completed"
                    );
                }
            }

        });

    }


    updateChapterStats(subject);
}


/* =========================================================
   LOAD EVERYTHING WHEN PAGE OPENS
========================================================= */

window.addEventListener("load", function () {


    /* -----------------------------------------
       Load subject percentages
    ----------------------------------------- */

    var physics =
        Number(localStorage.getItem("physics")) || 0;

    var chemistry =
        Number(localStorage.getItem("chemistry")) || 0;

    var maths =
        Number(localStorage.getItem("maths")) || 0;


    document.getElementById(
        "physics-input"
    ).value = physics;


    document.getElementById(
        "chemistry-input"
    ).value = chemistry;


    document.getElementById(
        "maths-input"
    ).value = maths;


    /* -----------------------------------------
       Progress bars
    ----------------------------------------- */

    document.querySelector(
        ".physics-progress"
    ).style.width = physics + "%";


    document.querySelector(
        ".chemistry-progress"
    ).style.width = chemistry + "%";


    document.querySelector(
        ".maths-progress"
    ).style.width = maths + "%";


    /* -----------------------------------------
       Subject percentages
    ----------------------------------------- */

    document.querySelectorAll(
        ".physics-percent"
    ).forEach(function (item) {

        item.textContent =
            physics + "%";

    });


    document.querySelectorAll(
        ".chemistry-percent"
    ).forEach(function (item) {

        item.textContent =
            chemistry + "%";

    });


    document.querySelectorAll(
        ".maths-percent"
    ).forEach(function (item) {

        item.textContent =
            maths + "%";

    });


    /* -----------------------------------------
       Statistics
    ----------------------------------------- */

    document.getElementById(
        "questions-value"
    ).textContent =
        localStorage.getItem("questions") || 0;


    document.getElementById(
        "hours-value"
    ).textContent =
        localStorage.getItem("hours") || 0;


    document.getElementById(
        "tests-value"
    ).textContent =
        localStorage.getItem("tests") || 0;


    /* -----------------------------------------
       Overall progress
    ----------------------------------------- */

    updateOverall();


    /* -----------------------------------------
       Load chapter statuses
    ----------------------------------------- */

    loadChapterStatuses("physics");

    loadChapterStatuses("chemistry");

    loadChapterStatuses("maths");

});

// ==================== DAILY STUDY ====================

function updateDailyProgress() {

    var hours =
        Number(document.getElementById("daily-hours-input").value) || 0;

    var questions =
        Number(document.getElementById("daily-questions-input").value) || 0;

    var chapters =
        Number(document.getElementById("daily-chapters-input").value) || 0;


    // Daily targets
    // 8 hours = 100%
    // 100 questions = 100%
    // 2 chapters = 100%

    var hoursPercent = (hours / 8) * 100;
    var questionsPercent = (questions / 100) * 100;
    var chaptersPercent = (chapters / 2) * 100;


    // Average of the three
    var progress =
        (hoursPercent + questionsPercent + chaptersPercent) / 3;


    // Keep between 0 and 100
    progress = Math.max(0, Math.min(100, progress));

    progress = Math.round(progress);


    // Update Daily Target at the top
    var targetPercent =
        document.getElementById("daily-target-percent");

    if (targetPercent) {
        targetPercent.textContent = progress + "%";
    }


    // Update progress text
    var progressText =
        document.getElementById("daily-progress-text");

    if (progressText) {
        progressText.textContent = progress + "%";
    }


    // Update progress bar
    var progressBar =
        document.querySelector(".daily-progress");

    if (progressBar) {
        progressBar.style.width = progress + "%";
    }


    // Save
    localStorage.setItem("dailyProgress", progress);
}


// ==================== DAILY HOURS ====================

function updateDailyHours() {

    var value =
        Number(document.getElementById("daily-hours-input").value) || 0;

    document.getElementById("daily-hours-value").textContent = value;

    localStorage.setItem("dailyHours", value);

    updateDailyProgress();
}


// ==================== DAILY QUESTIONS ====================

function updateDailyQuestions() {

    var value =
        Number(document.getElementById("daily-questions-input").value) || 0;

    document.getElementById("daily-questions-value").textContent = value;

    localStorage.setItem("dailyQuestions", value);

    updateDailyProgress();
}


// ==================== DAILY CHAPTERS ====================

function updateDailyChapters() {

    var value =
        Number(document.getElementById("daily-chapters-input").value) || 0;

    document.getElementById("daily-chapters-value").textContent = value;

    localStorage.setItem("dailyChapters", value);

    updateDailyProgress();
}


// ==================== LOAD DAILY DATA ====================

function loadDailyData() {

    var hours =
        Number(localStorage.getItem("dailyHours")) || 0;

    var questions =
        Number(localStorage.getItem("dailyQuestions")) || 0;

    var chapters =
        Number(localStorage.getItem("dailyChapters")) || 0;


    document.getElementById("daily-hours-value").textContent = hours;

    document.getElementById("daily-questions-value").textContent =
        questions;

    document.getElementById("daily-chapters-value").textContent =
        chapters;


    document.getElementById("daily-hours-input").value = hours;

    document.getElementById("daily-questions-input").value = questions;

    document.getElementById("daily-chapters-input").value = chapters;


    updateDailyProgress();
}


// ==================== TODAY'S DATE ====================

function updateTodayDate() {

    var dateElement =
        document.getElementById("today-date");

    if (!dateElement) return;

    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    dateElement.textContent =
        today.toLocaleDateString("en-IN", options);
}


// ==================== LOAD DAILY SECTION ====================

window.addEventListener("load", function () {

    loadDailyData();

    updateTodayDate();

});
