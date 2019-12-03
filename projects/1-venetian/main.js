let wrapper = document.getElementsByClassName('wrapper')[0];

// set how many splits we want, renders divs and sets image background positions
function setColumns(columns) {

    var columnSize = 970 / columns;

    var positionLeft = 0 - columnSize;

    for (var i = 0; columns > i; i++) {

        positionLeft = positionLeft + columnSize;

        var firstRowColumn = document.createElement("div");
        firstRowColumn.style.width = columnSize + 'px';
        firstRowColumn.style.left = positionLeft + 'px';
        firstRowColumn.style.backgroundPositionX = -positionLeft + 'px';
        firstRowColumn.classList.add("first-display");
        wrapper.appendChild(firstRowColumn);

        var secondRowColumn = document.createElement("div");
        secondRowColumn.style.width = columnSize + 'px';
        secondRowColumn.style.left = positionLeft + 'px';
        secondRowColumn.style.backgroundPositionX = -positionLeft + 'px';
        secondRowColumn.style.transform = 'rotateY(90deg)';
        secondRowColumn.classList.add("second-display");
        wrapper.appendChild(secondRowColumn);

    }

}

setColumns(20);

let firstDisplayRow = document.querySelectorAll('.first-display');
let secondDisplayRow = document.querySelectorAll('.second-display');

// responsible for rotating front side
function flipFrontSide(element, index, direction, backSideRow) {

    let degrees = 0;
    let maxDegrees;

    let interval = setInterval(function () {

        if (direction == 'forward') {
            degrees++;
            maxDegrees = 90;
        } else if (direction == 'backwards') {
            degrees--;
            maxDegrees = -90;
        }

        element.style.transform = 'perspective(600px) rotateY(' + degrees + 'deg)';

        if (degrees == maxDegrees) {

            flipBackside(index, direction, backSideRow)
            stop();
        }

    }, 1)

    function stop() {
        clearInterval(interval);
    }
}

// responsible for rotating backside. is activated in the above flipFrontSide function when front side is finished rotating
function flipBackside(index, direction, backSideRow) {

    let degrees;
    let maxDegrees;
    let element = backSideRow[index];

    if (direction == 'forward') {
        degrees = 270;
        maxDegrees = 360;
    } else if (direction == 'backwards') {
        degrees = -270;
        maxDegrees = -360;
    }

    let interval = setInterval(function () {
        if (direction == 'forward') {
            degrees++;
        } else if (direction == 'backwards') {
            degrees--;
        }

        element.style.transform = 'perspective(600px) rotateY(' + degrees + 'deg)';

        if (degrees == maxDegrees) {
            stop();
        }

    }, 1)

    function stop() {
        clearInterval(interval);
    }
}


// looping through each element, initializing rotate
function initializePlay(elements, direction, backSideRow) {

    for (var i = 0; elements.length > i; i++) {

        let element = elements[i];
        let index = i;

        function runEachWithTimeout(i) {
            setTimeout(function () {

                flipFrontSide(element, index, direction, backSideRow);

            }, i * 70);
        }

        runEachWithTimeout(i);
    }
}

// changes the image background of the back side
function changeBackground(row, imageUrl) {
    for (var i = 0; row.length > i; i++) {
        row[i].style.backgroundImage = "url('" + imageUrl + "')";
    }
}


// check to pause the animation if the element is not scrolled in to view
function checkScrollVisibility(element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

// check to pause the animation if other browser tab is open
var hidden, visibilityChange;

if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function checkWindowVisibility() {
    if (document[hidden]) {
        return false;
    } else {
        return true;
    }
}

// check to pause the animation if mouse is hovering over
document.addEventListener(visibilityChange, checkWindowVisibility, false);

let canContinueMouseIsNotOver = true;

wrapper.addEventListener("mouseenter", function () {
    canContinueMouseIsNotOver = false;
});
wrapper.addEventListener("mouseleave", function () {
    canContinueMouseIsNotOver = true;
});

// control which images should appear, and the direction of the flip. first element is the first initial image shown
let bannerLoadData = [{
        image: '1.jpg'
    },
    {
        direction: 'backwards',
        image: '2.jpg'
    }, {
        direction: 'forward',
        image: '3.jpg'
    }, {
        direction: 'backwards',
        image: '4.jpg'
    }, {
        direction: 'forward',
        image: '5.jpg'
    }, {
        direction: 'backwards',
        image: '6.jpg'
    }
]

// set the initial image
function initialLoad() {
    changeBackground(firstDisplayRow, bannerLoadData[0].image);
    bannerLoadData.shift();
}

initialLoad();

// queue of the sequence
let queueSeconds = 0;

function queueTimer() {

    if (bannerLoadData.length == 0) {
        clearInterval(queue);
    }

    if (canContinueMouseIsNotOver && checkScrollVisibility(wrapper) && checkWindowVisibility()) {

        queueSeconds = queueSeconds + 1

        if (queueSeconds == 5) {

            let row;
            let backSideRow;
            if (bannerLoadData.length & 1) {
                row = firstDisplayRow;
                backSideRow = secondDisplayRow;
            } else {
                row = secondDisplayRow;
                backSideRow = firstDisplayRow;
            }

            changeBackground(backSideRow, bannerLoadData[0].image);

            initializePlay(row, bannerLoadData[0].direction, backSideRow);

            bannerLoadData.shift();

            queueSeconds = 0;
        }

    }

}

var queue = setInterval(queueTimer, 1000);