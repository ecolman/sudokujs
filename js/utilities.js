/**
* Board UI controlling most aspects of what the user sees
**/

var utilities = {
    /**
    * Checks if the page is touch enabled or not, then resizes based on window size + modifier
    * @method
    */
    resizePaper: function () {
        var win = $(window);

        var ox = board.paper.h;
        var oy = board.paper.w;

        //    var x = win.width() - (board.touchEnabled ? 5 : 20);
        var x = (win.width() > 900) ? 900 : win.width();
        var y = (win.height() > 800 && !board.touchEnabled) ? 800: win.height() - 50;

        // if touch enabled, change the height slightly
        board.paper.changeSize(x, y, false, false);
    },

    /**
    * Grabs all rect with data-notes attached and parses this together into an array in object notation
    * @method
    */
    getJSONNotes: function () {
        var notes = [];

        $('rect[data-notes]').each(function (key, value) {
            var jRect = $(value);

            if (jRect.attr('data-notes').length > 0) {
                notes.push({ rect: utilities.getRaphaelIdFromElementId(jRect.attr('id')), notes: jRect.attr('data-notes') });
            }
        });

        return notes;
    },

    /**
    * Returns the time in hours:minutes:seconds:milliseconds
    * @method
    */
    getTime: function () {
        var date = new Date();
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
    },

    /**
    * Parse an element Id to a Raphael object Id (get row and column combination)
    * @method
    * @param {String} elementId
    */
    getRaphaelIdFromElementId: function (elementId) {
        if (elementId != null) {
            // element Id follows rXcX, parse out row and column via substring
            var row = parseInt(elementId.substring(1, 2));
            var col = parseInt(elementId.substring(3, 4));

            return ((row * 9) + col);   // calculate Raphael id by multiplying row * 9 and adding column position
        }
    },

    /**
    * Parse a Raphael object Id to an element Id
    * @method
    * @param {Number} raphaelId
    */
    getElementIdFromRaphaelId: function (raphaelId) {
        // break out row and column from raphaelId
        var row = Math.floor(raphaelId / 9);
        var col = raphaelId % 9;

        return 'r' + row + 'c' + col;
    }
}

//Raphael.el.is_visible = function () {
//    return (this.node.style.display !== "none");
//}