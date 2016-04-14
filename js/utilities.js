/**
* Board UI controlling most aspects of what the user sees
**/

var utilities = {
    /**
    * Takes all modal related elements and moves them to the bottom of the element children of the svg element
    * This allows for the modal to be on top of everything else, similar to css z-index
    * @method
    */
    positionModal: function () {
        $('#modal, #modalText, #modalClose').appendTo('svg').show();
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
    },

    /**
    * Parse a Raphael object Id to an element Id
    * @method
    * @param {Number} raphaelId
    */
    getRowColFromElementId: function (elementId) {
        // element Id follows rXcX, parse out row and column via substring
        var row = parseInt(elementId.substring(1, 2));
        var col = parseInt(elementId.substring(3, 4));

        return { 'row': row, 'column': col };
    }
}