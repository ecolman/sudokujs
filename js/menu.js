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
    smallMenuClass: 'smallMenuItem',
    optionClass: 'optionItem',
    subOptionClass: 'subOptionItem',
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
        var easyOption = this.paper.text(275, 125, 'Easy').attr({ fill: getDifficultyColor(boardDifficulty.easy), 'letter-spacing': 15 });
        easyOption.id = 1001;
        easyOption.node.setAttribute('class', this.menuClass);
        easyOption.data({ 'type': menuOptionType.easy });

        var mediumOption = this.paper.text(275, 175, 'Medium').attr({ fill: getDifficultyColor(boardDifficulty.medium), 'letter-spacing': 13 });
        mediumOption.id = 1003;
        mediumOption.node.setAttribute('class', this.menuClass);
        mediumOption.data({ 'type': menuOptionType.medium });

        var hardOption = this.paper.text(275, 225, 'Hard').attr({ fill: getDifficultyColor(boardDifficulty.hard), 'letter-spacing': 15 })
        hardOption.id = 1004;
        hardOption.node.setAttribute('class', this.menuClass);
        hardOption.data({ 'type': menuOptionType.hard });

        var expertOption = this.paper.text(275, 275, 'Expert').attr({ fill: getDifficultyColor(boardDifficulty.expert), 'letter-spacing': 12 })
        expertOption.id = 1005;
        expertOption.node.setAttribute('class', this.menuClass);
        expertOption.data({ 'type': menuOptionType.expert });

        var loadOption = this.paper.text(275, 385, 'Load Last Game').attr({ fill: '#562E60', 'letter-spacing': 2 })
        loadOption.id = 1006;
        loadOption.node.setAttribute('class', this.smallMenuClass);
        loadOption.data({ 'type': menuOptionType.loadGame });

        var resumeOption = this.paper.text(275, 340, 'Resume Game').attr({ fill: '#562E60', 'letter-spacing': 5 })
        resumeOption.id = 1007;
        resumeOption.data({ 'type': menuOptionType.resumeGame });
        resumeOption.node.setAttribute('class', this.smallMenuClass);
        resumeOption.hide();

        var optionsMenuOption = this.paper.text(275, 430, 'Options').attr({ fill: '#562E60', 'letter-spacing': 7 })
        optionsMenuOption.id = 1008;
        optionsMenuOption.node.setAttribute('class', this.smallMenuClass);
        optionsMenuOption.data({ 'type': menuOptionType.optionsMenu });

        // add all options to homeSet, mainy to make mousedown handlers and animations easier
        this.homeSet.push(easyOption).push(mediumOption).push(hardOption).push(expertOption).push(loadOption).push(resumeOption).push(optionsMenuOption).attr({ opacity: 1 });

        // set mousedown handler for all homeSet elements
        this.homeSet.mousedown(function (event) {
            switch (this.data('type')) {
                case menuOptionType.easy:
                    sudoku.difficulty = boardDifficulty.easy;
                    menu.boardView(boardLoadType.fresh);
                    break;

                case menuOptionType.medium:
                    sudoku.difficulty = boardDifficulty.medium;
                    menu.boardView(boardLoadType.fresh);
                    break;

                case menuOptionType.hard:
                    sudoku.difficulty = boardDifficulty.hard;
                    menu.boardView(boardLoadType.fresh);
                    break;

                case menuOptionType.expert:
                    sudoku.difficulty = boardDifficulty.expert;
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

        var penalizeOptionSubText = this.paper.text(200, 360, '(when instant feedback enabled)').attr({ 'font-size': '15px' });
        penalizeOptionSubText.id = 1105;
        penalizeOptionSubText.node.setAttribute('class', this.subOptionClass);

        // create options checkboxes and also attach mousedown handlers
        var timerOptionCheck = createCheckSet(350, 170, board.timerEnabled, optionType.timer);
        var highlightOptionCheck = createCheckSet(350, 220, board.highlight, optionType.highlight);
        var feedbackOptionCheck = createCheckSet(350, 270, board.feedback, optionType.feedback);
        var penalizeOptionCheck = createCheckSet(350, 320, board.penalize, optionType.penalize);

        // add all options to optionsSet and add all checkboxes to optionsCheckSet
        this.optionsSet.push(timerOptionText).push(highlightOptionText).push(feedbackOptionText).push(penalizeOptionText).push(penalizeOptionSubText);
        this.optionsCheckSet.push(timerOptionCheck).push(highlightOptionCheck).push(feedbackOptionCheck).push(penalizeOptionCheck);

        // hide both of the sets
        this.optionsSet.hide().attr({ opacity: 0 });
        this.optionsCheckSet.hide().attr({ opacity: 0 })
    },

    /**
    * Switches options for board and then saves the options to local storage
    * @method
    */
    saveOptions: function () {
        // loop through optionsCheckSet and set options based on the type of the check
        for (var i = 0; i < this.optionsCheckSet.length; i++) {
            var option = this.optionsCheckSet[i][0];
            var checked = $(option.node).data('checked');

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
                this.homeSet.items[6].attr({ y: 425 });
                this.optionsSet.hide();
                this.optionsCheckSet.hide();
                board.backButton.hide();
                board.pauseButton.hide()
            } else {
                this.homeSet.items[6].animate({ y: 425 }, 300);
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
            this.homeSet[5].attr({ opacity: 0 });
            this.homeSet[5].hide();
        }

        // check if there is a saved game available
        if (!sudoku.isSaveAvailable()) {
            this.homeSet[4].attr({ opacity: 0 });
            this.homeSet[4].hide();
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
            this.homeSet.items[6].attr({ y: 125 });
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
                if ($(menu.optionsCheckSet[i][0].node).data('checked')) {
                    menu.optionsCheckSet[i][1].show().attr({ opacity: 1 });
                } else {
                    menu.optionsCheckSet[i][1].hide().attr({ opacity: 0 });
                }
            }
        } else {
            // animate up options text / back button and push down options menu item
            this.homeSet.items[6].animate({ y: 125 }, 300, function () {
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
                    if ($(menu.optionsCheckSet[i][0].node).data('checked')) {
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
                // based on selected difficulty, cull # of cells
                switch (sudoku.difficulty) {
                    case boardDifficulty.easy:
                        sudoku.cull(42);
                        sudoku.guaranteeUniqueness(42);
                        break;

                    case boardDifficulty.medium:
                        sudoku.cull(50);
                        sudoku.guaranteeUniqueness(50);
                        break;

                    case boardDifficulty.hard:
                        sudoku.loadBoard(250, 350);
                        break;

                    case boardDifficulty.expert:
                        sudoku.loadBoard(351, 700);
                        break;

                    default:
                        sudoku.cull(53);
                        sudoku.guaranteeUniqueness(53);
                        break;
                }

                break;

            case boardLoadType.resume:
                $('body').trigger('loadBoard', boardLoadType.resume); // trigger event that a new board has been created
                break;

            case boardLoadType.load:
                $('body').trigger('loadBoard', boardLoadType.load); // trigger event that a new board has been created

                break;
        }

        this.view = gameView.board;
    }
};