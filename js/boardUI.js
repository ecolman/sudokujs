/**
* Board UI controlling most aspects of what the user sees
**/

var board = {
    initialized: false,
    paper: null,

    timerInterval: null,    // holder for timer interval delegate
    timeElapsedInSec: 0,    // board time holder

    /* Control Holders */
    gridLines: null,
    numSelectors: null,
    menuCells: null,
    backButton: null,
    pauseButton: null,
    pauseSymbol: null,
    noteSelector: null,
    cellDeleteButton: null,
    difficultyText: null,
    instructionsText: null,
    timer: null,

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
    selectorWidth: 45,
    selectorHeight: 45,
    strokeWidth: 4,

    /* State Holders */
    visible: false,
    touchEnabled: $('html.touch').length > 0,   // using modernizer to check for existance of touch class
    notesMode: false,
    paused: false,
    timerEnabled: true,
    highlight: false,
    feedback: false,
    penalize: false,

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
                    $('#' + rect.node.id).attr({ 'class': this.cellClass, 'data-board': 'true' });  // set class and data-board attribute
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
        this.gridLines = this.paper.set();

        // outline line
        this.gridLines.push(this.paper.path('M1,' + this.sudukoRectHeight + 'L' + ((this.sudukoRectWidth * 9) + 5) + ',' + this.sudukoRectHeight).attr({ opacity: 0, 'stroke-width': this.strokeWidth }).toFront()); // top lattitude
        this.gridLines.push(this.paper.path('M1,' + (this.sudukoRectHeight * 9 + this.sudukoRectHeight) + 'L' + ((this.sudukoRectWidth * 9) + 6) + ',' + (this.sudukoRectHeight * 9 + this.sudukoRectHeight))
                            .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }).toFront()); // bottom lattitude
        this.gridLines.push(this.paper.path('M' + ((this.sudukoRectWidth * 9) + 3) + ',' + (this.sudukoRectHeight - 2) + 'L' + ((this.sudukoRectWidth * 9) + 3) + ',' + (this.sudukoRectHeight * 9 + this.sudukoRectHeight + 2))
                            .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth })); // right lattitude
        this.gridLines.push(this.paper.path('M3,' + (this.sudukoRectHeight - 2) + 'L3,' + ((this.sudukoRectHeight * 9) + 1 + (this.sudukoRectHeight + 1))).attr({ opacity: 0, 'stroke-width': this.strokeWidth })); // left lattitude

        // interior lines
        this.gridLines.push(this.paper.path('M1,' + (this.sudukoRectHeight * 3 + this.sudukoRectHeight) + 'L' + ((this.sudukoRectWidth * 9) + 5) + ',' + (this.sudukoRectHeight * 3 + this.sudukoRectHeight))
                        .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }));
        this.gridLines.push(this.paper.path('M1,' + (this.sudukoRectHeight * 6 + this.sudukoRectHeight) + 'L' + ((this.sudukoRectWidth * 9) + 5) + ',' + (this.sudukoRectHeight * 6 + this.sudukoRectHeight))
                        .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }));
        this.gridLines.push(this.paper.path('M' + ((this.sudukoRectWidth * 3) + 3) + ',' + (this.sudukoRectHeight - 2) + 'L' + ((this.sudukoRectWidth * 3) + 3) + ',' + (this.sudukoRectHeight * 9 + this.sudukoRectHeight + 2))
                        .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }));
        this.gridLines.push(this.paper.path('M' + ((this.sudukoRectWidth * 6) + 3) + ',' + (this.sudukoRectHeight - 2) + 'L' + ((this.sudukoRectWidth * 6) + 3) + ',' + (this.sudukoRectHeight * 9 + this.sudukoRectHeight + 2))
                        .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }));
    },

    /**
    * Creates rect objects at the bottom which represent numbers to place in the sudoku board
    * @method
    * @param {Number} amount
    */
    createSelectors: function () {
        if (this.paper !== null) {
            this.numSelectors = this.paper.set();

            // create selector sets
            for (var i = 0; i < 9; i++) {
                // create rect
                var rect = this.paper.rect((i * this.sudukoRectWidth) + 10, ((this.sudukoRectHeight * 9) + (this.selectorHeight / 2.5) + this.sudukoRectHeight), this.selectorWidth, this.selectorHeight)
                            .attr({ opacity: 0 });

                rect.node.id = 'selector' + i;  // set node id
                // set class, num and enabled
                $('#' + rect.node.id).attr({ 'class': this.selectorClass, 'data-num': i + 1, 'data-selector': true, 'data-enabled': true, 'data-board': true, 'data-auto-attach-events': false });

                // create text
                var text = this.paper.text(((i * this.sudukoRectWidth) + (this.sudukoRectWidth / 2) + 3), ((this.sudukoRectHeight * 9) + this.sudukoRectHeight + this.sudukoRectHeight), i + 1)
                            .attr({ opacity: 0 });

                text.node.id = 'selector' + i + 't';  // set node id
                $('#' + text.node.id).attr({ 'class': this.selectorClassText, 'data-num': i + 1, 'data-selector': true, 'data-board': true, 'data-auto-attach-events': false });    // set class of rect

                this.numSelectors.push(this.paper.set().push(rect, text));  // push to the sets

                // attach touch / click event (depending on if it's enabled) to selector
                if (this.touchEnabled) {
                    this.numSelectors[i].touchstart(function () {
                        board.addNumberToSelectedCell($('#' + this.node.id).attr('data-num'));
                    });
                } else {
                    this.numSelectors[i].click(function () {
                        board.addNumberToSelectedCell($('#' + this.node.id).attr('data-num'));
                    });
                }
            }
        }
    },



    /**
    * Creates the timer text reference and sets off interval to update timer
    * @method
    */
    createTimer: function () {
        if (this.timer == null || this.timer == undefined) {
            // set global timer reference
            this.timer = this.paper.text(480, this.sudukoRectHeight / 1.75, '00:00').attr({ 'opacity': 0, 'font-size': '30px' }).data({ 'time': '0' });
            this.timer.node.id = 'timer';
        }
    },

    /**
    * Creates the back button element and attaches mousedown event to transition from board to menu
    * @method
    */
    createBackButton: function () {
        // create set and create elements
        this.backButton = this.paper.set();

        var clickRegion = this.paper.rect(0, 10, 67, 30).attr({ fill: "#fff", stroke: '#fff' });
        clickRegion.id = 5001;
        clickRegion.node.id = 'backClickRegion';
        $('#' + clickRegion.node.id).attr('class', 'clickableRegion');

        var button = this.paper.path("M 15 15 l 0 20 l -10 -10 z").attr({ fill: '#000', stroke: '#000', 'stroke-width': 2 });
        button.id = 5002;
        button.node.id = 'backButton';

        var text = this.paper.text(39, this.sudukoRectHeight / 2, 'Menu ');
        text.id = 5003;
        text.node.id = 'backButtonText';

        // add elements to set
        this.backButton.push(clickRegion, button, text);

        // hide se tand set cursor attribute
        this.backButton.attr({ opacity: 0, 'cursor': 'pointer' });

        // attach mousedown handler
        this.backButton.mousedown(function () {
            // check if game was paused, and subtract one second if going to menu from pause
            menu.homeView(sudoku.isGameInProgress());

            if (board.paused) {
                board.timeElapsedInSec -= 1;
                board.pauseSymbol.animate({ opacity: 0 }, 200); // animate the pause button
            }
        });
    },

    /**
    * Creates the pause button element and attaches mousedown event to transition from board to pause
    * @method
    */
    createPauseButton: function () {
        // create set and create elements
        this.pauseButton = this.paper.set();

        var clickRegion = this.paper.rect(65, 10, 80, 30).attr({ fill: "#fff", stroke: '#fff', opacity: 0 });
        clickRegion.id = 5004;
        clickRegion.node.id = 'pauseClickRegion';
        $('#' + clickRegion.node.id).attr({ class: 'clickableRegion', 'data-board': true });

        var button = this.paper.path("M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z").attr({ opacity: .7, fill: '#000', stroke: '#000', 'stroke-width': 2 });
        button.id = 5005;

        var text = this.paper.text(93, this.sudukoRectHeight / 2, '| Pause').attr({ 'font-size': '17px' });
        text.id = 5006;
        text.node.id = 'pauseButtonText';
        $('#' + text.node.id).attr({ class: 'clickableRegion', 'data-board': true });

        // add elements to set
        this.pauseButton.push(clickRegion, button, text);

        // hide set and set cursor attribute
        this.pauseButton.hide();
        this.pauseButton.attr({ opacity: 0 });

        // give it data to denote if it's paused
        this.pauseButton.data({ 'paused': this.paused });

        // attach text click selector to the pause events
        if (board.touchEnabled) {
            this.pauseButton.touchstart(function () {
                // if paused, then unpause board, if not paused, pause board
                if (board.paused) { board.unPauseBoard(); }
                else { board.pauseBoard(); }
            });
        } else {
            this.pauseButton.mousedown(function () {
                // if paused, then unpause board, if not paused, pause board
                if (board.paused) { board.unPauseBoard(); }
                else { board.pauseBoard(); }
            });
        }

        // attach button handler

    },

    /**
    * Creates the pause symbol element and attaches mousedown event to transition from pause to board
    * @method
    */
    createPauseSymbol: function () {
        // create set and elements
        this.pauseSymbol = this.paper.set();

        var clickRegion = this.paper.rect(230, 207, 80, 135, 0).attr({ fill: '#fff', stroke: '#fff', opacity: 0 });
        clickRegion.id = 5007;
        clickRegion.node.id = 'pauseSymbolClickRegion';
        $('#' + clickRegion.node.id).attr('class', 'clickableRegion');

        var symbol = this.paper.path("M 230 207 l 0 135 l 30 0 l 0 -135 l -30 0 M 280 207 l 0 135 l 30 0 l 0 -135 z").attr({ fill: '#000', stroke: '#000', opacity: .4 });
        symbol.id = 5008

        // add elements to set, set attributes and then hide
        this.pauseSymbol.push(clickRegion, symbol).attr({ opacity: 0, 'cursor': 'pointer' });

        // attach text click selector to the pause events
        if (board.touchEnabled) {
            this.pauseSymbol.touchstart(function () { board.unPauseBoard(); });
        } else {
            this.pauseSymbol.click(function () { board.unPauseBoard(); });
        }
    },

    /**
    * Creates the enable notes mode checkbox
    * @method
    */
    createNoteSelector: function () {
        if (this.paper !== null) {
            this.noteSelector = this.paper.set();

            var check = createCheckSet(510, 585, optionType.notesMode, .85, function (event) {
                var target = $(event.currentTarget);

                board.notesMode = target.data('checked');
            });

            check[0].node.id = 'noteCheckBox'; // box
            check[1].node.id = 'noteCheckTick'; // tick

            $('#' + check[0].node.id).attr({ 'data-board': true, 'data-form': true, 'data-auto-attach-events': false })
            $('#' + check[1].node.id).attr({ fill: 'red', stroke: 'red', 'data-board': true, 'data-form': true, 'data-auto-attach-events': false }).hide();

            // create text element
            var text = this.paper.text(460, 600, 'Notes Mode').attr({ fill: 'blue', opacity: 0, 'font-size': '17px', 'font-weight': 'bold', cursor: 'pointer' });

            text.node.id = 'noteCheckText';
            $('#' + text.node.id).attr({ 'data-checkRId': check[0].id, 'data-board': true, 'data-form': true, 'data-notes': false, 'data-auto-attach-events': false });  // add notes data to text

            // attach text click selector to the noteSelectors events
            if (board.touchEnabled) {
                text.touchstart(function (e) { board.noteSelector[0][0].events[0].f(e); });
            } else {
                text.click(function (e) { board.noteSelector[0][0].events[0].f(e); });
            }

            this.noteSelector.push(check, text);
        }
    },

    /**
    * Creates the delete button for a cell, which is moved around based on which is the highlighted cell and if it's prepopulated
    * @method
    */
    createDeleteButton: function () {
        // the X in the top right corner or a user populated cell
        this.cellDeleteButton = this.paper.text(5, 5, 'X').attr({ fill: 'red', stroke: 'red', 'font-size': '12px', 'font-weight': 'bold', 'cursor': 'pointer' }).hide();
        this.cellDeleteButton.node.id = 'cellDeleteButton';
        $('#' + this.cellDeleteButton.node.id).attr({ 'data-auto-attach-events': 'false' })

        // attach touch / click event (depending on if it's enabled) to selector
        if (this.touchEnabled) {
            this.cellDeleteButton.touchstart(function (event) {
                if (this.is_visible()) {
                    board.removeCellText($('.' + board.cellSelectedClass), true);
                    this.attr({ opacity: 0 }).hide();
                }
            });
        } else {
            this.cellDeleteButton.click(function (event) {
                if (this.is_visible()) {
                    board.removeCellText($('.' + board.cellSelectedClass), true);
                    this.attr({ opacity: 0 }).hide();
                }
            });
        }

        // attach hover event to change opacity
        this.cellDeleteButton.hover(function (e) { this.attr({ opacity: 1 }) }, function (e) { this.attr({ opacity: .5 }) });
    },

    /**
    * Creates the difficulty text element
    * @method
    */
    createDifficultyText: function () {
        this.difficultyText = this.paper.text(38, 600, 'Easy');
        this.difficultyText.node.id = 'difficultyText';
        $('#' + this.difficultyText.node.id).attr({ 'data-board': true, opacity: 0 });
    },

    /**
    * Creates the instructions text element
    * @method
    */
    createInstructionText: function () {
        this.instructionsText = this.paper.set();
        this.instructionsText.push(this.paper.text(250, 583, 'Instructions').attr({ 'font-size': '12px', 'font-weight': 'bold', 'cursor': 'default' }));

        if (this.touchEnabled) {
            this.instructionsText.push(this.paper.text(250, 596, 'You can use your mouse, keyboard or finger.').attr({ 'font-size': '12px', 'cursor': 'default' }));
        } else {
            this.instructionsText.push(this.paper.text(250, 596, 'You can use your mouse or keyboard.').attr({ 'font-size': '12px', 'cursor': 'default' }));
        }

        this.instructionsText.push(this.paper.text(250, 610, 'Clicking the red X in a cell will delete the cell.').attr({ 'font-size': '12px', 'cursor': 'default' }));
        //this.instructionsText.push(this.paper.text(this.instructionsText[2].getBBox().x + 70, 610, 'X').attr({ fill: 'red', 'font-size': '12px', 'font-weight': 'bold', 'cursor': 'default' }));
        //this.instructionsText.push(this.paper.text(this.instructionsText[3].getBBox().x + 83, 610, 'in a cell will delete the cell.').attr({ 'font-size': '12px', 'cursor': 'default' }));

        this.instructionsText.hide().attr({ opacity: 0 });
    },

    /**
    * Checkes all selector numbers to see if they've been used 9 times (should disable)
    * @method
    */
    showBoard: function () {
        this.backButton[2].attr({ x: 40, 'text': 'Menu' }); // update back button text and position for view
        this.difficultyText.attr({ 'text': sudoku.difficulty, 'fill': getDifficultyColor(sudoku.difficulty) });    // set color and text for difficulty indicator

        // show all elements
        this.gridLines.show();
        this.backButton.show();
        this.pauseButton.show();

        // if touch enabled, then skip the animation
        if (board.touchEnabled) {
            this.gridLines.attr({ opacity: .9 }).show();
            this.backButton.attr({ opacity: .7 }).show();
            this.pauseButton.attr({ opacity: .7 }).show();
            //            this.instructionsText.attr({ opacity: 1 }).show();
            $('text[data-board=true], text[data-board=true][data-selector=true], ' +
                'rect[data-board=true][data-selector=true], rect[data-board=true][data-form=true]').attr({ opacity: 1 }).show();  // show all board elements
        } else {
            this.gridLines.animate({ opacity: .9 }, 500);
            this.backButton.animate({ opacity: .7 }, 500);
            this.pauseButton.animate({ opacity: .7 }, 500);
            //            this.instructionsText.show().animate({ opacity: 1 }, 500);

            $('text[data-board=true], text[data-board=true][data-selector=true], ' +
                'rect[data-board=true][data-selector=true], rect[data-board=true][data-form=true]').animate({ opacity: 1 }, 500).show();  // show all board elements
        }

        // set the selector data element to board.notesMode flag
        $('#' + this.noteSelector[0][0].node.id).attr({ 'data-checked': this.notesMode });
        $('#' + this.noteSelector[0][1].node.id).attr({ 'data-checked': this.notesMode });

        // hide check if not in notes mode
        if (board.notesMode) {
            $('#' + this.noteSelector[0][1].node.id).attr({ opacity: 1 }).show();
        }

        this.noteSelector[0].attr({ 'cursor': 'pointer' }); // stupid hack to have box show the pointer cursor...

        // if timer is enabled
        if (this.timerEnabled) {
            this.timer.show();  // show timer

            // if touch enabled, skip the animation
            if (board.touchEnabled) {
                this.timer.attr({ opacity: 1 });
            } else {
                this.timer.animate({ opacity: 1 }, 500);
            }

        }


        $('text[data-menu=true]').hide();   // hide all menu elements
        $('rect[data-prepopulated=false]').css('cursor', 'pointer');    // change cursor for non-pre-populated cells to pointer

        board.visible = true;   // update board visibility holder
    },

    /**
    * Hides all board elements
    * @method
    */
    hideBoard: function () {
        // stop the timer
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            this.gridLines.attr({ opacity: .1 });   // set gridlines to opacity of .1

            // animate away back button, timer and selector set
            if (this.backButton != null) { this.backButton.hide().attr({ opacity: 0 }); }
            if (this.pauseButton != null) { this.pauseButton.hide().attr({ opacity: 0 }); }
            if (this.timer != null) { this.timer.hide(); }
            //            this.instructionsText.attr({ opacity: 0 }).hide();
            $('text[data-board=true], text[data-board=true][data-selector=true], ' +
                 'rect[data-board=true][data-selector=true], rect[data-board=true][data-form=true]').attr({ opacity: 0 });
        } else {
            this.gridLines.animate({ opacity: .1 }, 250);   // set gridlines to opacity of .1

            // animate away back button, timer and selector set
            if (this.backButton != null) { this.backButton.animate({ opacity: 0 }, 250, function () { this.hide() }); }
            if (this.pauseButton != null) { this.pauseButton.animate({ opacity: 0 }, 250, function () { this.hide() }); }
            if (this.timer != null) { this.timer.animate({ opacity: 0 }, 250, function () { this.hide() }); }
            //            this.instructionsText.animate({ opacity: 0 }, 250, function () { this.hide() });

            $('text[data-board=true], text[data-board=true][data-selector=true], ' +
                'rect[data-board=true][data-selector=true], rect[data-board=true][data-form=true]').animate({ opacity: 0 }, 250);
        }

        // hide check if not in notes mode
        $('#' + this.noteSelector[0][0].node.id).attr({ opacity: 0 });
        $('#' + this.noteSelector[0][1].node.id).attr({ opacity: 0 }).hide();

        // set pause button back to normal path and text
        this.pauseButton[1].attr({ path: 'M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z' }).attr({ 'stroke-width': 2 });
        this.pauseButton[2].attr({ x: 93, text: '| Pause' }); // replace text with pause

        $('rect').css('cursor', 'default'); // change cursor for all rects to default
        this.visible = false;   // update board visibility holder
    },

    /**
    * Stops timer, hides board cells and changes cursor
    * @method
    */
    pauseBoard: function () {
        this.paused = true;
        this.pauseButton.data({ 'paused': this.paused });   // save paused state
        this.timeElapsedInSec += 1; // add one second to timer
        this.stopTimer();   // stop timer
        this.resetAllCellColors();  // reset all board colors

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            this.pauseButton[1].attr({ path: 'M 111 15 l 0 20 l 10 -10 z' }).attr({ 'stroke-width': 2 });
        } else {
            this.pauseButton[1].animate({ path: 'M 111 15 l 0 20 l 10 -10 z' }, 100, '<>').attr({ 'stroke-width': 2 });
        }

        this.pauseButton[2].attr({ x: 86, text: '| Play' }); // replace text with play
        this.pauseSymbol[1].animate({ opacity: .4 }, 200);


        $('text[data-board=true]').hide();  // hide all board cell text elements and show all menu cell text elements
        $('rect[data-prepopulated=false]').css('cursor', 'default');    // change cursor for non-pre-populated cells to pointer

        this.pauseButton[2].show();
    },

    /**
    * Starts timer, shows board cells and changes cursor
    * @method
    */
    unPauseBoard: function () {
        this.paused = false;

        this.pauseButton.data({ 'paused': this.paused });   // save paused state
        this.startTimer();  // start timer

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            this.pauseButton[1].attr({ path: 'M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z' }).attr({ 'stroke-width': 2 });
        } else {
            this.pauseButton[1].animate({ path: 'M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z' }, 100, '<>').attr({ 'stroke-width': 2 });
        }

        this.pauseButton[2].attr({ x: 93, text: '| Pause' }); // replace text with pause
        this.pauseSymbol.animate({ opacity: 0 }, 200); // animate the pause button

        $('text[data-board=true]').show(); // hide all board cell text elements and show all menu cell text elements
        $('rect[data-prepopulated=false]').css('cursor', 'pointer'); // change cursor for all rects to default
    },

    /**
    * Checkes selectors and then shows them based on their enabled state
    * @method
    */
    showSelectors: function () {
        // check board
        this.checkSelectors(sudoku.playerBoard, false);

        // loop through set, animating opacity according to enabled state
        for (var i = 0; i < this.numSelectors.length; i++) {
            var selector = $('#' + this.numSelectors[i][0].node.id);
            if (selector.attr('data-enabled')) {
                // if touch enabled, skip the animation
                if (board.touchEnabled) {
                    selector.attr({ opacity: 1 });
                } else {
                    selector.animate({ opacity: 1 }, 350);
                }
            } else {
                // if touch enabled, skip the animation
                if (board.touchEnabled) {
                    selector.attr({ opacity: .4 });
                } else {
                    selector.animate({ opacity: .4 }, 350);
                }
            }
        }
    },

    /**
    * Shows the note selector text
    * @method
    */
    showNoteSelector: function () {
        if (this.noteSelector != null) {
            this.noteSelector({ opacity: 1 });
        }
    },

    /**
    * Shows the delete button ('X') on a specific cell
    * @method
    */
    showDeleteButton: function (rectNodeId) {
        var cell = $('rect[id="' + rectNodeId + '"]');

        this.cellDeleteButton.attr({ opacity: 0 }).hide();

        if ((cell.attr('data-num') != 0 || cell.attr('data-notes') != undefined) && cell.attr('data-prepopulated') == 'false') {
            var rId = getRaphaelIdFromElementId(rectNodeId);
            var rect = board.paper.getById(rId);

            this.cellDeleteButton.attr({ opacity: .5, x: rect.attr('x') + (this.sudukoRectWidth - 7), y: rect.attr('y') + 9 }).data({ 'rectId': rId }).show();
        }
    },

    /**
    * Checks if the board is filled out and if the board is correct
    * @method
    */
    checkBoard: function () {
        // check if the board is completed (no empty cells) and if it's valid
        if (sudoku.isPlayerBoardFilled()) {
            if (sudoku.checkPlayerBoard()) {
                this.stopTimer();
                if (this.pauseButton != null) { this.pauseButton.animate({ opacity: 0 }, 250, function () { this.hide(); alert('Board is correct!  Good Job!'); }); }
                return true;
            } else {
                alert('Board is incorrect. :-(');
            }
        }

        return false;
    },

    /**
    * Checkes all selector numbers to see if they've been used 9 times (should disable)
    * @method
    */
    checkSelectors: function (animate) {
        // run through selectors array to see if any number has been used 9 times or more
        // if so, disable, otherwise, enable
        for (var i = 1; i < 10; i++) {
            var count = $('rect[data-num="' + i + '"][data-selector!=true]').length;
            var opacityVal = 1;

            if (count >= 9) {
                this.disableSelector(i - 1);
                opacityVal = .4;
            } else {
                this.enableSelector(i - 1);
            }

            if (animate) {
                this.numSelectors[i - 1].animate({ opacity: opacityVal });
            }
        }
    },

    /**
    * Disables the selector number elements so it cannot be used again
    * @method
    * @param {Number} position
    */
    disableSelector: function (position) {
        var selectorNum = this.numSelectors[position];

        // set appropriate properties
        selectorNum.attr({ cursor: 'default' });
        selectorNum[0].attr({ 'data-enabled': false });
    },

    /**
    * Enables the selector number elements so they can be used
    * @method
    * @param {Number} position
    */
    enableSelector: function (position) {
        var selectorNum = this.numSelectors[position];

        // set appropriate properties
        selectorNum.attr({ cursor: 'pointer' });
        selectorNum[0].attr({ 'data-enabled': true });
    },

    /**
    * Creates the timer text reference and sets off interval to update timer
    * @method
    */
    startTimer: function (loadType) {
        // if it's a fresh load, reset timer, otherwise just update the text to the time elapsed
        switch (loadType) {
            case boardLoadType.fresh:
                board.timer.attr({ text: '00:00' });
                board.timeElapsedInSec = 0;

                break;

            case boardLoadType.load:
            case boardLoadType.resume:
            default:
                // get seconds from data and update
                var timerText = this.getTimerText(this.timeElapsedInSec);

                // update board time and text
                board.timer.attr({ text: timerText });

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

        board.timer.attr({ text: timerText });
        board.timeElapsedInSec = secondsTimer;
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
    * Counts the number of times a single number has been used on a sudoku board
    * @method
    * @param {Number} number
    * @param {Array} boardToSearch
    */
    checkNumberUsage: function (number, boardToSearch) {
        var count = 0;

        // count how many times each selector number has been used on board
        for (var r = 0; r < boardToSearch.length; r++) {
            for (var c = 0; c < boardToSearch[r].length; c++) {
                if (boardToSearch[r][c] == number) {
                    count += 1;
                }
            }
        }

        return count;
    },

    /**
    * Resets all highlighted board cells to regular css cell color class via jQuery
    * @method
    */
    resetAllCellColors: function () {
        // reset all highlighted cells to standard cell class
        this.cellDeleteButton.attr({ opacity: 0 }).hide();
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
        $('rect[id="' + rectNodeId + '"]').attr({ 'class': this.cellSelectedClass, 'data-selected': 'true' });
    },

    /**
    * Highlights all cells with a specific number on a board (swap css class)
    * @method
    * @param {Number} number
    */
    highlightSelectedAndNumberCells: function () {
        if (this.highlight) {
            var highlighted = $('rect[data-selected=true]');
            // parse number and check if it's valid
            var number = parseInt(highlighted.attr('data-num'));

            board.resetAllCellColors()

            // check if have a number to highlight
            if (number > 0) {
                // set all rect with the specific number to highlighted
                $('rect[data-num=' + number + ']').addClass(this.cellHighlightClass);
            }

            highlighted.addClass(this.cellSelectedClass);
        }
    },

    /**
    * Resets an entire class of cells to their original class
    * @method
    * @param {Text} classToReset
    */
    resetCellClass: function (selector) {
        $(selector).each(function () {
            if ($(this).attr('data-prepopulated') == 'true') {
                $(this).attr('class', board.cellPrePopulatedClass);
            } else {
                $(this).attr('class', board.cellClass);
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
        $('rect[data-selected=true]').removeAttr('data-selected');
    },

    /**
    * Adds a raphael text element to a rect
    * @method
    * @param {Raphael} rect
    * @param {Number} number
    * @param {Boolean} prePopulated
    */
    addCellNumber: function (rect, number, prePopulated, dummy) {
        var cellText, textClass, cellClass;

        // add text number to cell (different attributes if prepopulated)
        if (prePopulated) {
            cellText = this.paper.text(parseInt(rect.attr('x')) + (this.sudukoRectWidth / 2), parseInt(rect.attr('y')) + (this.sudukoRectHeight / 1.45), number)
                        .data({ 'num': number });

            cellClass = this.cellPrePopulatedClass;
            textClass = this.textPrePopulatedClass;
        } else {
            cellText = this.paper.text(parseInt(rect.attr('x')) + (this.sudukoRectWidth / 2), parseInt(rect.attr('y')) + (this.sudukoRectHeight / 1.45), number)
                        .data({ 'num': number });

            cellClass = this.cellClass;
            textClass = this.textCellClass;
        }

        cellText.node.id = rect.attr('id') + 't';   // add cell Id, which is the rect node id + t and the class
        $('#' + cellText.node.id).attr({ 'class': textClass, 'data-num': number, 'data-board': true });   // set class and data-board attributes
        rect.attr({ 'data-board': 'true', 'data-num': number, 'data-prepopulated': prePopulated }); // set rect attributes
        rect.addClass(cellClass);   // set rect class
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

            jRect.attr('data-notes', (noteNums == '' ? number : (noteNums + ',' + number)));    // add the latest number to attribute

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
            cellText = this.paper.text(rect.attr('x') + xOffset + (this.sudukoRectWidth / 5), rect.attr('y') + yOffset + (this.sudukoRectHeight / 5), number);

            // add cell Id, which is the rect node id + t
            cellText.node.id = rect.node.id + 'n' + number;

            // set position relationship for text to what rectangle it's in
            $('#' + cellText.node.id).attr({ class: this.noteClass, 'data-board': 'true', 'data-note-num': number });
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
                        '+5 sec').attr({ fill: '#AE5050', 'font-size': 15, 'font-weight': 'bold', 'font-family': 'Consolas', 'cursor': 'pointer' });

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
                    for (var i = 1; i < 9; i++) {
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
            }

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

            // update the data-notes attribute
            jRect.attr('data-notes', noteNums);
        }
    },

    /**
    * Removes data attached to a rect and removes the number from the player board
    * @method
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
                sudoku.setPlayerBoardValue(Math.floor(rect.id / 9), rect.id % 9, 0);
            }

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
            var position = getRaphaelIdFromElementId(selectedCell.attr('id')) + positionChange;

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
            var rect = this.paper.getById(getRaphaelIdFromElementId(selectedCell.attr('id')));

            if (rect != null) {
                if (!this.isPrePopulated(selectedCell)) {
                    this.removeCellText(selectedCell, !this.notesMode); // remove cell text
                    this.cellDeleteButton.attr({ opacity: 0 }).hide();  // hide the X delete button
                    this.checkSelectors(sudoku.playerBoard, true);  // check the selectors
                }
            }
        }
    },

    /**
    * Checks is a rect was pre populated or not
    * @method
    */
    isPrePopulated: function (rect) {
        var rectData = rect.data('prePopulated');

        if (rectData != undefined) {
            return rectData;
        }

        return false;
    },

    /**
    * Adds a Raphael text object to the selected cell
    * @method
    * @param {Number} number
    */
    addNumberToSelectedCell: function (number) {
        var selectedCell = $('.' + this.cellSelectedClass);
        var rect = this.paper.getById(getRaphaelIdFromElementId(selectedCell.attr('id')));

        // if we have a jquery object representing the cell, then grab info from it and add number
        if (selectedCell.length > 0 && selectedCell.data('prepopulated') == false && rect != null && rect != undefined) {
            // if notes are enabled, just add the note text
            if (board.notesMode == true) {
                this.removeCellNumber(rect);
                this.addCellNote(rect, number);
                this.showDeleteButton(rect.node.id);
            } else {

                console.log('here');
                // check the number of times number has been placed
                var numberUsage = this.checkNumberUsage(number, sudoku.playerBoard);

                if (numberUsage < 9) {
                    if (!this.isPrePopulated(selectedCell) && rect.data('num') != number) {
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

                            // attach number attribute to rect, rect el and player board
                            $('#' + rect.node.id).attr('data-num', number).removeAttr('data-notes');
                            rect.data({ 'num': number });
                            sudoku.setPlayerBoardValue(Math.floor(rect.id / 9), rect.id % 9, number);

                            // reset colors, highlight cell based on data from rect object and highlight selected cell
                            this.resetAllCellColors();
                            this.highlightNumberCells(number);
                            this.highlightSelectedCell(rect.node.id);
                            this.showDeleteButton(rect.node.id);

                            this.checkBoard();
                        } else {
                            // calculate animation boundaries
                            var origX = rect.attr('x');
                            var leftX = rect.attr('x') - 15;
                            var rightX = rect.attr('x') + 15;

                            // make cell incorrect class, then flash it from red - blue - red - blue with 3 timeouts
                            selectedCell.attr('class', this.cellIncorrectClass);
                            setTimeout(function () { selectedCell.attr('class', board.cellSelectedClass); }, 100, selectedCell);
                            setTimeout(function () { selectedCell.attr('class', board.cellIncorrectClass); }, 200, selectedCell);
                            setTimeout(function () { selectedCell.attr('class', board.cellSelectedClass); }, 300, selectedCell);

                            if (this.penalize && this.timerEnabled) {
                                this.showPenaltyText(rect);
                                this.timeElapsedInSec += 5; // penalize 5 seconds
                            }
                        }
                    }
                }
            }

            // check bottom selectors and disable if needed
            this.checkSelectors(sudoku.playerBoard, true);
        }
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
                    rect.addClass(this.cellClass).attr({ 'data-num': 0, 'data-prepopulated': 'false' });
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
                rect.addClass(this.cellClass).attr({ 'data-num': 0, 'data-prepopulated': 'false' }).removeAttr('data-notes', '');   // remove data from rect el and node of rect
            }
        }
    }
};