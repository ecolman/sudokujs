/**
* Checks if the page is touch enabled or not, then resizes based on window size + modifier
* @method
*/
function resizePaper() {
    var win = $(window);

    var ox = board.paper.h;
    var oy = board.paper.w;

    //    var x = win.width() - (board.touchEnabled ? 5 : 20);
    var x = (win.width() > 900) ? 900 : win.width();
    var y = (win.height() > 700 && !board.touchEnabled) ? 700: win.height() - 50;

    // if touch enabled, change the height slightly
    menu.paper.changeSize(x, y, false, false);
}

/**
* Grabs all rect with data-notes attached and parses this together into an array in object notation
* @method
*/
function getJSONNotes() {
    var notes = [];

    $('rect[data-notes]').each(function (key, value) {
        var jRect = $(value);

        if (jRect.attr('data-notes').length > 0) {
            notes.push({ rect: board.getRaphaelIdFromElementId(jRect.attr('id')), notes: jRect.attr('data-notes') });
        }
    });

    return notes;
}


function getTime() {
    var date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds();
}