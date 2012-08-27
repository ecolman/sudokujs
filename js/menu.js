/**
* Menu system for game
**/

var menu = new Object();

var menu = {
    initialized: false,
    canvasId: null,
    paper: null,
    bgOverlayrect: null,
    title: null,
    homeSet: null,
    optionsSet: null,
    checkSet: null,
    menuClass: 'menuItem',
    optionClass: 'optionItem',
    subOptionClass: 'subOptionItem',
    difficulty: menuOptionType.easy,
    view: gameView.menu,

    /**
    * Initialized the arrays with all 0's
    * @method
    * @param {Number} amount
    */
    initialize: function (paper) {
        this.paper = paper;

        // prevent default of touchmove event so that raphael freetransform plugin works for touch events
        document.getElementById('grid').ontouchmove = function (event) {
            event.preventDefault();
        };

        this.loadOptions();
        this.createHomeMenu();
        this.createOptionsMenu();

        menu.homeView(false);

        this.initialized = true;
    },

    /**
    * Creates all the text elements for the home menu and adds them to a set
    * @method
    */
    createHomeMenu: function () {
        // create homeset
        this.homeSet = this.paper.set();

        // create rectangle around menu
        this.bgOverlayrect = this.paper.rect(3, 50, 540, 450).attr({ fill: '#E0F8E0', opacity: .5, 'stroke-width': 0 });
        this.bgOverlayrect.id = 999;
        this.bgOverlayrect.node.setAttribute('id', 'bgrect');

        // create title for menu
        this.title = this.paper.text(275, 35, 'Sudoku JS');
        this.title.id = 1000;
        this.title.node.setAttribute('id', 'title');

        // create options, set their id's and their data
        var easyOption = this.paper.text(275, 125, 'Easy').attr({ fill: 'green', 'letter-spacing': 15 });
        easyOption.id = 1001;
        easyOption.node.setAttribute('class', this.menuClass);
        easyOption.data({ 'type': menuOptionType.easy });

        var mediumOption = this.paper.text(275, 175, 'Medium').attr({ fill: 'brown', 'letter-spacing': 13 });
        mediumOption.id = 1003;
        mediumOption.node.setAttribute('class', this.menuClass);
        mediumOption.data({ 'type': menuOptionType.medium });

        var hardOption = this.paper.text(275, 225, 'Hard').attr({ fill: 'blue', 'letter-spacing': 15 })
        hardOption.id = 1004;
        hardOption.node.setAttribute('class', this.menuClass);
        hardOption.data({ 'type': menuOptionType.hard });

        var loadOption = this.paper.text(275, 375, 'Load Last Game').attr({ fill: '#562E60', 'letter-spacing': 2 })
        loadOption.id = 1006;
        loadOption.node.setAttribute('class', this.menuClass);
        loadOption.data({ 'type': menuOptionType.loadGame });

        var resumeOption = this.paper.text(275, 275, 'Resume Game').attr({ fill: '#562E60', 'letter-spacing': 5 })
        resumeOption.id = 1007;
        resumeOption.data({ 'type': menuOptionType.resumeGame });
        resumeOption.node.setAttribute('class', this.menuClass);
        resumeOption.hide();

        var optionsMenuOption = this.paper.text(275, 425, 'Options').attr({ fill: '#562E60', 'letter-spacing': 7 })
        optionsMenuOption.id = 1008;
        optionsMenuOption.node.setAttribute('class', this.menuClass);
        optionsMenuOption.data({ 'type': menuOptionType.optionsMenu });

        // add all options to homeSet, mainy to make mousedown handlers and animations easier
        this.homeSet.push(easyOption).push(mediumOption).push(hardOption).push(loadOption).push(resumeOption).push(optionsMenuOption).attr({ opacity: 1 });

        // set mousedown handler for all homeSet elements
        this.homeSet.mousedown(function (event) {
            switch (this.data('type')) {
                case menuOptionType.easy:
                    menu.difficulty = menuOptionType.easy;
                    menu.boardView(boardLoadType.fresh);
                    break;

                case menuOptionType.medium:
                    menu.difficulty = menuOptionType.medium;
                    menu.boardView(boardLoadType.fresh);
                    break;

                case menuOptionType.hard:
                    menu.difficulty = menuOptionType.hard;
                    menu.boardView(boardLoadType.fresh);
                    break;

                case menuOptionType.expert:
                    menu.difficulty = menuOptionType.expert;
                    menu.boardView(boardLoadType.fresh);
                    break;

                case menuOptionType.loadGame:
                    menu.boardView(boardLoadType.load);
                    break;

                case menuOptionType.resumeGame:
                    menu.boardView(boardLoadType.resume);
                    break;

                case menuOptionType.optionsMenu:
                    menu.optionsView();
                    break;

                default:

                    break;
            }
        });
    },


    /**
    * Creates all the text elements for the home menu and adds them to a set
    * @method
    */
    createOptionsMenu: function () {
        // create homeset
        this.optionsSet = this.paper.set();
        this.optionsCheckSet = this.paper.set();

        // create options, set their id's and their data
        var timerOptionText = this.paper.text(263, 185, 'Enable Timer');
        timerOptionText.id = 1101;
        timerOptionText.node.setAttribute('class', this.optionClass);

        var highlightOptionText = this.paper.text(223, 235, 'Number highlighting');
        highlightOptionText.id = 1102;
        highlightOptionText.node.setAttribute('class', this.optionClass);

        var feedbackOptionText = this.paper.text(242, 285, 'Instant Feedback');
        feedbackOptionText.id = 1103;
        feedbackOptionText.node.setAttribute('class', this.optionClass);

        var penalizeOptionText = this.paper.text(200, 335, 'Penalty for wrong number');
        penalizeOptionText.id = 1104;
        penalizeOptionText.node.setAttribute('class', this.optionClass);

        var penalizeOptionSubText = this.paper.text(200, 360, '(when instant feedback enabled)').attr({ 'font-size': 15 + 'px !important' });
        penalizeOptionSubText.id = 1105;
        penalizeOptionSubText.node.setAttribute('class', this.subOptionClass);

        // create options checkboxes and also attach mousedown handlers
        var timerOptionCheck = this.createCheckSet(350, 170, board.timerEnabled, optionType.timer);
        var highlightOptionCheck = this.createCheckSet(350, 220, board.highlight, optionType.highlight);
        var feedbackOptionCheck = this.createCheckSet(350, 270, board.feedback, optionType.feedback);
        var penalizeOptionCheck = this.createCheckSet(350, 320, board.penalize, optionType.penalize);

        // add all options to optionsSet and add all checkboxes to optionsCheckSet
        this.optionsSet.push(timerOptionText).push(highlightOptionText).push(feedbackOptionText).push(penalizeOptionText).push(penalizeOptionSubText);
        this.optionsCheckSet.push(timerOptionCheck).push(highlightOptionCheck).push(feedbackOptionCheck).push(penalizeOptionCheck);

        // hide both of the sets
        this.optionsSet.hide().attr({ opacity: 0 });
        this.optionsCheckSet.hide().attr({ opacity: 0 })
    },

    /**
    * Creates a box and checkmark for the options on/off.  Creates it where provided (x/y position), sets the checked state and the type
    * @method
    * @param {Number} xPos
    * @param {Number} yPos
    * @param {Boolean} checked
    * @param {optionType} type
    */
    createCheckSet: function (xPos, yPos, checked, type, sizeModifier, clickEvent) {
        var checkSet = board.paper.set();
        var sizeModifier;

        // create box and tick based on x/y position
        var box = board.paper.rect(xPos, yPos, 28, 28, 5).attr({ 'fill': '#fff', 'stroke': '#000', 'stroke-width': '2' }).data({ 'checked': checked, 'type': type });
        var tick = board.paper.path('M 197.67968,534.31563 C 197.40468,534.31208 196.21788,532.53719 195.04234,530.37143 L 192.905,526.43368 L 193.45901,525.87968 C 193.76371,525.57497 ' +
                                    '194.58269,525.32567 195.27896,525.32567 L 196.5449,525.32567 L 197.18129,527.33076 L 197.81768,529.33584 L 202.88215,523.79451 C 205.66761,520.74678 ' +
                                    '208.88522,517.75085 210.03239,517.13691 L 212.11815,516.02064 L 207.90871,520.80282 C 205.59351,523.43302 202.45735,527.55085 200.93947,529.95355 C ' +
                                    '199.42159,532.35625 197.95468,534.31919 197.67968,534.31563 z').attr({ 'fill': '#000' }).data({ 'checked': checked, 'type': type });

        if (sizeModifier != null && sizeModifier > 0) {
            box.transform('s' + sizeModifier);
            tick.transform('t' + (xPos - 182) + ', ' + (-345 + (yPos - 170)) + ', s' + (1.5 * sizeModifier));
        } else {
            tick.transform('t' + (xPos - 182) + ', ' + (-345 + (yPos - 170)) + ', s' + 1.5);
        }

        // push it to the set
        checkSet.push(box, tick);

        // hide set and set attributes/data
        checkSet.hide();
        checkSet.attr({ opacity: 0, 'cursor': 'pointer' });
        $(box.node).data({ 'checked': checked, 'type': type });
        $(tick.node).data({ 'checked': checked, 'type': type })

        if (!checked) {
            tick.hide();
            tick.attr({ opacity: 1 });
        }

        // check type of obj passed in, then add either touch or click event to checkSet
        if (typeof (clickEvent) == 'function' || typeof (clickEvent) == 'undefined') {
            if (board.touchEnabled) {
                checkSet.touchstart(function (e) { menu.checkboxHit(e); if (typeof (clickEvent) == 'function') { clickEvent(e); } });
            } else {
                checkSet.click(function (e) { menu.checkboxHit(e); if (typeof (clickEvent) == 'function') { clickEvent(e); } });
            }
        }

        return checkSet;
    },

    /**
    * MouseDown handler for the checkbox, handles switching option on/off
    * @method
    * @param {Event} event
    */
    checkboxHit: function (event) {
        // create holder vars and get the opposite of the current checked state to get the new checked state
        var check = null;
        var box = null;
        var target = $(event.currentTarget);

        // change over to text's stored raphael object Id
        if (target[0].nodeName == 'text') {
            target = $('#' + board.paper.getById($(event.currentTarget).data('checkRId')).node.id);
        }

        // depending on the type, set the check and box objects
        switch (target[0].nodeName) {

            case 'path':
                check = target;
                box = target.prev();

                break;

            case 'rect':
                box = target;
                check = target.next();

                break;
        }

        var checkState = !target.data('checked');

        // set the checked state data
        check.data('checked', checkState);
        box.data('checked', checkState);

        // if it's true checkState, show check, otherwise hide check
        if (checkState) {
            check.show();
            check.css({ opacity: 1 });
        } else {
            check.css({ opacity: 0 });
            check.hide();
        }
    },

    /**
    * Switches options for board and then saves the options to local storage
    * @method
    */
    saveOptions: function () {
        // loop through optionsCheckSet and set options based on the type of the check
        for (var i = 0; i < this.optionsCheckSet.length; i++) {
            var option = this.optionsCheckSet[i][0];
            var checked = option.data('checked');

            switch (option.data('type')) {
                case optionType.timer:
                    board.timerEnabled = checked;
                    break;

                case optionType.highlight:
                    board.highlight = checked;
                    break;

                case optionType.feedback:
                    board.feedback = checked;

                    break;

                case optionType.penalize:
                    board.penalize = checked;

                    break;
            }
        }

        // create array and push options to array for saving
        var optionsArray = new Array();
        optionsArray.push(board.timerEnabled);
        optionsArray.push(board.highlight);
        optionsArray.push(board.feedback);
        optionsArray.push(board.penalize);

        $.totalStorage('sudokuJS.options', optionsArray);

    },

    /**
    * Loads options and sets them accordingly
    * @method
    */
    loadOptions: function () {
        // get options array from storage and set board options
        var optionsData = $.totalStorage('sudokuJS.options');

        if (optionsData != null) {
            if (optionsData.length == 4) {
                board.timerEnabled = optionsData[0];
                board.highlight = optionsData[1];
                board.feedback = optionsData[2];
                board.penalize = optionsData[3];
            }
        }
    },

    /**
    * Addes all text items for menu
    * @method
    */
    homeView: function (resume) {
        // check if we're coming from the options menu
        if (this.view == gameView.options) {
            // save the options and then do animation to bring options text down and home menu items to show
            this.saveOptions();

            // if touch enabled, skip the animation
            if (board.touchEnabled) {
                this.homeSet.items[5].attr({ y: 425 });
                this.optionsSet.hide();
                this.optionsCheckSet.hide();
                board.backButton.hide();
                board.pauseButton.hide()
            } else {
                this.homeSet.items[5].animate({ y: 425 }, 300);
                this.optionsSet.animate({ opacity: 0 }, 250, function () { this.hide(); });
                this.optionsCheckSet.animate({ opacity: 0 }, 250, function () { this.hide(); });
                board.backButton.animate({ opacity: 0 }, function () { this.hide(); });
                board.pauseButton.animate({ opacity: 0 }, 250, function () { this.hide() });
            }
        } else {
            // reset colors and hide board
            board.resetAllCellColors();
            board.hideBoard();
        }

        // show all menu options
        this.bgOverlayrect.attr({ opacity: .5 });
        this.bgOverlayrect.show();
        this.homeSet.attr({ opacity: 1 });
        this.homeSet.show();

        // see if board is filled and complete
        var completeBoard = sudoku.isPlayerBoardFilled() && sudoku.checkPlayerBoard();

        // if flag is set or the board is complete, don't show resume
        if (!resume || completeBoard) {
            this.homeSet[4].attr({ opacity: 0 });
            this.homeSet[4].hide();
        }

        // check if there is a saved game available
        if (!sudoku.isSaveAvailable()) {
            this.homeSet[3].attr({ opacity: 0 });
            this.homeSet[3].hide();
        }

        this.view = gameView.menu;
    },

    /**
    * View for options menu
    * @method
    */
    optionsView: function () {
        this.loadOptions();

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            this.homeSet.items[5].attr({ y: 125 });
            // update back button text and position for view, then show
            board.backButton[2].attr({ x: 70, 'text': 'Save Options' });
            board.backButton.show().attr({ opacity: .7 });

            // animate opacity to 0 for all other homeset elements (except options)
            for (var i = 0; i < menu.optionsSet.length; i++) {
                menu.optionsSet[i].show().attr({ opacity: 1 });
            }

            // animate the checkboxes correctly
            for (var i = 0; i < menu.optionsCheckSet.length; i++) {
                // for some reason, this seems to be the only place the box will accept the cursor attribute...
                // show check boxes (not the check mark)
                menu.optionsCheckSet[i][0].show().attr({ opacity: 1, 'cursor': 'pointer' });

                // if check state is true, show check mark, otherwise hide it
                if (menu.optionsCheckSet[i][0].data('checked')) {
                    menu.optionsCheckSet[i][1].show().attr({ opacity: 1 });
                } else {
                    menu.optionsCheckSet[i][1].hide().attr({ opacity: 0 });
                }
            }
        } else {
            // animate up options text / back button and push down options menu item
            this.homeSet.items[5].animate({ y: 125 }, 300, function () {
                // update back button text and position for view, then show
                board.backButton[2].attr({ x: 70, 'text': 'Save Options' });
                board.backButton.show().animate({ opacity: .7 }, 250);

                // animate opacity to 0 for all other homeset elements (except options)
                for (var i = 0; i < menu.optionsSet.length; i++) {
                    menu.optionsSet[i].show().animate({ opacity: 1 }, 250);
                }

                // animate the checkboxes correctly
                for (var i = 0; i < menu.optionsCheckSet.length; i++) {
                    // for some reason, this seems to be the only place the box will accept the cursor attribute...
                    // show check boxes (not the check mark)
                    menu.optionsCheckSet[i][0].show().attr({ 'cursor': 'pointer' }).animate({ opacity: 1 }, 250);

                    // if check state is true, show check mark, otherwise hide it
                    if (menu.optionsCheckSet[i][0].data('checked')) {
                        menu.optionsCheckSet[i][1].show().animate({ opacity: 1 }, 250);
                    } else {
                        menu.optionsCheckSet[i][1].animate({ opacity: 0 }, 250, function () { this.hide(); });
                    }
                }
            }
        );

        }

        // animate opacity to 0 for all other homeset elements (except options)
        for (var i = 0; i < this.homeSet.length - 1; i++) {
            // if touch enabled, skip the animation
            if (board.touchEnabled) {
                this.homeSet[i].hide().attr({ opacity: 0 });
            } else {
                this.homeSet[i].animate({ opacity: 0 }, 300, function () { this.hide(); });
            }
        }

        this.view = gameView.options;
    },

    /**
    * Generates the sudoku board, culls based on difficulty, populate board and the animate board in and home menu out
    * @method
    */
    boardView: function (loadType) {
        // load board depending on the load type
        switch (loadType) {
            case boardLoadType.fresh:
                board.clearBoard();

                // based on selected difficulty, cull # of cells
                switch (menu.difficulty) {
                    case menuOptionType.easy:
                        sudoku.cull(42);
                        sudoku.guaranteeUniqueness(42);
                        break;

                    case menuOptionType.medium:
                        sudoku.cull(50);
                        sudoku.guaranteeUniqueness(50);
                        break;

                    case menuOptionType.hard:
                        sudoku.cull(60);
                        sudoku.guaranteeUniqueness(60);
                        break;

                    case menuOptionType.expert:
                        sudoku.cull(57);
                        sudoku.guaranteeUniqueness(57);
                        break;

                    default:
                        sudoku.cull(53);
                        sudoku.guaranteeUniqueness(53);
                        break;
                }

                board.resetAllCellColors(); // reset all colors

                break;

            case boardLoadType.resume:
                // add one second to timer and then start it
                board.timeElapsedInSec += 1;
                board.startTimer(loadType);

                break;

            case boardLoadType.load:
                board.clearBoard(); // clear board
                sudoku.loadState(); // load the state

                // place board onto sudoku board
                board.populate(sudoku.culledBoard);
                board.populateWithPlayerBoard(sudoku.playerBoard);

                board.startTimer(loadType); // start timer
                board.resetAllCellColors(); // reset all colors

                break;
        }

        if (loadType != boardLoadType.fresh) {
            // fade out home menu and then hide it, if touch enabled, skip the animation
            if (board.touchEnabled) {
                this.homeSet.hide().attr({ opacity: 0 });
                this.bgOverlayrect.hide().attr({ opacity: 0 });
            } else {
                this.homeSet.animate({ opacity: 0 }, 100, function () { menu.homeSet.hide(); });
                this.bgOverlayrect.animate({ opacity: 0 }, 100, function () { menu.bgOverlayrect.hide(); });
            }

            board.showBoard();  // shows the board
        }

        this.view = gameView.board;
    }
};