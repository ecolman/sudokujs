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

function array_search(needle, haystack, argStrict) {
    // +   original by: Kevin van Zonneveld 
    // +      input by: Brett Zamir

    var strict = !!argStrict;
    var key = '';

    for (key in haystack) {
        if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
            return key;
        }
    }

    return false;
} 