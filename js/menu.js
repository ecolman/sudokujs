/**
* Menu system for game
**/

var menu = new Object();

var menu = {
    initialized: false,
    paper: null,

    /* Control Holders */
    checkSet: null,

    /* CSS Classes */
    menuClass: 'menuItem',
    smallMenuClass: 'smallMenuItem',
    optionClass: 'optionItem',
    subOptionClass: 'subOptionItem',

    /* State */
    view: gameView.menu,

    /**
    * Initialized the arrays with all 0's
    * @method
    * @param {Number} amount
    */
    initialize: function (paper) {
        this.paper = paper;

        this.loadOptions(); // load options from local storage
        this.createBgNums();    // create random sudoku numbers for menu background
        this.createHomeMenu();  // creates the home menu text elements
        this.createOptionsMenu();   // create the options menu text elements

        menu.homeView(false);

        this.initialized = true;
    },

    /**
    * Creates all text elements for the menu board
    * @method
    */
    createBgNums: function () {
        for (var i = 0; i < sudoku.menuCellsToShow.length; i++) {
            var rect = this.paper.getById(sudoku.menuCellsToShow[i]);   // get the holder rectang
            var cellText = this.paper.text(rect.attr('x') + (board.sudukoRectWidth / 2), rect.attr('y') + (board.sudukoRectHeight / 1.45), sudoku.menuCellsValues[i]);  // create numeral

            cellText.node.id = 'menuCell' + i;  // set cell node id
            $('#' + cellText.node.id).attr({ 'class': board.textCellClass, 'data-background': true,  'data-menu': true });    // set class and data-menu
        }
    },

    /**
    * Creates all the text elements for the home menu and adds them to a set
    * @method
    */
    createHomeMenu: function () {
        var bgRect = this.paper.rect(3, 50, 540, 450).attr({ fill: '#E0F8E0', 'stroke-width': 0 });    // create rectangle around menu to make everything opaque
        bgRect.node.id = 'boardBackground'; // set the id
        $(bgRect.node).attr({ 'data-background': true, 'data-menu': true });    // set the data

        this.title = this.paper.text(275, 35, 'Sudoku JS'); // create title for menu
        this.title.node.id = 'title';   // set the id

        // easy option
        var easyOption = this.paper.text(275, 125, 'Easy').attr({ fill: getDifficultyColor(boardDifficulty.easy), 'letter-spacing': 15 });
        $(easyOption.node).attr({ class: this.menuClass, 'data-type': menuOptionType.easy, 'data-menu': true, 'data-main': true });   // set class and data attrs

        // medium option
        var mediumOption = this.paper.text(275, 175, 'Medium').attr({ fill: getDifficultyColor(boardDifficulty.medium), 'letter-spacing': 13 });
        $(mediumOption.node).attr({ class: this.menuClass, 'data-type': menuOptionType.medium, 'data-menu': true, 'data-main': true });   // set class and data attrs

        // hard option
        var hardOption = this.paper.text(275, 225, 'Hard').attr({ fill: getDifficultyColor(boardDifficulty.hard), 'letter-spacing': 15 })
        $(hardOption.node).attr({ class: this.menuClass, 'data-type': menuOptionType.hard, 'data-menu': true, 'data-main': true });   // set class and data attrs

        // expert option
        var expertOption = this.paper.text(275, 275, 'Expert').attr({ fill: getDifficultyColor(boardDifficulty.expert), 'letter-spacing': 12 })
        $(expertOption.node).attr({ class: this.menuClass, 'data-type': menuOptionType.expert, 'data-menu': true, 'data-main': true });   // set class and data attrs

        // load option
        var loadOption = this.paper.text(275, 385, 'Load Last Game').attr({ fill: '#562E60', 'letter-spacing': 2 })
        $(loadOption.node).attr({ class: this.smallMenuClass, 'data-type': menuOptionType.load, 'data-menu': true, 'data-main': true });   // set class and data attrs

        // resume option
        var resumeOption = this.paper.text(275, 340, 'Resume Game').attr({ fill: '#562E60', 'letter-spacing': 5 })
        $(resumeOption.node).attr({ class: this.smallMenuClass, 'data-type': menuOptionType.resume, 'data-menu': true, 'data-main': true }).hide();   // set class and data attrs, then hide

        // options...option
        var optionsMenuOption = this.paper.text(275, 430, 'Options').attr({ fill: '#562E60', 'letter-spacing': 7 })
        $(optionsMenuOption.node).attr({ class: this.smallMenuClass, 'data-type': menuOptionType.options, 'data-raphaelId': optionsMenuOption.id, 'data-menu': true,
            'data-main': true, 'data-option': true
        });   // set class and data attrs

        // add all options to homeSet, mainy to make mousedown handlers and animations easier

        $('[data-menu=true][data-main=true]').mousedown(function (event) {
            var optionType = $(this).attr('data-type');

            switch (optionType) {
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

                case menuOptionType.load:
                    menu.boardView(boardLoadType.load);
                    break;

                case menuOptionType.resume:
                    menu.boardView(boardLoadType.resume);
                    break;

                case menuOptionType.options:
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
        this.optionsCheckSet = this.paper.set();

        // create options, set their id's and their data
        var timerOptionText = this.paper.text(263, 185, 'Enable Timer');
        $(timerOptionText.node).attr({ class: this.optionClass, 'data-menu': true, 'data-option': true });   // set class and data attrs

        var highlightOptionText = this.paper.text(223, 235, 'Number highlighting');
        $(highlightOptionText.node).attr({ class: this.optionClass, 'data-menu': true, 'data-option': true });   // set class and data attrs

        var feedbackOptionText = this.paper.text(242, 285, 'Instant Feedback');
        $(feedbackOptionText.node).attr({ class: this.optionClass, 'data-menu': true, 'data-option': true });   // set class and data attrs

        var penalizeOptionText = this.paper.text(200, 335, 'Penalty for wrong number');
        $(penalizeOptionText.node).attr({ class: this.optionClass, 'data-menu': true, 'data-option': true });   // set class and data attrs

        var penalizeOptionSubText = this.paper.text(200, 360, '(when instant feedback enabled)').attr({ 'font-size': '15px' });
        $(penalizeOptionSubText.node).attr({ class: this.subOptionClass, 'data-menu': true, 'data-option': true });   // set class and data attrs

        // create options checkboxes and also attach mousedown handlers
        var timerOptionCheck = createCheckSet(350, 170, optionType.timer);
        var highlightOptionCheck = createCheckSet(350, 220, optionType.highlight);
        var feedbackOptionCheck = createCheckSet(350, 270, optionType.feedback);
        var penalizeOptionCheck = createCheckSet(350, 320, optionType.penalize);

        // add all options to optionsSet and add all checkboxes to optionsCheckSet
        this.optionsCheckSet.push(timerOptionCheck, highlightOptionCheck, feedbackOptionCheck, penalizeOptionCheck);

        // hide both of the sets
        $('[data-menu=true][data-option=true][data-main!=true]').css({ opacity: 0 });
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


                check.attr({ 'data-checked': checkState });
                box.attr({ 'data-checked': checkState });

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

            // have to get options text 
            var rId = $('[data-menu=true][data-type="' + menuOptionType.options + '"]').attr('data-raphaelId');   // get raphaelId from jquery element
            var optionsText = this.paper.getById(rId);  // grab raphael object through id

            // if touch enabled, skip the animation
            if (board.touchEnabled) {
                optionsText.attr({ y: 425 });   // move options text to bottom
                $('[data-menu=true][data-option=true][data-main!=true]').hide();    // hide all option items

                menu.optionsCheckSet.hide();    // hide menu option checks
                board.backButton.hide();    // hide back button
                board.pauseButton.hide();    // hide pause button

                $('[data-menu=true][data-main=true], text[data-menu=true][data-background=true]').css({ opacity: 1 }); // show all main menu options
            } else {
                optionsText.animate({ y: 425 }, 300);   // animate options text to bottom

                $('[data-menu=true][data-option=true][data-main!=true]').animate({ opacity: 0 }, 300, function () { $(this).hide(); });  // animate away the option items

                menu.optionsCheckSet.animate({ opacity: 0 }, 300, function () { this.hide(); });    // animate away the option checks
                board.backButton.animate({ opacity: 0 }, 300, function () { this.hide(); });    // animate away the back button
                board.pauseButton.animate({ opacity: 0 }, 300, function () { this.hide() });    // animate away the pause button

                $('[data-menu=true][data-main=true], text[data-menu=true][data-background=true]').show().animate({ opacity: 1 }, 400); // show all menu options
            }
        } else {
            // reset colors and hide board
            board.resetAllCellColors();
            board.hideBoard();
            $('[data-menu=true][data-main=true], text[data-menu=true][data-background=true]').show().animate({ opacity: 1 }, 400);
        }

        $('rect[data-menu=true][data-background=true]').show();

        // see if board is filled and complete
        var completeBoard = sudoku.isPlayerBoardFilled() && sudoku.checkPlayerBoard();

        // if flag is set or the board is complete, don't show resume
        if (!resume || completeBoard) {
            $('[data-menu=true][data-type="' + menuOptionType.resume + '"]').css({ opacity: 0 }).hide();
        }

        // check if there is a saved game available
        if (!sudoku.isSaveAvailable()) {
            $('[data-menu=true][data-type="' + menuOptionType.load + '"]').css({ opacity: 0 }).hide();
        }

        this.view = gameView.menu;
    },

    /**
    * View for options menu
    * @method
    */
    optionsView: function () {
        this.loadOptions();

        var rId = $('[data-menu=true][data-type="' + menuOptionType.options + '"]').attr('data-raphaelId');   // get raphaelId from jquery element
        var optionsText = this.paper.getById(rId);  // grab raphael object through id

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            optionsText.attr({ y: 125 });   // set the options header text to y coordiante
            board.backButton[2].attr({ x: 70, 'text': 'Save Options' });    // change text of top left menu
            board.backButton.show().attr({ opacity: .7 });  // show the back button and text

            $('[data-menu=true][data-options=true]').css({ opacity: 1 }).show();   // show all options items

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
            optionsText.animate({ y: 125 }, 300, function () {
                board.backButton[2].attr({ x: 70, 'text': 'Save Options' });    // change text of top left menu
                board.backButton.show().attr({ opacity: .7 });  // show the back button and text
            });

            // animate the checkboxes correctly
            for (var i = 0; i < menu.optionsCheckSet.length; i++) {
                // for some reason, this seems to be the only place the box will accept the cursor attribute...
                // show check boxes (not the check mark)
                menu.optionsCheckSet[i][0].show().attr({ 'cursor': 'pointer' }).animate({ opacity: 1 }, 300);

                // if check state is true, show check mark, otherwise hide it
                if ($(menu.optionsCheckSet[i][0].node).data('checked')) {
                    menu.optionsCheckSet[i][1].show().animate({ opacity: 1 }, 300);
                } else {
                    menu.optionsCheckSet[i][1].animate({ opacity: 0 }, 300, function () { this.hide(); });
                }
            }

            $('[data-menu=true][data-option=true]').show().animate({ opacity: 1 }, 400);    // show all options items
        }

        // if touch enabled, skip the animation
        if (board.touchEnabled) {
            $('[data-menu=true][data-main=true][data-option!=true]').css({ opacity: 0 });   // hide all menu items that aren't options
        } else {
            $('[data-menu=true][data-main=true][data-option!=true]').animate({ opacity: 0 }, 300, function () { $(this).hide(); });   // hide all menu items that aren't options
        }

        this.view = gameView.options;
    },

    /**
    * Generates the sudoku board, culls based on difficulty, populate board and the animate board in and home menu out
    * @method
    */
    boardView: function (loadType) {
        $('[data-menu=true][data-background=true]').hide(); // hide the background

        // load board depending on the load type
        switch (loadType) {
            case boardLoadType.fresh:
                // based on selected difficulty, cull # of cells or pick from stored JSON boards
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