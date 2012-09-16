/**
* Board UI controlling most aspects of what the user sees
**/

var board = {
    initialized: false,
    paper: null,

    /* Control Holders */
    noteSelector: null,

    /* CSS Classes */
    cellClass: 'sudokuCell',
    textCellClass: 'sudokuText',
    cellHighlightClass: 'highlightCell',
    cellSelectedClass: 'selectedCell',
    cellIncorrectClass: 'incorrectCell',
    cellPrePopulatedClass: 'prePopulatedCell',
    textPrePopulatedClass: 'prePopulatedText',
    noteClass: 'note',
    selectorClass: 'numSelector',
    selectorClassText: 'numSelectorText',

    /* Rect/Selector Dimensions & Gridlines width */
    sudukoRectWidth: 60,
    sudukoRectHeight: 50,

    /* State Holders */
    visible: false,
    touchEnabled: $('html.touch').length > 0,   // using modernizer to check for existance of touch class
    notesMode: false,
    paused: false,
    timerEnabled: true,
    autoRemoveNotes: false,
    highlight: false,
    highlightSelector: false,
    feedback: false,
    penalize: false,
    completed: false,

    /* Variable Holders */
    timerInterval: null,    // holder for timer interval delegate
    timeElapsedInSec: 0,    // board time holder
    clickEventType: $('html.touch').length > 0 ? 'touchstart' : 'mousedown', // event to bind to depending on touch capabilities

    /**
    * Initialize the raphael JS paper object and calls board creation methods
    * @method
    * @param {Raphael} raphael paper object
    */
    initialize: function (paper) {
        this.paper = paper; // set paper
        this.createBoard(); // create sections of UI
        this.initialized = true;    // set initialized
    },

    /**
    * Creates the board with individual rect objects and bold lines to separate regions
    * @method
    */
    createBoard: function () {
        if (this.paper !== null) {
            // create suduko board rects then set id and class
            for (var r = 0; r < 9; r++) {
                for (var c = 0; c < 9; c++) {
                    var rect = this.paper.rect(this.sudukoRectWidth * c + 3, this.sudukoRectHeight * r + this.sudukoRectHeight, this.sudukoRectWidth, this.sudukoRectHeight)
                                .attr({ 'stroke-width': .3, opacity: 1 });
                    rect.id = (r * 9) + c;  // set raphael id
                    rect.node.id = 'r' + r + 'c' + c;   // set node id
                    $(rect.node).attr({ class: this.cellClass, 'data-board': true, 'data-sudoku-rect': true });  // set class and data-board attribute
                }
            }

            this.createGridLines(); // creates grid lines
            this.createSelectors(); // create selectors

            // create secondary board elements 
            this.createTimer(false);
            this.createBackButton();
            this.createPauseButton();
            this.createPauseSymbol();
            this.createNoteSelector();
            this.createDeleteButton();
            this.createDifficultyText();
            this.createInstructionText();
        }
    },

    /**
    * Creates the outline lines and the internal grid lines
    * @method
    */
    createGridLines: function () {
        var gridLines = this.paper.set();
        var gridStrokeWidth = 4;

        // outline line
        gridLines.push(this.paper.path('M2,50L545,50').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }).toFront());    // top longitute
        gridLines.push(this.paper.path('M2,500L545,500').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }).toFront());  // bottom longitute
        gridLines.push(this.paper.path('M3,48L3,502').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }).toFront());     // left lattitude
        gridLines.push(this.paper.path('M543,50L543,502').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }).toFront()); // right lattitude

        // interior lines
        gridLines.push(this.paper.path('M2,200L545,200').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }));    // top longitute
        gridLines.push(this.paper.path('M2,350L545,350').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }));    // bottom longitute
        gridLines.push(this.paper.path('M183,50L183,502').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }));   // left lattitude
        gridLines.push(this.paper.path('M363,50L363,502').attr({ fill: '#000', 'stroke-width': gridStrokeWidth }));   // right lattitude

        // loop over set and set attributes
        for (var i = 0; i < gridLines.length; i++) {
            var line = gridLines[i];
            $(line.node).attr({ 'data-board': true, 'data-gridline': true });
        }

        $('[data-gridline=true]').css({ opacity: .1 }).show(); // set the gridlines to an opacity of .1
    },

    /**
    * Creates rect objects at the bottom which represent numbers to place in the sudoku board
    * @method
    * @param {Number} amount
    */
    createSelectors: function () {
        var selectorWidth = 45;
        var selectorHeight = 45;

        // create selector sets
        for (var i = 0; i < 9; i++) {
            // create rect
            var rect = this.paper.rect((i * this.sudukoRectWidth) + 10, 516, selectorWidth, selectorHeight).attr({ opacity: 0 });
            rect.node.id = 'selector' + i;  // set node id
            $(rect.node).attr({ class: this.selectorClass, 'data-num': i + 1, 'data-selector': true, 'data-enabled': true, 'data-board': true,
                'data-raphael-id': rect.id, 'data-auto-attach-events': false
            }); // set class, num and enabled

            // create text
            var text = this.paper.text(((i * this.sudukoRectWidth) + 33), 550, i + 1).attr({ opacity: 0 });
            text.node.id = 'selector' + i + 't';  // set node id
            $(text.node).attr({ class: this.selectorClassText, 'data-num': i + 1, 'data-selector': true, 'data-board': true,
                'data-raphael-id': rect.id, 'data-auto-attach-events': false
            });    // set class of rect
        }

        // attach touch / click event (depending on if it's enabled) to selector
        $('[data-selector=true]').bind(this.clickEventType, function () {
            // check if the board is in selector highlight mode
            if (board.highlightSelector) {
                var selector = null;

                if ($(this).attr('data-enabled') == 'true') {
                    var previousNum = $('rect[data-selector][data-selected]').attr('data-num'); // get previous num

                    // get all rect selectors and remove the glow if it has one
                    $('rect[data-selector]').each(function () {
                        $(this).removeAttr('data-selected');
                        selector = board.paper.getById($(this).attr('data-raphael-id'));
                        if (selector.g != undefined) { selector.g.remove(); }    // remove glow if it has one
                    });

                    // if the selected num equals the previous selected, then just keep all glows removed
                    if (previousNum != $(this).attr('data-num')) {
                        var raphaelId = $(this).attr('data-raphael-id');    // raphael id
                        $('rect[data-selector][data-raphael-id=' + raphaelId + ']').attr({ 'data-selected': true });
                        selector = board.paper.getById(raphaelId);    // put glow on the clicked selector
                        selector.g = selector.glow();  // add glow to data-board group

                        // add all elements making up the glow to the data-board
                        for (var i = 0; i < selector.g.items.length; i++) {
                            $(selector.g.items[i].node).attr({ 'data-board': true });
                        }
                    }
                }
            } else {
                // check if board is complete, and if not, add number
                if (!board.completed && $(this).attr('data-enabled') == 'true') {
                    board.addNumberToSelectedCell($(this).attr('data-num'));
                }

            }
        });
    },

    /**
    * Creates the timer text reference and sets off interval to update timer
    * @method
    */
    createTimer: function () {
        var timer = this.paper.text(480, 38, '00:00');
        timer.node.id = 'timer';
        $(timer.node).attr({ 'data-time': 0, 'data-board': true });
    },

    /**
    * Creates the back button element and attaches mousedown event to transition from board to menu
    * @method
    */
    createBackButton: function () {
        // back button clickable region
        var clickRegion = this.paper.rect(0, 10, 67, 30).attr({ fill: "#fff", stroke: '#fff' });
        clickRegion.node.id = 'backClickRegion';
        $(clickRegion.node).attr({ class: 'clickableRegion', 'data-board': true, 'data-button': true, 'data-button-type': 'back' }).hide();

        // back button path
        var button = this.paper.path("M 15 15 l 0 20 l -10 -10 z").attr({ fill: '#000', stroke: '#000', 'stroke-width': 2 });
        button.node.id = 'backButton';
        $(button.node).attr({ 'data-board': true, 'data-button': true, 'data-button-type': 'back' }).hide();

        // back button text
        var text = this.paper.text(39, this.sudukoRectHeight / 2, 'Menu ');
        text.node.id = 'backButtonText';
        $(text.node).attr({ 'data-board': true, 'data-button': true, 'data-button-type': 'back' }).hide();

        // attach handler
        $('[data-button=true][data-button-type="back"]').bind(this.clickEventType, function () {
            // check if game was paused, and subtract one second if going to menu from pause
            menu.homeView(sudoku.isGameInProgress());

            if (board.paused) {
                board.timeElapsedInSec -= 1;
                console.log(board.touchEnabled);
                if (board.touchEnabled) {
                    $('[data-button-type="pauseSymbol"]').css({ opacity: 0 }).hide();
                } else {
                    $('[data-button-type="pauseSymbol"]').animate({ opacity: 0 }, 200, function () { $(this).hide(); });
                }
            }
        });
    },

    /**
    * Creates the pause button element and attaches mousedown event to transition from board to pause
    * @method
    */
    createPauseButton: function () {
        var clickRegion = this.paper.rect(65, 10, 80, 30).attr({ fill: "#fff", stroke: '#fff', opacity: 0 });
        clickRegion.node.id = 'pauseClickRegion';
        $(clickRegion.node).attr({ class: 'clickableRegion', 'data-board': true, 'data-button': true, 'data-button-type': 'pause' }).hide();

        var button = this.paper.path("M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z").attr({ fill: '#000', stroke: '#000', 'stroke-width': 2 });
        button.node.id = 'pauseButton';
        $(button.node).attr({ 'data-raphael-id': button.id, 'data-board': true, 'data-button': true, 'data-button-type': 'pause', 'data-paused': this.paused }).hide();

        var text = this.paper.text(93, 31, '| Pause');
        text.node.id = 'pauseButtonText';
        $(text.node).attr({ 'data-board': true, 'data-button': true, 'data-button-type': 'pause', 'data-paused': this.paused }).hide();

        // attach text click selector to the pause events
        $('[data-button=true][data-button-type="pause"]').bind(this.clickEventType, function () {
            // if paused, then unpause board, if not paused, pause board
            if (board.paused) { board.unPauseBoard(); }
            else { board.pauseBoard(); }
        });
    },

    /**
    * Creates the pause symbol element and attaches mousedown event to transition from pause to board
    * @method
    */
    createPauseSymbol: function () {
        var clickRegion = this.paper.rect(230, 207, 80, 135, 0).attr({ fill: '#fff', stroke: '#fff', opacity: 0 });
        clickRegion.node.id = 'pauseSymbolClickRegion';
        $(clickRegion.node).attr({ class: 'clickableRegion', 'data-board': true, 'data-button': true, 'data-button-type': 'pauseSymbol' }).hide();

        var symbol = this.paper.path("M 230 207 l 0 135 l 30 0 l 0 -135 l -30 0 M 280 207 l 0 135 l 30 0 l 0 -135 z").attr({ fill: '#000', stroke: '#000', opacity: .4 });
        symbol.node.id = 'pauseSymbol';
        $(symbol.node).attr({ 'data-raphael-id': symbol.id, 'data-board': true, 'data-button': true, 'data-button-type': 'pauseSymbol' }).hide();

        // attach text click selector to the pause events
        $('[data-button=true][data-button-type="pauseSymbol"]').bind(this.clickEventType, function () { board.unPauseBoard(); });
    },

    /**
    * Creates the enable notes mode checkbox
    * @method
    */
    createNoteSelector: function () {
        if (this.paper !== null) {
            this.noteSelector = this.paper.set();

            var check = createCheckSet(510, 585, optionType.notesMode, .85, function (event) {
                var target = $(event.target);

                board.notesMode = target.attr('data-checked') == 'true' ? true : false;
            });

            check[0].node.id = 'noteCheckBox'; // box
            check[1].node.id = 'noteCheckTick'; // tick

            $('#' + check[0].node.id).attr({ 'data-board': true, 'data-form': true, 'data-auto-attach-events': false })
            $('#' + check[1].node.id).attr({ fill: 'red', stroke: 'red', 'data-board': true, 'data-form': true, 'data-auto-attach-events': false }).hide();

            // create text element
            var text = this.paper.text(460, 600, 'Notes Mode').attr({ fill: 'blue', opacity: 0, 'font-size': '17px', 'font-weight': 'bold', cursor: 'pointer' });
            text.node.id = 'noteCheckText';
            $(text.node).attr({ 'data-raphael-id': check[0].id, 'data-board': true, 'data-form': true, 'data-notes': true, 'data-auto-attach-events': false });  // add notes data to text

            this.noteSelector.push(check, text);    // add elements to set

            // attach text click selector to the noteSelectors events
            $(text.node).bind(this.clickEventType, function (e) { board.noteSelector[0][0].events[0].f(e); });
        }
    },

    /**
    * Creates the delete button for a cell, which is moved around based on which is the highlighted cell and if it's prepopulated
    * @method
    */
    createDeleteButton: function () {
        // the X in the top right corner or a user populated cell
        cellDeleteButton = this.paper.text(5, 5, 'X').attr({ stroke: 'red' });
        cellDeleteButton.node.id = 'deleteButton';
        $(cellDeleteButton.node).attr({ 'data-raphael-id': cellDeleteButton.id, 'data-auto-attach-events': false }).hide();

        // attach click event to delete button
        $(cellDeleteButton.node).bind(this.clickEventType, function (event) {
            var button = $(this);
            if (button.is(':visible')) {
                board.removeCellText($('.' + board.cellSelectedClass), true);
                board.resetCellClass('.' + board.cellHighlightClass);    // reset highlight of cells with same number

                button.css({ opacity: 0 }).hide();
                board.checkSelectors(sudoku.playerBoard); // check selectors
            }
        });

        // attach hover event to change opacity
        $(cellDeleteButton.node).hover(function (e) { $(this).css({ opacity: 1 }) }, function (e) { $(this).css({ opacity: .5 }) });
    },

    /**
    * Creates the difficulty text element
    * @method
    */
    createDifficultyText: function () {
        var difficultyText = this.paper.text(38, 608, 'Easy');
        difficultyText.node.id = 'difficultyText';
        $(difficultyText.node).css({ opacity: 0 }).attr({ 'data-board': true });
    },

    /**
    * Creates the instructions text element
    * @method
    */
    createInstructionText: function () {
        var instructionsText = this.paper.set();
        instructionsText.push(this.paper.text(250, 583, 'Instructions').attr({ 'font-size': '12px', 'font-weight': 'bold', 'cursor': 'default' }));
        instructionsText.push(this.paper.text(250, 610, 'Clicking the red X in a cell will delete the cell.').attr({ 'font-size': '12px', 'cursor': 'default' }));

        if (this.touchEnabled) {
            instructionsText.push(this.paper.text(250, 596, 'You can use your mouse, keyboard or finger.').attr({ 'font-size': '12px', 'cursor': 'default' }));
        } else {
            instructionsText.push(this.paper.text(250, 596, 'You can use your mouse or keyboard.').attr({ 'font-size': '12px', 'cursor': 'default' }));
        }

        for (var i = 0; i < instructionsText.length; i++) {
            $(instructionsText[i].node).css({ opacity: 0 }).attr({ 'data-instruction': true, 'data-board': true }).hide();
        }
    },

    /**
    * Checkes all selector numbers to see if they've been used 9 times (should disable)
    * @method
    */
    showBoard: function () {
        $('text[data-button=true][data-button-type="back"]').text('Menu').attr({ x: 40, y: 31 });   // set text and position for back button
        $('#difficultyText').text(sudoku.difficulty).attr({ fill: getDifficultyColor(sudoku.difficulty) }); // set color and text for difficulty indicator

        // if touch enabled, then skip the animation
        if (board.touchEnabled) {
            $('[data-gridline=true]').css({ opacity: .9 }); // set gridlines to opacity of .9
            $('[data-button=true][data-button-type="back"], [data-button=true][data-button-type="pause"]').show().css({ opacity: .7 });    // show back button
            $('[data-board=true][data-button-type!="pauseSymbol"][data-gridline!=true][data-selector!=true]').show().css({ opacity: 1 });  // show all board elements
        } else {
            $('[data-gridline=true]').animate({ opacity: .8 }, 500); // set gridlines to opacity of .9
            $('[data-button=true][data-button-type="back"], [data-button=true][data-button-type="pause"]').show().animate({ opacity: .7 }, 500);    // show back button
            $('[data-board=true][data-button-type!="pauseSymbol"][data-gridline!=true][data-selector!=true]').show().animate({ opacity: 1 }, 500);  // show all board elements
        }

        // set the selector data element to board.notesMode flag
        $('#' + this.noteSelector[0][0].node.id).attr({ 'data-checked': this.notesMode });
        $('#' + this.noteSelector[0][1].node.id).attr({ 'data-checked': this.notesMode });

        // hide check if not in notes mode
        if (!board.notesMode) {
            $('#' + this.noteSelector[0][1].node.id).css({ opacity: 0 }).hide();
        }

        this.noteSelector[0].attr({ 'cursor': 'pointer' }); // stupid hack to have box show the pointer cursor...

        // if timer is enabled
        if (!this.timerEnabled) {
            $('#timer').css({ opacity: 0 }).hide();
        }

        // get all rect selectors and remove the glow if it has one
        $('rect[data-selector]').each(function () {
            $(this).removeAttr('data-selected');
            selector = board.paper.getById($(this).attr('data-raphael-id'));
            if (selector.g != undefined) { selector.g.remove(); }    // remove glow if it has one
        });

        $('text[data-menu=true]').hide();   // hide all menu elements
        $('rect[data-prepopulated=false]').css({ 'cursor': 'pointer' });    // change cursor for non-pre-populated cells to pointer
        this.showSelectors();

        board.visible = true;   // update board visibility holder
    },

    /**
    * Hides all board elements
    * @method
    */
    hideBoard: function () {
        clearInterval(this.timerInterval);  // stop the timer
        this.timerInterval = null; // stop the timer
        this.paused = false; // set paused state

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            $('[data-board=true][data-sudoku-rect!=true][data-gridline!=true]').css({ opacity: 0 }).hide();  // hide all board elements
            $('[data-gridline=true]').css({ opacity: .1 }); // set gridlines to opacity of .1
        } else {
            $('[data-board=true][data-sudoku-rect!=true][data-gridline!=true]').animate({ opacity: 0 }, 250).hide(); // hide all board elements
            $('[data-gridline=true]').animate({ opacity: .1 }, 250); // animate gridlines to opacity of .1
        }

        // hide check if not in notes mode
        $('#' + this.noteSelector[0][0].node.id).css({ opacity: 0 });
        $('#' + this.noteSelector[0][1].node.id).css({ opacity: 0 }).hide();

        // set pause button back to normal path and text
        var pauseButtonId = $('path[data-button=true][data-button-type="pause"]').attr('data-raphael-id');
        var rPauseButton = this.paper.getById(pauseButtonId);

        rPauseButton.attr({ path: 'M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z', 'stroke-wdith': 2 });   // change pause path to normal
        $('text[data-button=true][data-button-type="pause"]').text('| Pause').attr({ x: 93 });  // set pause button text to normal

        $('rect').css({ cursor: 'default' }); // change cursor for all rects to default
        $('#modal, #modalText, #modalClose').hide();
        this.visible = false;   // update board visibility holder
    },

    /**
    * Stops timer, hides board cells and changes cursor
    * @method
    */
    pauseBoard: function () {
        this.paused = true; // set board pause state
        this.stopTimer();   // stop timer
        this.resetAllCellColors();  // reset all board colors

        var pauseButtonId = $('path[data-button=true][data-button-type="pause"]').attr('data-raphael-id');   // grab raphael id from data
        var rPauseButton = this.paper.getById(pauseButtonId);   // get raphael element

        // change the path of pause button to 'play'.  if touch enabled, skip the animation
        if (board.touchEnabled) {
            rPauseButton.attr({ path: 'M 111 15 l 0 20 l 10 -10 z', 'stroke-width': 2 });
        } else {
            rPauseButton.animate({ path: 'M 111 15 l 0 20 l 10 -10 z' }, 100, '<>').attr({ 'stroke-width': 2 });
        }

        $('text[data-button=true][data-button-type="pause"]').text('| Play').attr({ x: 85 });   // change text of the pause button
        $('path[data-button=true][data-button-type="pauseSymbol"]').show().animate({ opacity: .4 }, 200);   // show pause symbol
        $('rect[data-button=true][data-button-type="pauseSymbol"]').show(); // show the pause symbol clickable region
        $('text[data-board=true][data-selector!=true][data-num]').hide();  // hide all board cell text elements and show all menu cell text elements
        $('rect[data-prepopulated=false]').css({ cursor: 'default' });    // change cursor for non-pre-populated cells to pointer

        $('[data-button=true][data-button-type="pause"]').attr({ 'data-paused': this.paused });
        this.timeElapsedInSec += 1; // add one second to timer
    },

    /**
    * Starts timer, shows board cells and changes cursor
    * @method
    */
    unPauseBoard: function () {
        this.paused = false;
        var pauseButtonId = $('path[data-button=true][data-button-type="pause"]').attr('data-raphael-id');
        var rPauseButton = this.paper.getById(pauseButtonId);

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            rPauseButton.attr({ path: 'M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z', 'stroke-width': 2 });
        } else {
            rPauseButton.animate({ path: 'M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z' }, 100, '<>').attr({ 'stroke-width': 2 });
        }

        $('[data-button=true][data-button-type="pause"]').attr({ 'data-paused': this.paused }); // set paused data
        $('text[data-button=true][data-button-type="pause"]').text('| Pause').attr({ x: 92 });  // set text for pause button
        $('[data-button=true][data-button-type="pauseSymbol"]').animate({ opacity: 0 }, 200, function () { $(this).hide(); });  // animate away pause symbol

        $('text[data-board=true][data-selector!=true][data-num]').show(); // hide all board cell text elements and show all menu cell text elements
        $('rect[data-prepopulated=false]').css({ cursor: 'pointer' }); // change cursor for all rects to default

        this.startTimer();  // start timer
    },

    /**
    * Checkes selectors and then shows them based on their enabled state
    * @method
    */
    showSelectors: function () {
        // check board
        this.checkSelectors(sudoku.playerBoard);

        if (board.touchEnabled) {
            $('[data-selector=true]').show();
        } else {
            $('[data-selector=true][data-enabled=true]').show().animate({ opacity: 1 }, 350);
            $('[data-selector=true][data-enabled!=true]').show().animate({ opacity: .4 }, 350);
        }
    },

    /**
    * Shows the delete button ('X') on a specific cell
    * @method
    */
    showDeleteButton: function (rectNodeId) {
        var cell = $('#' + rectNodeId);
        $('#deleteButton').css({ opacity: 0 }).hide();

        if ((cell.attr('data-num') != 0 || cell.attr('data-notes') != undefined) && !this.isPrePopulated(cell)) {
            var deleteButton = board.paper.getById($('#deleteButton').attr('data-raphael-id'));
            var rectId = parseInt(utilities.getRaphaelIdFromElementId(rectNodeId));
            var rect = board.paper.getById(rectId);

            // if we object to place it in, then show the X in that rect's location
            if (!isNaN(rectId)) { $('#deleteButton').css({ opacity: .5 }).attr({ 'data-rect-id': rectId, x: rect.attr('x') + (this.sudukoRectWidth - 8), y: rect.attr('y') + 10 }).show(); };
        }
    },

    /**
    * Checks if the board is filled out and if the board is correct
    * @method
    */
    checkBoard: function () {
        // check if the board is completed (no empty cells) and if it's valid
        if (sudoku.isPlayerBoardFilled()) {
            $('[data-button=true][data-button-type="pause"], #deleteButton').hide();   // hide the pause button

            if (sudoku.checkPlayerBoard()) {
                this.stopTimer();   // stop timer

                this.completed = true; // set board complete flag
                $('rect[data-sudoku-rect=true], .sudokuText').css({ cursor: 'default' }); // change cursor for all rects to default
                showModal(115, 250, 'Board is correct!', 'Commodore 64 Pixelized', 25, 'green', 'blue');    //show modal

            } else {
                this.stopTimer();   // stop timer

                board.completed = false; // set board complete flag
                showModal(107, 250, 'Board is incorrect!', 'Commodore 64 Pixelized', 23, 'green', 'blue');    //show modal
            }
        }
    },

    /**
    * Checkes all selector numbers to see if they've been used 9 times (should disable)
    * @method
    */
    checkSelectors: function () {
        // run through selectors array to see if any number has been used 9 times or more
        // if so, disable, otherwise, enable
        for (var i = 1; i < 10; i++) {
            var count = $('rect[data-num="' + i + '"][data-selector!=true]').length;
            var elements = $('rect[data-num=' + i + '][data-selector=true], text[data-num=' + i + '][data-selector=true]');

            // if there is a count of 9 or greater, disable selector, otherwise enable it
            if (count >= 9) {
                elements.css({ opacity: .4 }).attr({ cursor: 'default', 'data-enabled': false });    // set appropriate properties

                // check the the selectors should be highlighted
                if (board.highlightSelector) {
                    selector = board.paper.getById($(elements[0]).attr('data-raphael-id'));    // put glow on the clicked selector
                    if (selector.g != undefined) { selector.g.remove(); }    // remove glow if it has one
                }
            } else {
                elements.css({ opacity: 1 }).attr({ cursor: 'pointer', 'data-enabled': true });    // set appropriate properties

                // check the the selectors should be highlighted
                if (board.highlightSelector) {
                    // if the element was selected, then add glow
                    if ($(elements[0]).attr('data-selected') == 'true') {
                        selector = board.paper.getById($(elements[0]).attr('data-raphael-id'));    // put glow on the clicked selector
                        selector.g.remove();
                        selector.g = selector.glow().attr({ 'data-board': true });  // add glow to data-board group
                    }
                }
            }
        }
    },

    /**
    * Creates the timer text reference and sets off interval to update timer
    * @method
    */
    startTimer: function (loadType) {
        // if it's a fresh load, reset timer, otherwise just update the text to the time elapsed
        switch (loadType) {
            case boardLoadType.fresh:
                $('#timer').text('00:00');
                board.timeElapsedInSec = 0;

                break;

            case boardLoadType.load:
            case boardLoadType.resume:
            default:
                // get seconds from data and update
                var timerText = this.getTimerText(this.timeElapsedInSec);

                // update board time and text
                $('#timer').text(timerText);

                break;
        }

        // kick off timer interval
        this.timerInterval = setInterval(this.updateTimer, 1000);
    },

    /**
    * Removes the interval to update the timer
    * @method
    */
    stopTimer: function () {
        if (this.timerInterval != undefined && this.timerInterval != null) {
            // kick off timer interval
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    /**
    * Updates timer data, calculates the appropriate timer text and updates
    * @method
    */
    updateTimer: function () {
        // get seconds from data and update
        var secondsTimer = board.timeElapsedInSec + 1;

        // calculate text to insert into timer
        var timerText = board.getTimerText(secondsTimer);

        $('#timer').text(timerText);    // set timer text
        board.timeElapsedInSec = secondsTimer;  // set time holder
    },

    /**
    * Calculates the text to display on the timer based on the number of seconds passed in
    * @method
    * @param {Number} secondsTimer
    */
    getTimerText: function (secondsTimer) {
        // calculate text to insert into timer
        var hours = '' + Math.floor((secondsTimer / 60) / 60);
        var minutes = '' + Math.floor((secondsTimer / 60) - (hours * 60));
        var seconds = '' + (secondsTimer - ((minutes * 60) + (hours * 60 * 60)));
        var timerText = '';

        // set timer text
        if (hours == '0') {
            timerText += (minutes.length == 0) ? '00' : ((minutes.length == 1) ? '0' + minutes : minutes);
            timerText += ':' + ((seconds.length == 0) ? '00' + seconds : ((seconds.length == 1) ? '0' + seconds : seconds));
        } else {
            timerText += hours.length == 1 ? '0' + hours : hours;
            timerText += ':' + ((minutes.length == 0) ? '00' : ((minutes.length == 1) ? '0' + minutes : minutes));
            timerText += ':' + ((seconds.length == 0) ? '00' + seconds : ((seconds.length == 1) ? '0' + seconds : seconds));
        }

        return timerText;
    },

    /**
    * Resets all highlighted board cells to regular css cell color class via jQuery
    * @method
    */
    resetAllCellColors: function () {
        // reset all highlighted cells to standard cell class
        $('#deleteButton').css({ opacity: 0 }).hide();
        this.resetCellClass('.' + this.cellHighlightClass);
        this.resetCellClass('.' + this.cellSelectedClass);
        this.removeSelectedHighlight();
    },

    /**
    * Highlights all cells with a specific number on a board (swap css class)
    * @method
    * @param {Number} number
    */
    highlightNumberCells: function (number) {
        if (this.highlight) {
            // parse number and check if it's valid
            number = parseInt(number);

            // check if have a number to highlight
            if (number > 0) {
                // set all rect with the specific number to highlighted
                $('rect[data-num=' + number + '][data-selector!=true]').attr({ class: this.cellHighlightClass });
            }
        }
    },

    /**
    * Highlights a cell by changing its class and also adding number data if supplied
    * @method
    * @param {Text} rectNodeId
    * @param {Text} number
    */
    highlightSelectedCell: function (rectNodeId) {
        $('#' + rectNodeId).attr({ class: this.cellSelectedClass, 'data-selected': true });
    },

    /**
    * Highlights all cells with a specific number on a board (swap css class)
    * @method
    * @param {Number} number
    */
    highlightSelectedAndNumberCells: function () {
        if (this.highlight) {
            var highlighted = $('rect[data-selected=true][data-selector!=true]');
            // parse number and check if it's valid
            var number = parseInt(highlighted.attr('data-num'));

            board.resetAllCellColors()

            // check if have a number to highlight
            if (number > 0) {
                // set all rect with the specific number to highlighted
                $('rect[data-num=' + number + ']').attr({ class: this.cellHighlightClass });
            }

            highlighted.attr({ class: this.cellSelectedClass });
        }
    },

    /**
    * Resets an entire class of cells to their original class
    * @method
    * @param {Text} classToReset
    */
    resetCellClass: function (selector) {
        $(selector).each(function () {
            if (!board.isPrePopulated($(this))) {
                $(this).attr({ class: board.cellPrePopulatedClass });
            } else {
                $(this).attr({ class: board.cellClass });
            }
        });
    },

    /**
    * Removes the data-selected attribute
    * @method
    * @param {Text} classToReset
    */
    removeSelectedHighlight: function () {
        // remove selected attribute from all cells which have it
        $('rect[data-selected=true][data-selector!=true]').removeAttr('data-selected');
    },

    /**
    * Adds a raphael text element to a rect
    * @method
    * @param {Raphael} rect
    * @param {Number} number
    * @param {Boolean} prePopulated
    */
    addCellNumber: function (rect, number, prePopulated) {
        var cellText, textClass, cellClass;

        // add text number to cell (different attributes if prepopulated)
        if (prePopulated) {
            cellText = this.paper.text(parseInt(rect.attr('x')) + (this.sudukoRectWidth / 2), parseInt(rect.attr('y')) + (this.sudukoRectHeight / 1.35), number);
            cellClass = this.cellPrePopulatedClass;
            textClass = this.textPrePopulatedClass;
        } else {
            cellText = this.paper.text(parseInt(rect.attr('x')) + (this.sudukoRectWidth / 2), parseInt(rect.attr('y')) + (this.sudukoRectHeight / 1.35), number);
            cellClass = this.cellClass;
            textClass = this.textCellClass;
        }

        cellText.node.id = rect.attr('id') + 't';   // add cell Id, which is the rect node id + t and the class
        $(cellText.node).attr({ class: textClass, 'data-board': true, 'data-num': number });   // set class and data-board attributes
        rect.attr({ class: cellClass, 'data-board': true, 'data-num': number, 'data-prepopulated': prePopulated }).removeAttr('data-notes'); // set rect attributes
    },

    /**
    * Adds a raphael text element to a rect
    * @method
    * @param {Raphael} rect
    * @param {Number} number
    * @param {Boolean} prePopulated
    */
    addCellNote: function (rect, number) {
        var cellText = null;
        var jRect = $('#' + rect.node.id);
        var currentNotes = [];

        var xOffset = 0;
        var yOffset = 0;

        // fill up array of current notes
        if (jRect.attr('data-notes') != undefined) {
            currentNotes = jRect.attr('data-notes').split(',');
        }

        // check if the number is already in the notes array
        if ($.inArray(number.toString(), currentNotes) == -1) {
            var noteNums = '';  // add notes number to rect

            // create array string to add to data-notes attribute
            for (var i = 0; i < currentNotes.length; i++) {
                if (i > 0) {
                    noteNums += ',';
                }

                noteNums += currentNotes[i];
            }

            jRect.attr({ 'data-notes': (noteNums == '' ? number : (noteNums + ',' + number)) });    // add the latest number to attribute

            // calculate offset position for individual note based on number
            if (number > 1 && number < 4) {
                xOffset = (number - 1) * 15;
            } else if (number >= 4 && number < 7) {
                xOffset = (number - 4) * 15;
                yOffset += 15;
            } else if (number >= 7) {
                xOffset = (number - 7) * 15;
                yOffset += 30;
            }

            if (number % 3 == 1) { xOffset = 0 }    // if it's a multiple of 3 + 1, reset the offset to account for newline

            // add text number to cell (different attributes if prepopulated)
            cellText = this.paper.text(rect.attr('x') + xOffset + (this.sudukoRectWidth / 5), rect.attr('y') + yOffset + 11, number);
            cellText.node.id = rect.node.id + 'n' + number; // add cell Id, which is the rect node id + t
            $('#' + cellText.node.id).attr({ class: this.noteClass, 'data-board': true, 'data-note-num': number }); // set position relationship for text to what rectangle it's in
        } else {
            this.removeCellNote(rect, number);
        }
    },

    /**
    * Shows the penalty text and then animates to upwards and to opacity 0
    * @method
    * @param {Raphael} rect
    */
    showPenaltyText: function (rect) {
        var penaltyText = this.paper.text(rect.attr('x') + (this.sudukoRectWidth / 2), rect.attr('y') + (this.sudukoRectHeight / 2),
                        '+5 sec').attr({ fill: '#AE5050', 'font-size': '15px', 'font-weight': 'bold', 'font-family': 'Consolas', 'cursor': 'pointer' });

        penaltyText.toFront();

        var newY = penaltyText.attr('y') - 75;
        penaltyText.animate({ y: newY }, 1000);
        penaltyText.animate({ opacity: 0 }, 1000, function () { this.remove(); });
    },

    /**
    * Removes Raphael text object from a rectangle
    * @method
    * @param {Raphael} rect
    */
    removeCellText: function (rect, clearPlayerBoardValue) {
        if (rect != null && rect != undefined) {
            if (rect.length > 0) {
                var currentNotes = [];

                // fill up array of current notes
                if (rect.attr('data-notes') != undefined) {
                    currentNotes = rect.attr('data-notes').split(',');

                    // remove all notes
                    for (var i = 1; i < 10; i++) {
                        $('#' + rect.attr('id') + 'n' + i).remove();
                    }
                }

                this.removeCellData(rect, true, clearPlayerBoardValue); // purge rect data

                var textEl = $('#' + rect.attr('id') + 't')
                var numText = parseFloat(textEl.text());  // if the text element exists for the rect, then remove it

                if (!isNaN(numText) && numText > -1) {
                    textEl.remove();    // remove text element
                }
            }
        }
    },

    /**
    * Removes Raphael text number from a rectangle
    * @method
    * @param {Raphael} rect
    */
    removeCellNumber: function (rect) {
        if (rect != null && rect != undefined) {
            // purge rect data
            this.removeCellData(rect, false, true);

            var textEl = $('#' + rect.node.id + 't');

            // if the text element exists for the rect, then remove it
            if (textEl.length > 0) {
                var numText = parseFloat(textEl.text());

                if (!isNaN(numText) && numText > -1) {
                    textEl.remove();
                }
            }
        }
    },

    /**
    * Removes Raphael text object from a rectangle
    * @method
    * @param {Raphael} rect
    */
    removeCellNote: function (rect, noteNum) {
        if (rect != null && rect != undefined) {
            // purge rect data
            var textEl = $('text[id=' + rect.node.id + 'n' + noteNum + ']');

            // if the text element exists for the rect, then remove it
            textEl.remove();

            // get reference to jQuery rect
            var jRect = $('#' + rect.node.id);
            var currentNotes = [];

            // fill up array of current notes in rect
            if (jRect.attr('data-notes') != undefined) {
                currentNotes = jRect.attr('data-notes').trim().split(',');

                // find index of item to remove and splice it from the array
                var index = currentNotes.indexOf(noteNum.toString());
                currentNotes.splice(index, 1);

                // create string to write back to data-notes
                var noteNums = '';
                for (var i = 0; i < currentNotes.length; i++) {
                    if (i > 0) {
                        noteNums += ',';
                    }

                    noteNums += currentNotes[i];
                }

                jRect.attr({ 'data-notes': noteNums }); // update the data-notes attribute
            }
        }
    },

    /**
    * Removes data attached to a rect and removes the number from the player board
    * @method
    * @param {Raphael} rect
    * @param {Bool} removeNotes
    * @param {Bool} removePlayerBoardValue
    */
    removeCellData: function (rect, removeNotes, removePlayerBoardValue) {
        if (rect != null) {
            // remove data from raphael object, html element and sudoku player board
            //console.log('before: ' + rect.attr('data-num'));
            rect.attr({ 'data-num': 0 });
            //console.log('after: ' + rect.attr('data-num'));

            // if remove notes
            if (removeNotes) {
                rect.removeAttr('data-notes');
            }

            // if remove the player board value
            if (removePlayerBoardValue) {
                var rectId = utilities.getRaphaelIdFromElementId(rect.attr('id'));
                sudoku.setPlayerBoardValue(Math.floor(rectId / 9), rectId % 9, 0);
            }

        }
    },

    /**
    * Removes data attached to a rect and removes the number from the player board
    * @method
    * @param {String} cellId
    * @param {Number} number
    */
    removeNoteFromCellRelations: function (cellId, number) {
        // call to check notes if enabled
        var rowCol = utilities.getRowColFromElementId(cellId);
        var cellsToCheck = sudoku.getCellRelations(rowCol.row, rowCol.column);

        var raphaelId = 0;

        for (var i = 0; i < cellsToCheck.length; i++) {
            raphaelId = utilities.getRaphaelIdFromElementId('r' + cellsToCheck[i].row + 'c' + cellsToCheck[i].column); // get raphael id from row/col
            this.removeCellNote(this.paper.getById(raphaelId), number);
        }
    },

    /**
    * Calculate direction of selected cell change and then changes css classes via jQuery
    * @method
    * @param {String} direction
    */
    moveSelectedCell: function (direction) {
        var selectedCell = $('.' + this.cellSelectedClass);
        var positionChange = 0;

        // calculate position change based off arrow
        if (selectedCell.length > 0) {
            switch (direction) {
                case 'up':
                    positionChange = -9;
                    break;

                case 'down':
                    positionChange = 9;
                    break;

                case 'left':
                    positionChange = -1;
                    break;

                case 'right':
                    positionChange = 1;
                    break;
            }

            // calculate new cell to highlight
            var position = utilities.getRaphaelIdFromElementId(selectedCell.attr('id')) + positionChange;

            // if we have a valid cell (id between 0 - 80), then highlight new cell
            if (position >= 0 && position < 81) {
                var rect = this.paper.getById(position);
                var jRect = $('#' + rect.node.id);

                // reset colors, highlight cell based on data from rect object and highlight selected cell
                this.resetAllCellColors();
                this.highlightNumberCells(jRect.attr('data-num'));
                this.highlightSelectedCell(rect.node.id);
                this.showDeleteButton(rect.node.id);
            }
        }
    },

    /**
    * Finds selected cell and then removes text inside cell
    * @method
    */
    deleteSelectedCell: function (number) {
        var selectedCell = $('.' + this.cellSelectedClass); // find selected cell

        if (selectedCell.length > 0) {
            // from element id, get raphael object Id
            var rect = this.paper.getById(utilities.getRaphaelIdFromElementId(selectedCell.attr('id')));

            if (rect != null) {
                if (!this.isPrePopulated(selectedCell)) {
                    this.removeCellText(selectedCell, !this.notesMode); // remove cell text
                    $('#deleteButton').css({ opacity: 0 }).hide();  // hide the X delete button
                    this.checkSelectors(sudoku.playerBoard);  // check the selectors
                }
            }
        }
    },

    /**
    * Checks is a rect was pre populated or not
    * @method
    */
    isPrePopulated: function (rect) {
        return rect.attr('data-prepopulated') == 'true' ? true : false;
    },

    /**
    * Adds a Raphael text object to the selected cell
    * @method
    * @param {Number} number
    */
    addNumberToSelectedCell: function (number) {
        var startTime = new Date();

        var selectedCell = $('.' + this.cellSelectedClass);
        var rect = this.paper.getById(utilities.getRaphaelIdFromElementId(selectedCell.attr('id')));

        // if we have a jquery object representing the cell, then grab info from it and add number
        if (selectedCell.length > 0 && !this.isPrePopulated(selectedCell) && rect != null && rect != undefined) {
            // if notes are enabled, just add the note text
            if (board.notesMode == true) {
                this.removeCellNumber(rect);
                this.addCellNote(rect, number);
                this.showDeleteButton(rect.node.id);
            } else {
                // check the number of times number has been placed
                var numberUsage = sudoku.checkNumberUsage(number);

                if (numberUsage < 9) {
                    if (selectedCell.attr('data-num') != number) {
                        var isCorrect = true;

                        // instant feeback feature alerts user to incorrect number entry to a cell
                        if (this.feedback) {
                            // check if there is already a number in the cell, if not, just check player enetered number
                            if (selectedCell.attr('data-num') > 0) {
                                // if the current number doesn't match, then check check if the entered number is correct
                                // otherwise break b/c the number in the cell already is correct
                                if (!sudoku.checkCell(selectedCell.attr('data-num'), Math.floor(rect.id / 9), rect.id % 9)) {
                                    isCorrect = sudoku.checkCell(number, Math.floor(rect.id / 9), rect.id % 9);
                                } else {
                                    return;
                                }
                            } else {
                                // check if the player entered number is correct
                                isCorrect = sudoku.checkCell(number, Math.floor(rect.id / 9), rect.id % 9);
                            }
                        }

                        // if it's correct
                        if (isCorrect) {
                            this.removeCellText(selectedCell, true);  // remove text from cell
                            this.addCellNumber($('#' + rect.node.id), number, false);    // add new text to cell
                            sudoku.setPlayerBoardValue(Math.floor(rect.id / 9), rect.id % 9, number);   // set player board with new number

                            this.resetAllCellColors();  // reset colors
                            this.highlightNumberCells(number);  // highlight number cells
                            this.highlightSelectedCell(rect.node.id);   // highlight selected cell
                            this.showDeleteButton(rect.node.id);    // show delete button

                            // if the option is enabled, then remove note entries for all related cells of the number just enetered
                            if (this.autoRemoveNotes) { this.removeNoteFromCellRelations(selectedCell.attr('id'), number); }

                            this.checkBoard();  // check board
                            this.checkSelectors(sudoku.playerBoard);    // check bottom selectors and disable if needed
                        } else {
                            // calculate animation boundaries
                            var origX = rect.attr('x');
                            var leftX = rect.attr('x') - 15;
                            var rightX = rect.attr('x') + 15;

                            // make cell incorrect class, then flash it from red - blue - red - blue with 3 timeouts
                            selectedCell.attr({ class: this.cellIncorrectClass });
                            setTimeout(function () { selectedCell.attr({ class: board.cellSelectedClass }); }, 100, selectedCell);
                            setTimeout(function () { selectedCell.attr({ class: board.cellIncorrectClass }); }, 200, selectedCell);
                            setTimeout(function () { selectedCell.attr({ class: board.cellSelectedClass }); }, 300, selectedCell);

                            if (this.penalize && this.timerEnabled) {
                                this.showPenaltyText(rect);
                                this.timeElapsedInSec += 5; // penalize 5 seconds
                            }
                        }
                    }
                }
            }
        }

        console.log('took ' + ((new Date() - startTime) / 1000) + ' sec(s)');
    },

    /**
    * Populates board with numbers from array.  Sets all cells to prePopulated and bold font-weight
    * @method
    * @param {Array} numberArray
    */
    populate: function (numberArray) {
        // loop through array
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                var rect = $('#r' + r + 'c' + c);

                // make sure it's not empty (0) and under 10
                if (numberArray[r][c] > 0 && numberArray[r][c] < 10) {
                    // set pre populated class, data-num and data-prepopulated attributes on rect.node
                    this.addCellNumber(rect, numberArray[r][c], true, 1);
                } else if (numberArray[r][c] == 0) {
                    // set regular cell class, data-num and data-prepopulated attributes on rect.node
                    rect.attr({ class: this.cellClass, 'data-num': 0, 'data-prepopulated': false });
                }

                rect.removeAttr('data-notes');
            }
        }
    },

    /**
    * Populates board with numbers from array.  Checks if a cell is pre-populated already, and if not and it has a value sets cell to NOT prePopulated and normal font-weight
    * @method
    * @param {Array} numberArray
    */
    populateWithPlayerBoard: function (numberArray) {
        // loop through array
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                var rect = $('#r' + r + 'c' + c);

                // make sure it's not empty (0) and under 10
                if (!this.isPrePopulated(rect)) {
                    if (numberArray[r][c] > 0 && numberArray[r][c] < 10) {
                        rect.attr({ 'data-num': numberArray[r][c], 'data-prepopulated': false });   // add data of what number it contains to element
                        this.addCellNumber(rect, numberArray[r][c], false);    // add the cell text to the rect
                    } else {
                        var rectNotes = $.grep(sudoku.notes, function (note) { return note.rect == position; });

                        if (rectNotes.length == 1) {
                            var notes = rectNotes[0].notes.trim().split(',');

                            for (var n = 0; n < notes.length; n++) {
                                this.addCellNote(rect, notes[n]);
                            }
                        }
                    }
                }
            }
        }
    },

    /**
    * Loops through rect objects, resetting data and clearing text from cells
    * @method
    */
    clearBoard: function () {
        // loop through array
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                var rect = $('#r' + r + 'c' + c);

                this.removeCellText(rect, false);   // remove cell text
                rect.attr({ class: this.cellClass, 'data-num': 0, 'data-prepopulated': false }).removeAttr('data-notes');   // remove data from rect el and node of rect
            }
        }
    }
};