var clickHoldEvent = 0;

// decide which events to bind to based on touch capability
var eventsToBindTo = 'contentMenu' + ($('html.touch').length > 0 ? ' touchstart' : ' mousedown');

/**
* Custom Event to populate board, start timer and show board
* @event
*/
$('body').bind('loadBoard', function (event, loadType)
{
    var startTime = utilities.getTime();

    switch (loadType) {
        case boardLoadType.fresh:
            board.clearBoard(true); // clear board
            board.resetAllCellColors(); // reset all colors
            board.notesMode = false;    // set notes mode to false
            board.populate(sudoku.culledBoard); // populate board with culled board from sudoku object

            break;

        case boardLoadType.load:
            sudoku.loadState(); // load the state from save
            board.clearBoard(false); // clear board
            board.resetAllCellColors(); // reset all colors
            board.populate(sudoku.culledBoard); // populate board with culled board from sudoku object
            board.populateWithPlayerBoard(sudoku.playerBoard);  // populate board with player added cells

            break;

        case boardLoadType.resume:
            break;
    }

    board.startTimer(loadType); // start timer
    board.showBoard();  // show board

    // fade out home menu and then hide it, if touch enabled, skip the animation
    if (board.touchEnabled) {
        $('[data-menu=true][data-main=true], [data-menu=true][data-background=true]').css({ opacity: 0 });
    } else {
        $('[data-menu=true][data-main=true], [data-menu=true][data-background=true]').animate({ opacity: 0 }, 100);
    }

    var endtime = utilities.getTime();
    //console.log('finished board load: ' + ((endtime - startTime) / 1000) + ' sec(s)');
});

/**
* MouseDown and ContextMenu event handler
* @event
* @param {Event} event
*/
$('[data-board=true][data-auto-attach-events!=false]:not([data-button-type])').live(eventsToBindTo, function (event) {
    // if this is 0 or 1 (a left click or touch), then highlight cells accordingly
    // if it's a right click, only fire event if it's the contextmenu type

    //console.log('got ' + event.type + ' @ ' + utilities.getTime());

    if (!board.completed) {

        switch (event.which) {
            case 0:
            case 1:
                // check that the game board is showing
                if (menu.view == gameView.board && board.visible && !board.paused) {
                    var jObj = $(this);
                    var nodeId = jObj.attr('id');

                    if (nodeId != undefined && nodeId != null) {
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
                        board.highlightSelectedCell(nodeId);
                        board.showDeleteButton(nodeId);

                        // check if selector highlight mode
                        if (board.highlightSelector) {
                            var num = parseInt($('rect[data-selector][data-enabled][data-selected]').attr('data-num'));   // get num from element
                            if (!isNaN(num)) { board.addNumberToSelectedCell($('rect[data-selector][data-enabled][data-selected]').attr('data-num')); } // add number to cell
                            board.removeSelectedHighlight();    // remove highlighting
                        }
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
    }

    return false;
});

/**
* Mouse up event for all board cells
* @method
*/
$('[data-board=true]').live('mouseup', function (event)
{
    // if there is a clickHoldEvent getting ready to fire, cancel it
    if (clickHoldEvent > 0) {
        clearTimeout(clickHoldEvent);
        clickHoldEvent = 0;
    }
});

/**
* For any keydown on the document, look for 1 - 9, arrows, delete or backspace key
* @method
* @param {Event} event
*/
$(document).keydown(function (event) {
    if (!board.completed) {
        var key = event.charCode || event.keyCode || 0;

        if (key >= 49 && key <= 57) {
            // 1 - 9, add number to board
            board.addNumberToSelectedCell(key - 48);
        } else if (key >= 97 && key <= 105) {
            // 1 - 9, add number to board
            board.addNumberToSelectedCell(key - 96);
        } else if (key >= 37 && key <= 40) {
            // arrow keys

            var direction = null;

            switch (key) {
                case 37:
                    direction = 'left';
                    break;

                case 38:
                    direction = 'up';
                    break;

                case 39:
                    direction = 'right';
                    break;

                case 40:
                    direction = 'down';
                    break;
            }

            // move selected key based on direction
            board.moveSelectedCell(direction);
        } else if (key === 8 || key === 46) {
            // delete or backspace, delete selected cell text
            board.deleteSelectedCell();
        }
    }
});

/**
* Checks if the page is touch enabled or not, then resizes based on window size + modifier
* @method
*/
function resizePaper() {
    var win = $(window);

    var ox = board.paper.h;
    var oy = board.paper.w;

    var x = (win.width() > 900) ? 900 : win.width();
    var y = (win.height() > 800 && !board.touchEnabled) ? 800 : win.height() - 50;  // if touch enabled, change the height slightly
    //var y = win.height() - 50;  // if touch enabled, change the height slightly

    board.paper.changeSize(x, y, false, false); // set size of paper. method signature: (w, h, center, clipping)
}

$(window).resize(resizePaper);  // set resize event to a utility function