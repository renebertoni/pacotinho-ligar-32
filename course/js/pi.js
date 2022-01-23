// CONFIGS
var debug = true;
var isLMS;
//FUNÇÕES

//Uns log colorido
function log(text) {
    if (debug) {
        console.log('%c' + text, 'color:#ffa500;font-weight: bold;');
    }
}

function logS(text) {
    if (debug) {
        console.log('%c' + text, 'color:#0080ff;font-weight: bold;');
    }
}

// Preguiça de escrever mesmo (só funciona em query simples)
function find(target) {
    return document.querySelector(target);
}

// Crea tuto chesus (Cria elementos na DOOM em forma de 'componentes' = react de pobre)
function create(tipo, target, id, classe, animationIn, animationOut) {
    if (tipo == undefined || tipo == '') {
        tipo = 'div';
    }

    var newElement = document.createElement(tipo);

    if (target != undefined && target != '') {
        var tg = find(target);
    }
    else {
        var tg = find('#container');
    }

    if (id != undefined && id != '') {
        newElement.id = id;
    }

    if (classe != undefined && classe != '') {
        newElement.className = classe;
    }

    if (animationIn != undefined && animationIn != '') {
        newElement.setAttribute("data-anima-in", animationIn);
    }

    if (animationOut != undefined && animationOut != '') {
        newElement.setAttribute("data-anima-out", animationOut);
    }

    tg.appendChild(newElement);
    return newElement;
}

// Checar mobile avançado
var isMobile2 = false;
window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    isMobile2 = check;
    return check;
};

// Verificar a orientação do celular
var checkSet = false;
function checkOrientation(divAlvo, orient) {
    var container = document.querySelector(divAlvo);
    if (orient == 'h') {
        if (window.orientation == 0 || window.orientation == 180) {
            container.style.visibility = "hidden";
        } else {
            container.style.visibility = "visible";
        }
    }
    else {
        if (window.orientation == 90 || window.orientation == -90) {
            container.style.visibility = "hidden";
        } else {
            container.style.visibility = "visible";
        }
    }

    if (!checkSet) {
        window.addEventListener("orientationchange", function () {
            checkOrientation(divAlvo, orient);
        });
        checkSet = true;
    }
}

// Shuffle Arrays
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// FUNC DE SCORMIS
function initScorm() {
    try {
        isLMS = lms.SCORM.init() ? true : false;
        log("Scorm :" + isLMS);
        if (isLMS) {
            lms.SCORM.set("cmi.core.score.min", "0");
            lms.SCORM.set("cmi.core.score.max", "100");
        }
    }
    catch (e) {
        log('Scorm Error: ' + e);
    }
}

// Da 100% e Completed
function scormIt() {
    if (isLMS) {
        lms.SCORM.set("cmi.core.lesson_status", "completed");
        lms.SCORM.set("cmi.core.score.raw", "100");
        lms.SCORM.save();
    }
}

// Checa se esta na tela
function checkElement() {
    console.log("for>>>");
    for (var i = 0; i < infos.length; i++) {
        var pivElement = document.querySelector(infos[i]);

        if (isOnScreen(pivElement)) {
            if (infosAnim[i] == false) {
                console.log("Anima: " + infos[i]);
                anim(i, pivElement);
                infosAnim[i] = true;
            }
        }
        else {
            // infosAnim[i] = false;
        }
    }
}



/*FUNÇÕES*/
function isOnScreen(elem) {
    var bounding = elem.getBoundingClientRect();

    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};