﻿/**
* Creates a box and checkmark for the options on/off.  Creates it where provided (x/y position), sets the checked state and the type
* @method
* @param {Number} xPos
* @param {Number} yPos
* @param {Boolean} checked
* @param {optionType} type
*/
function createCheckSet(xPos, yPos, type, sizeModifier, clickEvent) {
    var checkSet = board.paper.set();
    var sizeModifier;

    // create box and tick based on x/y position
    var box = board.paper.rect(xPos, yPos, 28, 28, 5).attr({ 'fill': '#fff', 'stroke': '#000', 'stroke-width': '2' });
    var tick = board.paper.path('M 197.67968,534.31563 C 197.40468,534.31208 196.21788,532.53719 195.04234,530.37143 L 192.905,526.43368 L 193.45901,525.87968 C 193.76371,525.57497 ' +
                                '194.58269,525.32567 195.27896,525.32567 L 196.5449,525.32567 L 197.18129,527.33076 L 197.81768,529.33584 L 202.88215,523.79451 C 205.66761,520.74678 ' +
                                '208.88522,517.75085 210.03239,517.13691 L 212.11815,516.02064 L 207.90871,520.80282 C 205.59351,523.43302 202.45735,527.55085 200.93947,529.95355 C ' +
                                '199.42159,532.35625 197.95468,534.31919 197.67968,534.31563 z').attr({ 'fill': '#000' });

    if (sizeModifier != null && sizeModifier > 0) {
        box.transform('s' + sizeModifier);
        tick.transform('t' + (xPos - 182) + ', ' + (-345 + (yPos - 170)) + ', s' + (1.5 * sizeModifier));
    } else {
        tick.transform('t' + (xPos - 182) + ', ' + (-345 + (yPos - 170)) + ', s' + 1.5);
    }

    box.node.id = type + 'B';
    tick.node.id = type + 'T';

    // hide set and set attributes/data
    $(box.node).css({ opacity: 0, cursor: 'pointer' }).attr({ 'data-checked': false, 'data-type': type }).hide();
    $(tick.node).css({ opacity: 0, cursor: 'pointer' }).attr({ 'data-checked': false, 'data-type': type }).hide();

    // push it to the set
    checkSet.push(box, tick);

    // check type of obj passed in, then add either touch or click event to checkSet
    if (typeof (clickEvent) == 'function' || typeof (clickEvent) == 'undefined') {
        if (board.touchEnabled) {
            checkSet.touchstart(function (e) { checkboxHit(e); if (typeof (clickEvent) == 'function') { clickEvent(e); } });
        } else {
            checkSet.mousedown(function (e) { checkboxHit(e); if (typeof (clickEvent) == 'function') { clickEvent(e); } });
        }
    }

    return checkSet;
}

/**
* MouseDown handler for the checkbox, handles switching option on/off
* @method
* @param {Event} event
*/
function checkboxHit(event) {
    // create holder vars and get the opposite of the current checked state to get the new checked state
    var check = null;
    var box = null;
    var target = $(event.target);

    // change over to text's stored raphael object Id
    if (target[0].nodeName == 'text' || target[0].nodeName == 'tspan') {
        target = $('#' + board.paper.getById($(event.currentTarget).attr('data-raphael-id')).node.id);
    }

    // depending on the type, set the check and box objects
    switch (target[0].nodeName) {
        case 'path':
            check = target;
            box = target.prev();

            break;

        case 'rect':
            box = target;
            check = target.next();

            break;
    }

    // for some reason the data-checked isn't parsed correctly
    // so I do the inverse of whatever I get from the comparison of the attribute to text bool
    var checkState = !(check.attr('data-checked') == 'true' ? true : false);

    // set the checked state data
    check.attr({ 'data-checked': checkState });
    box.attr({ 'data-checked': checkState });

    // if it's true checkState, show check, otherwise hide check
    if (checkState) {
        check.css({ opacity: 1 }).show();
    } else {
        check.css({ opacity: 0 }).hide();
    }
}

function getDifficultyColor(difficulty) {
    switch (difficulty) {
        case boardDifficulty.easy:
            return 'green';
            break;

        case boardDifficulty.medium:
            return 'blue';
            break;

        case boardDifficulty.hard:
            return 'brown';
            break;

        case boardDifficulty.expert:
            return 'black';
            break;

        default:
            return 'green';
            break;
    }
}