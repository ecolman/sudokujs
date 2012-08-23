/*global board, alert, jQuery, $, document, window, event */

/**
* Board UI controlling most aspects of what the user sees
**/

var board = {
    initialized: false,
    paper: null,
    canvasId: null,
    offset: null,
    boardSet: null,
    gridLines: null,
    numSelectors: null,
    menuCells: null,
    backButton: null,
    pauseButton: null,
    pauseSymbol: null,
    noteSelector: null,
    timer: null,
    timerInterval: null,
    timeElapsedInSec: 0,
    cellClass: 'sudokuCell',
    cellSelectedClass: 'selectedCell',
    cellHighlightClass: 'highlightCell',
    cellIncorrectClass: 'incorrectCell',
    cellPrePopulatedClass: 'prePopulatedCell',
    selectorClass: 'numSelector',
    selectorClassText: 'numSelectorText',
    menuTextClass: 'menuCellText',
    fontSize: '40px',
    notesFontSize: '15px',
    prePopulatedFontWeight: 'bold',
    cellFontWeight: 'light',
    sudukoRectWidth: 60,
    sudukoRectHeight: 50,
    selectorWidth: 45,
    selectorHeight: 45,
    boardY: 50,
    strokeWidth: 4,
    notesMode: false,
    paused: false,
    timerEnabled: true,
    highlight: false,
    feedback: false,
    penalize: false,

    /**
    * Initialize the raphael JS paper object and calls board creation methods
    * @method
    * @param {String} canvasId
    */
    initialize: function (paper) {
        // create paper and store offset
        this.paper = paper;
        this.offset = $(this.paper.canvas).offset();

        // set canvasId for object
        this.canvasId = paper.canvas.parentNode.id;

        // create sections of UI
        this.createBoard();

        this.initialized = true;
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
                    var rect = this.paper.rect(this.sudukoRectWidth * c + 3, this.sudukoRectHeight * r + this.boardY, this.sudukoRectWidth, this.sudukoRectHeight)
                                .attr({ 'stroke-width': .3, opacity: 1 });
                    rect.id = (r * 9) + c;
                    rect.node.id = 'r' + r + 'c' + c;
                    rect.node.setAttribute('class', this.cellClass);
                    rect.node.setAttribute('data-board', 'true')
                }
            }

            // creates grid lines, selectors, timer, back button and menu sudoku cell text
            this.createGridLines();
            this.createSelectors();
            this.createMenuCellText();

            // create secondary board elements 
            this.createTimer(false);
            this.createBackButton();
            this.createPauseButton();
            this.createPauseSymbol();
            this.createNoteSelector();
        }
    },

    /**
    * Creates the outline lines and the internal grid lines
    * @method
    */
    createGridLines: function () {
        this.gridLines = this.paper.set();

        // outline line
        this.gridLines.push(this.paper.path('M1,' + this.boardY + 'L' + ((this.sudukoRectWidth * 9) + 5) + ',' + this.boardY).attr({ opacity: 0, 'stroke-width': this.strokeWidth }).toFront()); // top lattitude
        this.gridLines.push(this.paper.path('M1,' + (this.sudukoRectHeight * 9 + this.boardY) + 'L' + ((this.sudukoRectWidth * 9) + 6) + ',' + (this.sudukoRectHeight * 9 + this.boardY))
                            .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }).toFront()); // bottom lattitude
        this.gridLines.push(this.paper.path('M' + ((this.sudukoRectWidth * 9) + 3) + ',' + (this.boardY - 2) + 'L' + ((this.sudukoRectWidth * 9) + 3) + ',' + (this.sudukoRectHeight * 9 + this.boardY + 2))
                            .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth })); // right lattitude
        this.gridLines.push(this.paper.path('M3,' + (this.boardY - 2) + 'L3,' + ((this.sudukoRectHeight * 9) + 1 + (this.boardY + 1))).attr({ opacity: 0, 'stroke-width': this.strokeWidth })); // left lattitude

        // interior lines
        this.gridLines.push(this.paper.path('M1,' + (this.sudukoRectHeight * 3 + this.boardY) + 'L' + ((this.sudukoRectWidth * 9) + 5) + ',' + (this.sudukoRectHeight * 3 + this.boardY))
                        .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }));
        this.gridLines.push(this.paper.path('M1,' + (this.sudukoRectHeight * 6 + this.boardY) + 'L' + ((this.sudukoRectWidth * 9) + 5) + ',' + (this.sudukoRectHeight * 6 + this.boardY))
                        .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }));
        this.gridLines.push(this.paper.path('M' + ((this.sudukoRectWidth * 3) + 3) + ',' + (this.boardY - 2) + 'L' + ((this.sudukoRectWidth * 3) + 3) + ',' + (this.sudukoRectHeight * 9 + this.boardY + 2))
                        .attr({ opacity: 0.1, 'stroke-width': this.strokeWidth }));
        this.gridLines.push(this.paper.path('M' + ((this.sudukoRectWidth * 6) + 3) + ',' + (this.boardY - 2) + 'L' + ((this.sudukoRectWidth * 6) + 3) + ',' + (this.sudukoRectHeight * 9 + this.boardY + 2))
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
                var rect = this.paper.rect((i * this.sudukoRectWidth) + 10, ((this.sudukoRectHeight * 9) + (this.selectorHeight / 2.5) + this.boardY), this.selectorWidth, this.selectorHeight)
                            .attr({ opacity: 0 }).data({ 'num': i + 1, 'enabled': true });
                rect.node.setAttribute('class', this.selectorClass);

                var text = this.paper.text(((i * this.sudukoRectWidth) + (this.sudukoRectWidth / 2)) + 3,
                            ((this.sudukoRectHeight * 9) + (this.sudukoRectHeight / 2) + (this.selectorHeight / 2) + this.boardY - 6), i + 1)
                            .attr({ opacity: 0, 'font-size': this.fontSize }).data({ 'num': i + 1 });
                text.node.setAttribute('class', this.selectorClassText);

                // push to the sets
                this.numSelectors.push(this.paper.set().push(rect, text).attr({ cursor: 'move' }));
            }

            // attach mouse events to selectors
            this.attachMouseEventsToSelectors();

            this.numSelectors.hide();
        }
    },

    /**
    * Creates all text elements for the menu board
    * @method
    */
    createMenuCellText: function () {
        if (this.paper !== null) {
            this.menuCells = this.paper.set();

            // create selector sets
            for (var i = 0; i < sudoku.menuCellsToShow.length; i++) {
                var rect = this.paper.getById(sudoku.menuCellsToShow[i]);

                if (rect != null && rect != undefined) {
                    var cellText = this.paper.text(rect.attr('x') + (this.sudukoRectWidth / 2), rect.attr('y') + (this.sudukoRectHeight / 2),
                                sudoku.menuCellsValues[i]).attr({ 'font-size': this.fontSize }).data({ 'menuCell': true });

                    // add cell Id, give the node a class and a data-menu attribute
                    cellText.node.id = 'menuCell' + i;
                    cellText.node.setAttribute('class', this.menuTextClass);
                    cellText.node.setAttribute('data-menu', 'true');
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
            this.timer = this.paper.text(480, this.boardY / 1.75, '00:00').attr({ 'opacity': 0, 'font-size': '30px' }).data({ 'time': '0' });
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

        var text = this.paper.text(39, this.boardY / 2, 'Menu ');
        text.id = 5003;
        text.node.id = 'backButtonText';

        // add elements to set
        this.backButton.push(clickRegion, button, text);

        // hide se tand set cursor attribute
        this.backButton.hide();
        this.backButton.attr({ opacity: 0, 'cursor': 'pointer' });

        // attach mousedown handler
        this.backButton.mousedown(function () {
            // check if game was paused, and subtract one second if going to menu from pause
            if (board.paused) {
                board.timeElapsedInSec -= 1;
                board.unPauseBoard();
            }

            menu.homeView(sudoku.isGameInProgress());
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
        $('#' + clickRegion.node.id).attr('class', 'clickableRegion');

        var button = this.paper.path("M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z").attr({ opacity: .7, fill: '#000', stroke: '#000', 'stroke-width': 2 });
        button.id = 5005;

        var text = this.paper.text(93, this.boardY / 2, '| Pause').attr({ 'font-size': '17px' });
        text.id = 5006;
        text.node.id = 'pauseButtonText';

        // add elements to set
        this.pauseButton.push(clickRegion, button, text);

        // hide set and set cursor attribute
        this.pauseButton.hide();
        this.pauseButton.attr({ opacity: 0, 'cursor': 'pointer' });

        // give it data to denote if it's paused
        this.pauseButton.data({ 'paused': this.paused });

        // attach button handler
        this.pauseButton.mousedown(function () {
            // get paused state
            var paused = this.data('paused');

            if (paused) {
                board.unPauseBoard();
            } else {
                board.pauseBoard();
            }
        });
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

        // add elements to set
        this.pauseSymbol.push(clickRegion, symbol);

        // hide set and set cursor attribute
        this.pauseSymbol.hide();
        this.pauseSymbol.attr({ opacity: 0, 'cursor': 'pointer' });

        // attach button handler
        this.pauseSymbol.mousedown(function () {
            board.unPauseBoard();
        });
    },

    /**
    * Creates the pause symbol element and attaches mousedown event to transition from pause to board
    * @method
    */
    createNoteSelector: function () {
        if (this.paper !== null) {
            this.noteSelector = this.paper.text((this.paper.width / 2), this.paper.height - 10, 'Enable Notes Mode').attr({ 'fill': 'blue', opacity: 0,
                'font-size': '12px', 'font-weight': 'bold', 'cursor': 'pointer'
            }).data({ 'notes': false });

            this.noteSelector.click(function () {
                if (this.data('notes') == false) {
                    this.attr({ 'text': 'Disable Notes Mode' }).data({ 'notes': true });
                    board.notesMode = true;
                } else {
                    this.attr({ 'text': 'Enable Notes Mode' }).data({ 'notes': false });
                    board.notesMode = false;
                }
            });
        }
    },

    /**
    * Checkes all selector numbers to see if they've been used 9 times (should disable)
    * @method
    */
    showBoard: function () {
        // update back button text and position for view
        this.backButton[2].attr({ x: 40, 'text': 'Menu' });

        this.gridLines.animate({ opacity: .9 }, 500);

        this.backButton.show();
        this.backButton.animate({ opacity: .7 }, 500);

        this.pauseButton.show();
        this.pauseButton.animate({ opacity: .7 }, 500);

        this.noteSelector.show();
        this.noteSelector.animate({ opacity: .7 }, 500);

        // if timer is enabled
        if (this.timerEnabled) {
            this.timer.show();
            this.timer.animate({ opacity: 1 }, 500);
        }

        this.showSelectors();

        // show all text elements that are for the board and hide all menu elements
        $('text[data-board=true]').show();
        $('text[data-menu=true]').hide();

        // change cursor for non-pre-populated cells to pointer
        $('rect[data-prepopulated=false]').css('cursor', 'pointer');
    },

    /**
    * Hides all board elements
    * @method
    */
    hideBoard: function () {
        // stop the timer
        clearInterval(this.timerInterval);
        this.timerInterval = null;

        // set gridlines to opacity of .1
        this.gridLines.animate({ opacity: .1 }, 250);

        // animate away back button, timer and selector set
        if (this.backButton != null) { this.backButton.animate({ opacity: 0 }, 250, function () { this.hide() }); }
        if (this.pauseButton != null) { this.pauseButton.animate({ opacity: 0 }, 250, function () { this.hide() }); }
        if (this.timer != null) { this.timer.animate({ opacity: 0 }, 250, function () { this.hide() }); }
        if (this.noteSelector != null) { this.noteSelector.animate({ opacity: 0 }, 250, function () { this.hide() }); }

        this.numSelectors.animate({ opacity: 0 }, 250, function () { this.hide() });

        // hide all board cell text elements and show all menu cell text elements
        $('text[data-board=true]').hide();
        $('text[data-menu=true]').show();

        // change cursor for all rects to default
        $('rect').css('cursor', 'default');
    },

    /**
    * Stops timer, hides board cells and changes cursor
    * @method
    */
    pauseBoard: function () {
        this.paused = true;

        // save paused state
        this.pauseButton.data({ 'paused': this.paused });

        this.timeElapsedInSec += 1;

        this.stopTimer();

        this.removeMouseEventsToSelectors();

        this.resetAllCellColors();

        this.pauseButton[1].animate({ path: "M 111 15 l 0 20 l 10 -10 z" }, 100, '<>').attr({ 'stroke-width': 2 });
        this.pauseButton[2].attr({ x: 86, 'text': '| Play' });

        this.pauseSymbol.show();
        this.pauseSymbol[1].animate({ opacity: .4 }, 200);

        // hide all board cell text elements and show all menu cell text elements
        $('text[data-board=true]').hide();

        // change cursor for non-pre-populated cells to pointer
        $('rect[data-prepopulated=false]').css('cursor', 'default');
    },

    /**
    * Starts timer, shows board cells and changes cursor
    * @method
    */
    unPauseBoard: function () {
        this.paused = false;

        // save paused state
        this.pauseButton.data({ 'paused': this.paused });

        this.startTimer();

        this.attachMouseEventsToSelectors();

        // animate the pause button and replace text
        this.pauseButton[1].animate({ path: "M 127 15 l 0 21 l 5 0 l 0 -21 l -6.1 0 M 138 15 l 0 21 l 5 0 l 0 -21 z" }, 100, '<>').attr({ 'stroke-width': 2 });
        this.pauseButton[2].attr({ x: 93, 'text': '| Pause' });

        this.pauseSymbol.animate({ opacity: 0 }, 200, function () { this.hide(); });

        // hide all board cell text elements and show all menu cell text elements
        $('text[data-board=true]').show();

        // change cursor for all rects to default
        $('rect[data-prepopulated=false]').css('cursor', 'pointer');
    },

    /**
    * Checkes selectors and then shows them based on their enabled state
    * @method
    */
    showSelectors: function () {
        // check board
        this.checkSelectors(sudoku.playerBoard, false);

        // make sure set it showing
        this.numSelectors.show();

        // loop through set, animating opacity according to enabled state
        for (var i = 0; i < this.numSelectors.length; i++) {
            if (this.numSelectors[i][0].data('enabled')) {
                this.numSelectors[i].animate({ opacity: 1 }, 350, function () { });
            } else {
                this.numSelectors[i].animate({ opacity: .4 }, 350, function () { });
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
            var count = $('rect[data-num="' + i + '"]').length;
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

        // unhook from mouse / touch events and move back to beginning position
        this.paper.freeTransform(selectorNum).unplug();
        selectorNum.transform('T0,0');

        // set appropriate properties
        selectorNum.attr({ cursor: 'default' });
        selectorNum[0].data({ 'enabled': false });
    },

    /**
    * Enables the selector number elements so they can be used
    * @method
    * @param {Number} position
    */
    enableSelector: function (position) {
        var selectorNum = this.numSelectors[position];

        // set appropriate properties        
        this.attachMouseEventsToSelector(position);
        selectorNum.attr({ cursor: 'move' });
        selectorNum[0].data({ 'enabled': true });
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
    * Parse an element Id to a Raphael object Id (get row and column combination)
    * @method
    * @param {String} elementId
    */
    getRaphaelIdFromElementId: function (elementId) {
        // element Id follows rXcX, parse out row and column via substring
        var row = parseInt(elementId.substring(1, 2));
        var col = parseInt(elementId.substring(3, 4));

        // calculate Raphael id by multiplying row * 9 and adding column position
        return ((row * 9) + col);
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
    * Resets all highlighted board cells to regular css cell color class via jQuery
    * @method
    */
    resetAllCellColors: function () {
        // reset all highlighted cells to standard cell class
        this.resetCellClass(this.cellHighlightClass);
        this.resetCellClass(this.cellSelectedClass);
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
                $('#' + this.canvasId).find('rect[data-num=' + number + ']').attr('class', this.cellHighlightClass);
            }
        }
    },

    /**
    * Highlights a cell by changing its class and also adding number data if supplied
    * @method
    * @param {Text} rectNodeId
    * @param {Text} number
    */
    highlightSelectedCell: function (rectNodeId, number) {
        if (!isNaN(number) && number != null && number != undefined) {
            $('#' + this.canvasId).find('rect[id="' + rectNodeId + '"]').attr('class', this.cellSelectedClass).attr('data-num', number);
        } else {
            $('#' + this.canvasId).find('rect[id="' + rectNodeId + '"]').attr('class', this.cellSelectedClass);
        }
    },

    /**
    * Resets an entire class of cells to their original class
    * @method
    * @param {Text} classToReset
    */
    resetCellClass: function (classToReset) {
        $('.' + classToReset).each(function () {
            if ($(this).attr('data-prepopulated') == 'true') {
                $(this).attr('class', board.cellPrePopulatedClass);
            } else {
                $(this).attr('class', board.cellClass);
            }
        });
    },

    /**
    * Adds a raphael text element to a rect
    * @method
    * @param {Raphael} rect
    * @param {Number} number
    * @param {Boolean} prePopulated
    */
    addCellNumber: function (rect, number, prePopulated) {
        var cellText = null;

        // add text number to cell (different attributes if prepopulated)
        if (prePopulated) {
            cellText = this.paper.text(rect.attr('x') + (this.sudukoRectWidth / 2), rect.attr('y') + (this.sudukoRectHeight / 2),
                        number).attr({ 'font-size': this.fontSize, 'font-weight': this.cellFontWeight, 'font-weight': this.prePopulatedFontWeight, 'cursor': 'default' }).data({ 'num': number });
        } else {
            cellText = this.paper.text(rect.attr('x') + (this.sudukoRectWidth / 2), rect.attr('y') + (this.sudukoRectHeight / 2),
                        number).attr({ 'font-size': this.fontSize, 'font-weight': this.cellFontWeight, 'font-family': 'Consolas', 'cursor': 'pointer' }).data({ 'num': number });
        }

        // add cell Id, which is the rect node id + t
        cellText.node.id = rect.node.id + 't';

        // set position relationship for text to what rectangle it's in, data-board, data-num and if it's pre-populated
        $('#' + cellText.node.id).attr('data-position', rect.id).attr('data-board', 'true').attr('data-num', number).attr('data-prepopulated', prePopulated);
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

            // add notes number to rect
            var noteNums = '';

            // create array string to add to data-notes attribute
            for (var i = 0; i < currentNotes.length; i++) {
                if (i > 0) {
                    noteNums += ',';
                }

                noteNums += currentNotes[i];
            }

            // add the latest number to attribute
            jRect.attr('data-notes', (noteNums == '' ? number : (noteNums + ',' + number)));

            // calculate offset position based on what number was passed in
            if (number > 1 && number < 4) {
                xOffset = (number - 1) * 15;
            } else if (number >= 4 && number < 7) {
                xOffset = (number - 4) * 15;
                yOffset += 15;
            } else if (number >= 7) {
                xOffset = (number - 7) * 15;
                yOffset += 30;
            }

            // if it's a multiple of 3 + 1, reset the offset to account for newline
            if (number % 3 == 1) { xOffset = 0 }

            // add text number to cell (different attributes if prepopulated)
            cellText = this.paper.text(rect.attr('x') + xOffset + (this.sudukoRectWidth / 5), rect.attr('y') + yOffset + (this.sudukoRectHeight / 5),
                    number).attr({ 'font-size': this.notesFontSize, 'font-weight': 'bold', 'font-family': 'Consolas', 'cursor': 'pointer' }).data({ 'notenum': number });

            // add cell Id, which is the rect node id + t
            cellText.node.id = rect.node.id + 'n' + number;

            // set position relationship for text to what rectangle it's in
            $('#' + cellText.node.id).attr('data-position', rect.id).attr('data-board', 'true').attr('data-notenum', number);
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
    removeCellText: function (rect) {
        if (rect != null && rect != undefined) {
            // purge rect data
            this.removeCellData(rect, true);

            var textEl = $('text[data-position="' + rect.id + '"]');

            // if the text element exists for the rect, then remove it
            if (textEl.length > 0) {
                var numText = parseFloat(textEl.text());

                if (!isNaN(numText) && numText > -1) {
                    textEl.remove();
                }
            }

            // remove any notes on cells
            var jRect = $('#' + rect.node.id);
            var currentNotes = [];

            // fill up array of current notes
            if (jRect.attr('data-notes') != undefined) {
                currentNotes = jRect.attr('data-notes').split(',');
            }

            // remove all notes
            for (var i = 0; i < currentNotes.length; i++) {
                var notesEl = $('text[data-position="' + rect.id + '"][data-notesnum="' + currentNotes[i] + '"]');
                notesEl.remove();
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
            this.removeCellData(rect, false);

            var textEl = $('text[data-position="' + rect.id + '"]:not([data-notenum])');

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
    removeCellData: function (rect, removeNotes) {
        if (rect != null) {
            // remove data from raphael object, html element and sudoku player board
            rect.data({ 'num': 0 });

            sudoku.setPlayerBoardValue(Math.floor(rect.id / 9), rect.id % 9, 0);

            if (removeNotes) {
                $('#' + this.canvasId).find('rect[id="' + rect.node.id + '"]').removeAttr('data-num');
            }
        }
    },

    /**
    * Calculate direction of selected cell change and then changes css classes via jQuery
    * @method
    * @param {String} direction
    */
    moveSelectedCell: function (direction) {
        var selectedCell = $('#' + this.canvasId).find('.' + this.cellSelectedClass);
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
            var position = this.getRaphaelIdFromElementId(selectedCell.attr('id')) + positionChange;

            // if we have a valid cell (id between 0 - 80), then highlight new cell
            if (position >= 0 && position < 81) {
                var rect = this.paper.getById(position);

                // reset colors, highlight cell based on data from rect object and highlight selected cell
                this.resetAllCellColors();
                this.highlightNumberCells(rect.data('num'));
                this.highlightSelectedCell(rect.node.id, rect.data('num'));
            }
        }
    },

    /**
    * Finds selected cell and then removes text inside cell
    * @method
    */
    deleteSelectedCell: function (number) {
        // find selected cell and pre populated via jQuery
        var selectedCell = $('#' + this.canvasId).find('.' + this.cellSelectedClass);

        if (selectedCell.length > 0) {
            // from element id, get raphael object Id
            var rect = this.paper.getById(this.getRaphaelIdFromElementId(selectedCell.attr('id')));

            if (rect != null) {
                if (!this.isPrePopulated(rect)) {
                    if (this.notesMode) {
                        this.removeCellNote(rect, number);
                    } else {
                        this.removeCellText(rect);
                        selectedCell.removeAttr('data-num');

                        this.checkSelectors(sudoku.playerBoard, true);
                    }
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
        var selectedCell = $('#' + this.canvasId).find('.' + this.cellSelectedClass);
        var rect = this.paper.getById(this.getRaphaelIdFromElementId(selectedCell.attr('id')));

        // if we have a jquery object representing the cell, then grab info from it and add number
        if (selectedCell.length > 0 && rect != null && rect != undefined) {
            // if notes are enabled, just add the note text
            if (board.notesMode) {
                this.removeCellNumber(rect);
                this.addCellNote(rect, number);
            } else {
                // check the number of times number has been placed
                var numberUsage = this.checkNumberUsage(number, sudoku.playerBoard);

                if (numberUsage < 9) {
                    if (!this.isPrePopulated(rect) && rect.data('num') != number) {
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
                            // remove text from cell
                            this.removeCellText(rect);

                            this.addCellNumber(rect, number, false);

                            // check bottom selectors and disable if needed
                            this.checkSelectors(sudoku.playerBoard, true);

                            // attach number attribute to rect, rect el and player board
                            $('#' + rect.node.id).attr('data-num', number).removeAttr('data-notes');
                            rect.data({ 'num': number });
                            sudoku.setPlayerBoardValue(Math.floor(rect.id / 9), rect.id % 9, number);

                            // reset colors, highlight cell based on data from rect object and highlight selected cell
                            this.resetAllCellColors();
                            this.highlightNumberCells(number);
                            this.highlightSelectedCell(rect.node.id, number);

                            // check bottom selectors and disable if needed
                            this.checkSelectors(sudoku.playerBoard, true);

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

                            if (this.penalize) {
                                this.showPenaltyText(rect);
                                // penalize 5 seconds
                                this.timeElapsedInSec += 5;
                            }
                        }
                    }
                }
            }
        }
    },

    /**
    * Attaches freeTransformation to all selectors
    * @method
    */
    attachMouseEventsToSelectors: function () {
        for (var i = 0; i < this.numSelectors.length; i++) {
            this.attachMouseEventsToSelector(i);
        }
    },

    /**
    * Attaches freeTransformation to all selectors
    * @method
    */
    removeMouseEventsToSelectors: function () {
        for (var i = 0; i < this.numSelectors.length; i++) {
            this.paper.freeTransform(this.numSelectors[i]).unplug();
        }
    },

    /**
    * Attaches freeTransformation to one selector
    * @method
    * @param {Number} position
    */
    attachMouseEventsToSelector: function (position) {
        if (position != null && position != undefined || !isNaN(position)) {
            // Add freeTransform with options and callback
            var selectorFt = this.paper.freeTransform(this.numSelectors[position], { drag: 'self', snap: false, rotate: false, scale: false },
                function (ft, events) {
                    // brings all elements in set to front on init or drag start
                    if (events == "init" || events == "drag start") {
                        for (var i = 0; i < ft.items.length; i++) {
                            ft.items[i].el.toFront();
                        }
                    }

                    // drag end event
                    if (events == "drag end") {
                        // check if the drag start event happened within 250 millioseconds, if so, then just add number to cell
                        if (this.lastDragStartEvent != null && (new Date().getTime() - this.lastDragStartEvent.dateTime < 250)) {
                            for (var i = 0; i < ft.items.length; i++) {
                                if (ft.items[i].el.type == 'rect') {
                                    // add number to cell
                                    board.addNumberToSelectedCell(ft.items[i].el.data('num'));
                                    break;
                                }
                            }
                        } else {
                            // otherwise, this was a drag event and check where it's being dragged to
                            // also get selector rect to know which number was picked up
                            var selectorRect = ft.items[0].el;

                            var posx = ft.attrs.x + ft.attrs.translate.x + (board.selectorHeight / 2);
                            var posy = ft.attrs.y + ft.attrs.translate.y + (board.selectorWidth / 2);

                            // tell ft plugin to bring set back to starting place
                            ft.attrs.translate = { x: 0, y: 0 };
                            ft.apply();

                            var rectEls = board.paper.getElementsByPoint(posx, posy);

                            if (rectEls != null && rectEls.length > 0) {
                                for (var i = 0; i < rectEls.length; i++) {
                                    if (rectEls[i].type == 'rect') {

                                        if (rectEls[i].id < 81 && !board.isPrePopulated(rectEls[i])) {
                                            // reset all cells, set selected cell class then add number
                                            board.resetAllCellColors();
                                            board.highlightSelectedCell(rectEls[i].node.id);
                                            board.addNumberToSelectedCell(selectorRect.data('num'));
                                        }

                                        break;
                                    }
                                }
                            }
                        }
                    }

                    if (events == "drag start") {
                        this.lastDragStartEvent = events;
                        this.lastDragStartEvent.dateTime = new Date().getTime();
                    }
                }
            );
        }
    },

    /**
    * Populates board with numbers from array.  Sets all cells to prePopulated and bold font-weight
    * @method
    * @param {Array} numberArray
    */
    populate: function (numberArray) {
        // loop through array
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                position = (i * 9) + j;

                // get rectangle by raphael id
                var rect = this.paper.getById(position);

                if (rect != null) {
                    // make sure it's not empty (0) and under 10
                    if (numberArray[i][j] > 0 && numberArray[i][j] < 10) {
                        // add data of what number it contains to element
                        rect.data({ 'num': numberArray[i][j], 'prePopulated': true });
                        rect.attr({ 'cursor': 'default' });

                        // set pre populated class, data-num and data-prepopulated attributes on rect.node
                        $('#' + rect.node.id).attr('class', this.cellPrePopulatedClass).attr('data-num', numberArray[i][j])
                            .attr('data-prepopulated', 'true').removeAttr('data-notes');

                        // add the cell text to the rect
                        this.addCellNumber(rect, numberArray[i][j], true);

                    } else if (numberArray[i][j] == 0) {
                        // add data of what number it contains to element
                        rect.data({ 'num': 0, 'prePopulated': false });

                        // set pre populated class, data-num and data-prepopulated attributes on rect.node
                        $('#' + rect.node.id).attr('class', this.cellClass).attr('data-num', 0).attr('data-prepopulated', 'false').removeAttr('data-notes');
                    }
                }
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
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                position = (i * 9) + j;

                // get rectangle by raphael id
                var rect = this.paper.getById(position);

                if (rect != null) {
                    // make sure it's not empty (0) and under 10
                    if (!this.isPrePopulated(rect)) {
                        if (numberArray[i][j] > 0 && numberArray[i][j] < 10) {

                            // add data of what number it contains to element
                            $('#' + rect.node.id).attr('data-num', numberArray[i][j]).attr('data-prepopulated', false).attr('cursor', 'pointer');
                            rect.data({ 'num': numberArray[i][j], 'prePopulated': false });

                            // add the cell text to the rect
                            this.addCellNumber(rect, numberArray[i][j], false);
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
        }
    },

    /**
    * Loops through rect objects, resetting data and clearing number values
    * @method
    */
    clearBoard: function () {
        // loop through array
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var position = (i * 9) + j;

                // get rectangle by raphael id
                var rect = this.paper.getById(position);

                if (rect != null) {
                    // remove cell text
                    this.removeCellText(rect);

                    // remove data from rect el and node of rect
                    rect.data({ 'num': 0, 'prePopulated': false });
                    $('#' + rect.node.id).attr('class', this.cellClass).attr('data-num', 0).attr('data-prepopulated', 'false').removeAttr('data-notes', '');
                }
            }
        }
    }
};