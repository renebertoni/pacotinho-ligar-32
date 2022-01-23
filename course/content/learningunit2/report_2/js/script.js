let hasIcon = false;

function createReportScreen(screenTitle, obj, index) {
    let bg = create("tr", "#--report-container", "--report-screen-" + index, "--report-screen");
    bg.classList.add("--report-screen-" + obj.color);

    bg.onclick = function () {
        if (screenTitle !== "Total") {
            eventFire(links[(index + 2)], 'click')
        }
    };

    create("td", "#--report-screen-" + index, "--report-titleContainer-" + index, "--report-titleContainer");
    create("td", "#--report-screen-" + index, "--report-progressContainer-" + index, "--report-progressContainer");
    create("td", "#--report-screen-" + index, "--report-scoreContainer-" + index, "--report-scoreContainer");

    let title = create("p", "#--report-titleContainer-" + index, "--report-title-" + index, "--report-title");
    title.innerHTML = screenTitle;

    if (obj.hasScore) {
        if (screenTitle !== "Total:") {
            // Progress Bar
            let barBg = create("", "#--report-progressContainer-" + index, "--report-progressBar-" + index, "--report-progressBar");
            let fill = create("", "#--report-progressBar-" + index, "--report-progressFill-" + index, "--report-progressFill");

            let percentage = (obj.score * 100) / obj.maxScore;
            TweenMax.fromTo(barBg, 1, {
                css: {
                    width: "0%"
                }
            }, {
                width: "100%"
            });

            TweenMax.fromTo(fill, 2, {
                css: {
                    width: "0%"
                }
            }, {
                width: percentage + "%"
            });

            if (hasIcon) {
                let rocket = create("", "#--report-progressBar-" + index, "--report-progressRocket-" + index, "--report-progressRocket");
                TweenMax.fromTo(rocket, 2, {
                    css: {
                        left: "0%"
                    }
                }, {
                    left: percentage + "%"
                });
            }
        }

        // Number Score
        let score = create("p", "#--report-scoreContainer-" + index, "--report-score-" + index, "--report-score");
        score.innerHTML = obj.score + " / " + obj.maxScore;
    } else {
        //Tick
        create("", "#--report-scoreContainer-" + index, "--report-tick-" + index, "--report-tick");
    }

    // Flags
    // left
    create("", "#--report-screen-" + index, "--report-flagLeft-" + index, "--report-flag --report-flagLeft");
    create("", "#--report-screen-" + index, "--report-flagLineLeft-" + index, "--report-flagLine --report-flagLineLeft");
    // right
    create("", "#--report-screen-" + index, "--report-flagRight-" + index, "--report-flag --report-flagRight");
    create("", "#--report-screen-" + index, "--report-flagLineRight-" + index, "--report-flagLine --report-flagLineRight");
}

function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

var links = [];
let report = {};

function createReport() {
    report = parent.report;
    links = parent.document.querySelectorAll('.qp-link-content');
    Object.keys(report).forEach((element, index) => {
        createReportScreen(element, report[element], index);
    });
    parent.document.querySelectorAll('.variable-total-score')[1].querySelector('span').innerText = `${report["Total"]["score"]} / ${report["Total"]["maxScore"]}`;
}

console.log(parent.report);

setTimeout(createReport(), 1000);