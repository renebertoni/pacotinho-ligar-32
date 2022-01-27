// #region DRAW LINE
// var pa_telas[currentScreen] = 0;
var fix_button;
var pa_telas = [0, 0, 0, 0, 0, 0, 0, 0] // colocar valores relativo a todas as telas de exercicio
var position = [];

function createDrawline(obj) {
    correctAnswer = [];

    // #region start settings
    startID = [];
    endID = [];

    let start = document.querySelectorAll(".start");
    let end = document.querySelectorAll(".end");

    // Searching Element Positions
    for (let i = 0; i < start.length; i++) {
        startID[i] = start[i].id.split("-")[1];
        endID[i] = end[i].id.split("-")[1];
    }

    // Setting Correct Answer
    for (let i = 0; i < startID.length; i++) {
        let position = parseInt(startID.indexOf(i.toString()));
        let answer = parseInt(endID.indexOf(i.toString()));

        correctAnswer[position] = answer;
    }

    console.log("Correct answer: " + correctAnswer);
    //#endregion

    // let id = obj.id;
    let startPoint = [];
    let endPoint = [];
    let currentAnswer = [];
    let currentStartPoint = null;
    let currentMousePosition = [];

    let body = document.querySelector("body");
    body.id = "body";

    // #region events
    let startPointMouseUpEvent = function (e) {
        RemoveGhost();
        RemoveTouchUP();

        let i = parseInt(e.target.id.split("-")[1]);

        currentStartPoint.removeEventListener("mousedown", endPointEvent);
        currentStartPoint.removeEventListener("touchstart", endPointEvent);

        // Set end point case its free
        if (CheckStartPointIsMarked(i) && currentStartPoint != null) {
            currentStartPoint.classList.add("--pratice-selected");
            startPoint[i].classList.add("--pratice-selected");

            if (currentStartPoint.firstChild != null) {
                currentStartPoint.removeChild(currentStartPoint.firstChild);
            }

            CreateLine(this, currentStartPoint);

            let m_startPositions = GetPointArrayPosition(startPoint[i]);
            let m_endPositions = GetPointArrayPosition(currentStartPoint);

            // set answer
            currentAnswer[m_startPositions] = m_endPositions;
            CheckAnswer(m_startPositions);
        }
        else if (currentStartPoint != null && currentStartPoint.childElementCount > 0) {
            currentStartPoint.classList.remove("--pratice-selected");
            currentStartPoint.removeChild(currentStartPoint.firstChild);
        }

        currentStartPoint = null;
    }

    let endPointMouseUpEvent = function (e) {
        RemoveGhost();
        RemoveTouchUP();

        let i = parseInt(e.target.id.split("-")[1]);

        endPoint[i].removeEventListener("mousedown", endPointEvent);
        endPoint[i].removeEventListener("touchstart", endPointEvent);

        //Set end point case its free
        if (CheckEndPointIsMarked(endPoint[i]) && currentStartPoint != null) {
            currentStartPoint.classList.add("--pratice-selected");
            endPoint[i].classList.add("--pratice-selected");
            CreateLine(currentStartPoint, this);

            let m_startPositions = GetPointArrayPosition(currentStartPoint);
            let m_endPositions = GetPointArrayPosition(endPoint[i]);

            // set answer
            currentAnswer[m_startPositions] = m_endPositions;
            CheckAnswer(m_startPositions);
        }
        else if (currentStartPoint != null && currentStartPoint.childElementCount > 0) {
            currentStartPoint.classList.remove("--pratice-selected");
            currentStartPoint.removeChild(currentStartPoint.firstChild);
        }

        currentStartPoint = null;
        e.stopPropagation();
    }

    // Checar mobile avançado
    var isMobile = false;
    function mobileAndTabletCheck() {
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        isMobile = check;
        return check;
    };

    //touch
    const eventUP = (event) => {
        var endTarget = document.elementFromPoint(
            position[0],
            position[1] - window.scrollY
        );

        simulate(endTarget, "mouseup");
    }

    let startPointEvent = function (e) {

        for (let i = 0; i < amout; i++) {
            endPoint[i].addEventListener("mouseup", endPointMouseUpEvent);

            startPoint[i].removeEventListener("mouseup", startPointMouseUpEvent);
            startPoint[i].removeEventListener("touchend", startPointMouseUpEvent);
            startPoint[i].removeEventListener("touchend", eventUP);
            // console.log("Desabilitando Start: " + i);
        }

        this.addEventListener("touchend", eventUP);

        e.preventDefault();
        this.classList.add("--pratice-selected");
        currentStartPoint = this;

        if (mobileAndTabletCheck()) {
            currentMousePosition = [e.touches[0].pageX, e.touches[0].pageY];
        }
        else {
            currentMousePosition = [e.pageX, e.pageY];
        }

        let m_startPositions = GetPointArrayPosition(currentStartPoint);

        // Clear Endpoint connected
        if (currentStartPoint.firstChild != null) {
            if (currentAnswer[m_startPositions] !== "") {
                let m_endPosition = document.getElementById("endPoint-" + currentAnswer[m_startPositions]);

                m_endPosition.addEventListener("mousedown", endPointEvent);
                m_endPosition.addEventListener("touchstart", endPointEvent);
                m_endPosition.classList.remove("--pratice-selected");
                currentAnswer[m_startPositions] = "";
            }
        }
        RemoveGhost();
        CreateGhost();
        CalculatePoints();
    }

    let endPointEvent = function (e) {
        for (let i = 0; i < amout; i++) {
            startPoint[i].addEventListener("mouseup", startPointMouseUpEvent);

            endPoint[i].removeEventListener("mouseup", endPointMouseUpEvent);
            endPoint[i].removeEventListener("touchend", endPointMouseUpEvent);
            endPoint[i].removeEventListener("touchend", eventUP);
            // console.log("Desabilitando End: " + i);
        }

        this.addEventListener("touchend", eventUP);

        e.preventDefault();
        this.classList.add("--pratice-selected");
        currentStartPoint = this;

        if (mobileAndTabletCheck()) {
            currentMousePosition = [e.touches[0].pageX, e.touches[0].pageY];
        }
        else {
            currentMousePosition = [e.pageX, e.pageY];
        }

        let m_startPositions = GetPointArrayPosition(currentStartPoint);
        let hasInArray = currentAnswer.includes(parseInt(m_startPositions));

        // Clear Endpoint connected
        if (currentStartPoint.firstChild != null) {
            if (hasInArray) {
                let indexToClear = currentAnswer.indexOf(parseInt(m_startPositions));

                let m_endPosition = document.getElementById("startPoint-" + indexToClear);

                m_endPosition.addEventListener("mousedown", startPointEvent);
                m_endPosition.addEventListener("touchstart", startPointEvent);
                m_endPosition.classList.remove("--pratice-selected");
                currentAnswer[indexToClear] = "";
            }
        }
        RemoveGhost();
        CreateGhost();
        CalculatePoints();
    }
    // #endregion

    let amout = obj.length / 2;

    for (let i = 0; i < amout; i++) {
        obj[i].id = "startPoint-" + i;
        obj[i].onmouseup = null;
        startPoint[i] = obj[i];

        obj[amout + i].id = "endPoint-" + i;
        obj[amout + i].onmouseup = null;
        endPoint[i] = obj[amout + i];
    }

    // Elements
    for (let i = 0; i < amout; i++) {
        currentAnswer[i] = "";

        EnablePoints();
    }

    function CheckAnswer(arrayPosition) {
        // console.log(currentAnswer);
        CalculatePoints();

        if (currentAnswer[arrayPosition] === correctAnswer[arrayPosition]) {
            // console.log("correto");
            let audioToPlay = (pa_telas[currentScreen] < correctAnswer.length) ? "#audio-ok" : "#audio-allok";

            let audio = parent.document.querySelector(audioToPlay);

            audio.play();
        }
        else {
            // console.log("incorreto");
            let audio = parent.document.querySelector("#audio-wrong");
            audio.play();
        }
    }

    //#region prevent marks more than one
    function CheckStartPointIsMarked(startPoint) {
        if (currentAnswer[startPoint] !== "") return false;
        else return true;
    }

    function CheckEndPointIsMarked(endPoint) {
        let m_end = GetPointArrayPosition(endPoint);

        for (let i = 0; i < currentAnswer.length; i++) {
            if (currentAnswer[i] === m_end) {
                return false;
            }
        }

        return true;
    }

    function GetPointArrayPosition(point) {
        let position = parseInt(point.id.split("-")[1]);
        return position;
    }
    //#endregion

    // Line follow the cursor
    let ghost = null;

    function CreateGhost() {
        ghost = create('', "#body", "--drawline-ghost", "--drawline-ghost");

        window.onmousemove = function (e) {

            let left = e.pageX;
            let top = e.pageY;


            ghost.style.left = ((currentStartPoint.offsetLeft) - (currentMousePosition[0] - left) - 20) + "px";
            ghost.style.top = ((currentStartPoint.offsetTop) - (currentMousePosition[1] - top) - 20) + "px";

            CreateLine(currentStartPoint, ghost);
        }

        window.ontouchmove = function (e) {

            let left = e.touches[0].pageX;
            let top = e.touches[0].pageY;

            position[0] = left;
            position[1] = top;

            ghost.style.left = ((currentStartPoint.offsetLeft) - (currentMousePosition[0] - left) - 20) + "px";
            ghost.style.top = ((currentStartPoint.offsetTop) - (currentMousePosition[1] - top) - 20) + "px";

            CreateLine(currentStartPoint, ghost);
        }

        window.addEventListener("mouseup", function (e) {
            if (currentStartPoint != null) {
                window.onmousemove = function (e) { };
                if (currentStartPoint.firstChild != null) {
                    currentStartPoint.removeChild(currentStartPoint.firstChild);
                    currentStartPoint.classList.remove("--pratice-selected");
                }
            }
        });

        window.addEventListener("touchend", function (e) {
            if (currentStartPoint != null) {
                window.ontouchmove = function (e) { };
                if (currentStartPoint.firstChild != null) {
                    currentStartPoint.removeChild(currentStartPoint.firstChild);
                    currentStartPoint.classList.remove("--pratice-selected");
                }
            }
        });

        currentStartPoint.addEventListener("mouseup", function (e) {
            window.onmousemove = function (e) { };
            try {
                currentStartPoint.classList.remove("--pratice-selected");
            } catch (e) { }
        });

        currentStartPoint.addEventListener("touchend", function (e) {
            window.ontouchmove = function (e) { };
            try {
                currentStartPoint.classList.remove("--pratice-selected");
            } catch (e) { }
        });
    }

    function RemoveGhost() {
        if (ghost != null) {
            window.onmousemove = function (e) { };
            window.ontouchmove = function (e) { };
            document.getElementById("body").removeChild(ghost);
            ghost = null;
        }
    }

    function RemoveTouchUP() {
        startPoint.forEach((element, index) => {
            startPoint[index].removeEventListener("touchend", eventUP);
        });
        endPoint.forEach((element, index) => {
            endPoint[index].removeEventListener("touchend", eventUP);
        });
    }

    function CreateLine(from, to) {
        if (from.firstChild != null) {
            from.removeChild(from.firstChild);
        }

        let line = create('', "#" + from.id, "--drawline-line-0", "--drawline-line");

        let m_height = (to.offsetTop - to.offsetHeight / 2) - (from.offsetTop - from.offsetHeight / 2);
        let m_width = (to.offsetLeft - to.offsetWidth / 2) - (from.offsetLeft - from.offsetWidth / 2);

        let tan = Math.sqrt(Math.pow(m_height, 2) + Math.pow(m_width, 2));

        let angleDeg = Math.atan2(m_height, m_width) * 180 / Math.PI;

        line.style.transform = "rotate(" + angleDeg + "deg)";
        line.style.width = tan + "px";
    }

    // #region Functions
    function EnablePoints() {
        for (let i = 0; i < startPoint.length; i++) {
            startPoint[i].addEventListener("mousedown", startPointEvent);
            startPoint[i].addEventListener("touchstart", startPointEvent);
            startPoint[i].style.cssText = "cursor: pointer;";

            endPoint[i].addEventListener("mousedown", endPointEvent);
            endPoint[i].addEventListener("touchstart", endPointEvent);
            endPoint[i].style.cssText = "cursor: pointer;";
        }
    }

    function DisablePoints() {
        for (let i = 0; i < startPoint.length; i++) {
            startPoint[i].removeEventListener("mousedown", startPointEvent);
            startPoint[i].removeEventListener("touchstart", startPointEvent);
            startPoint[i].style.cssText = "cursor: default;";

            endPoint[i].removeEventListener("mousedown", endPointEvent);
            endPoint[i].removeEventListener("touchstart", endPointEvent);
            endPoint[i].style.cssText = "cursor: default;";
        }
    }

    function CalculatePoints() {
        pa_telas[currentScreen] = 0;

        for (let i = 0; i < correctAnswer.length; i++) {
            if (currentAnswer[i] === correctAnswer[i]) pa_telas[currentScreen]++;
        }

        // console.log("Pontos: " + pa_telas[currentScreen]);
        setTimeout(function () {
            fix_button.click();
            fix_button.click();
        }, 200);
    }


    //#endregion

    // #region Pratice Handler
    function DefaultState() {
        EnablePoints();

        for (let i = 0; i < startPoint.length; i++) {
            if (currentAnswer[i] !== "") {
                CreateLine(startPoint[i], endPoint[currentAnswer[i]]);
                startPoint[i].classList.add("--pratice-selected");

                endPoint[currentAnswer[i]].classList.add("--pratice-selected");
                endPoint[currentAnswer[i]].removeEventListener("mousedown", endPointEvent);
                endPoint[currentAnswer[i]].removeEventListener("touchstart", endPointEvent);
            }
            else if (startPoint[i].childElementCount > 0) {
                startPoint[i].removeChild(startPoint[i].firstChild);
            }
            startPoint[i].classList.remove("--pratice-correct");
            startPoint[i].classList.remove("--pratice-incorrect");
            endPoint[i].classList.remove("--pratice-correct");
            endPoint[i].classList.remove("--pratice-incorrect");
        }
    }

    // Show Correct Markeds
    let markAllIsActive;
    function MarkAll(callback) {
        // Enable Mark All
        if (callback === "markAnswers" && !markAllIsActive) {
            markAllIsActive = true;

            for (let i = 0; i < currentAnswer.length; i++) {
                DisablePoints();
                if (startPoint[i].childElementCount > 0) {
                    if (currentAnswer[i] == correctAnswer[i]) {
                        startPoint[i].classList.add("--pratice-correct");
                        startPoint[i].firstChild.classList.add("--pratice-line-correct");
                        endPoint[currentAnswer[i]].classList.add("--pratice-correct");
                    }
                    else {
                        startPoint[i].classList.add("--pratice-incorrect");
                        startPoint[i].firstChild.classList.add("--pratice-line-incorrect");
                        endPoint[currentAnswer[i]].classList.add("--pratice-incorrect");
                    }
                }
            }
        }
        // Disable Mark All
        else markAllIsActive = false;
    }

    // Show All
    let showAnswersIsActive;
    function ShowAnswer(callback) {
        // Enable Show All
        if (callback === "showAnswers" && !showAnswersIsActive) {
            showAnswersIsActive = true;
            DisablePoints();

            for (let i = 0; i < startPoint.length; i++) {
                CreateLine(startPoint[i], endPoint[correctAnswer[i]]);
                startPoint[i].classList.remove("--pratice-selected");
                endPoint[i].classList.remove("--pratice-selected");
            }
        }
        // Disable Show All
        else showAnswersIsActive = false;
    }

    // Reset All
    function Reset(callback) {
        DefaultState();

        // Enable Reset
        if (callback === "reset") {
            for (let i = 0; i < startPoint.length; i++) {
                startPoint[i].classList.remove("--pratice-selected");
                endPoint[i].classList.remove("--pratice-selected");

                if (startPoint[i].childElementCount > 0) {
                    startPoint[i].removeChild(startPoint[i].firstChild);
                }

                currentAnswer[i] = "";
            }
            CalculatePoints();
        }
    }

    SignInFooterButton(MarkAll, ShowAnswer, Reset);
    //#endregion
}
//#endregion

// #region FOOTER BUTTONS
function SignInFooterButton(markFunction, showFunction, resetFunction) {
    let footerButtons = [];
    footerButtons[0] = document.getElementById("markAnswers");
    footerButtons[1] = document.getElementById("showAnswers");
    footerButtons[2] = document.getElementById("reset");

    for (let i = 0; i < footerButtons.length; i++) {
        footerButtons[i].addEventListener("mousedown", function (e) {
            resetFunction(footerButtons[i].id);
            markFunction(footerButtons[i].id);
            showFunction(footerButtons[i].id);
        });
    }
}

function RemoveAllListeners() {
    let x = document.querySelectorAll(".qp-connection-item-selection-button");

    for (let i = 0; i < x.length; i++) {
        var old_element = x[i];

        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    }
}

function InitializeDrawLine() {
    let y = document.querySelector(".GB1U00GHI");
    y.onmousedown = null;

    RemoveAllListeners();

    x = document.querySelectorAll(".qp-connection-item-selection-button");
    createDrawline(x);

    fix_button = document.querySelector('.qp-identification-option');
    fix_button.style.cssText = "display: none !important";
}






//|||||||||||||
function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}


function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}