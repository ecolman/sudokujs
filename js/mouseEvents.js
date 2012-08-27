var clickHoldEvent = 0;

// decide which events to bind to based on touch capability
var eventsToBindTo = 'contentMenu' + ($('html.touch').length > 0 ? ' touchstart' : ' mousedown');

/**
* MouseDown and ContextMenu event handler
* @event
* @param {Event} event
*/
$('[data-board=true]').live(eventsToBindTo, function (event) {
    // if this is 0 or 1 (a left click or touch), then highlight cells accordingly
    // if it's a right click, only fire event if it's the contextmenu type

    //console.log('got ' + event.type + ' @ ' + getTime());

    switch (event.which) {
        case 0:
        case 1:
            // check that the game board is showing
            if (menu.view == gameView.board && board.visible && !board.paused) {
                var jObj = $(this);
                var nodeId = jObj.attr('id');

                // parse Id depending it it was a text element clicked (t in id) or a notes text element (n in id)
                if (nodeId.indexOf('t') > -1) {
                    nodeId = nodeId.replace('t', '');
                } else if (nodeId.indexOf('n') > -1) {
                    nodeId = nodeId.substring(0, nodeId.indexOf('n'));
                }

                // grab number from data-num attribute of rect element
                var number = jObj.attr('data-num');

                // reset colors, highlight number cells and then selected cell
                board.resetAllCellColors();
                board.highlightNumberCells(number);
                board.highlightSelectedCell(nodeId, number);

                // if this cell is user populatable (sp?), set the timeout for notes popup
                if (jObj.attr('data-prepopulated') == 'false') {
                    clickHoldEvent = setTimeout(board.showNoteSelector, 750, nodeId);
                }
            }

            break;

        case 3:
            // only want this function to call if it was a contextmenu (right) button click
            // when the right mouse is clicked, it fires both mousedown and contextmenu, so throw out the mousedown event
            // that way we can preventDefault on the context menu and replace with our function
            if (event.type == "contextmenu") {
                event.preventDefault();
                console.log('right click');
            }
            break;
    }

    return false;
});

/**
* Mouse up event for all board cells
* @method
*/
$('[data-board=true]').live('mouseup', function (event) {
    // if there is a clickHoldEvent getting ready to fire, cancel it
    if (clickHoldEvent > 0) {
        clearTimeout(clickHoldEvent);
        clickHoldEvent = 0;
    }
});