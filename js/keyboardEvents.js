/*global board, alert, jQuery, $, document, window, event */

/**
* For any keydown on the document, look for 1 - 9, arrows, delete or backspace key
* @method
* @param {Event} event
*/
$(document).keydown(function (event) {
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
});