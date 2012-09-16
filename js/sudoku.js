/**
* Sudoku generator object created using code contributed by Jani Hartikainen @ codeutopia.net
**/

var sudoku = new Object();

var sudoku = {
    initialized: false,
    completeBoard: [],
    workerBoards: [],
    culledBoard: [],
    playerBoard: [],
    loadedPuzzles: [],
    notes: [],
    savesAvailable: false,
    menuCellsToShow: [0, 2, 16, 18, 26, 36, 43, 71, 75],
    menuCellsValues: [],
    solver: [],
    foundUnique: false,
    enableWebWorkers: false,
    tryCount: 10,
    numOfWorkers: 5,
    workerResults: new Array(this.numOfWorkers),
    cullNumber: 0,
    difficulty: null,

    startTime: null,

    /**
    * Initialized the arrays with all 0's
    * @method
    */
    initialize: function () {
        // create all boards and fill with 0's
        this.clearBoards();

        // randomly select values for menu cells
        sudokuCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // push randomly selected value to cells
        for (var i = 0; i < this.menuCellsToShow.length; i++) {
            var rnd = Math.floor(Math.random() * sudokuCellValues.length);
            var num = sudokuCellValues.splice(rnd, 1)[0];

            this.menuCellsValues.push(num);
        }

        $.getJSON('puzzles/puzzles.json', function (data) {
            sudoku.loadedPuzzles = data;
        })

        this.initialized = true;
    },

    /**
    * Clears all the boards
    * @method
    */
    clearBoards: function () {
        // create all boards and fill with 0's
        for (var i = 0; i < 9; i++) {
            this.completeBoard[i] = [];
            this.culledBoard[i] = [];
            this.playerBoard[i] = [];

            for (var j = 0; j < 9; j++) {
                this.completeBoard[i][j] = 0;
                this.culledBoard[i][j] = 0;
                this.playerBoard[i][j] = 0;
            }
        }
    },

    loadBoard: function (low, high) {
        for (i = 0; i < this.loadedPuzzles.length; i++) {
            // grab random puzzle and check
            var puzzle = this.loadedPuzzles[Math.floor(Math.random() * (this.loadedPuzzles.length))];

            // If the X = Y the stop looping
            if (puzzle.grade >= low && puzzle.grade <= high) {
                this.fromArray(puzzle.board.split(''), this.playerBoard);
                this.fromArray(puzzle.board.split(''), this.culledBoard);
                this.fromArray(puzzle.solution.split(''), this.completeBoard);

                break;
            }
        }

        $('body').trigger('loadBoard', boardLoadType.fresh);
    },

    /**
    * Creates the worker thread and the delegates
    * @method
    */
    createWorker: function (threadNum) {
        this.solver[threadNum] = new Worker('js/sudokuSolverWorker.js');

        this.solver[threadNum].addEventListener('message', function (e) {
            if (sudoku.foundUnique) {
                this.terminate();
            }

            var successCount = (sudoku.workerResults[e.data.threadNum] != undefined) ? sudoku.workerResults[e.data.threadNum].successCount : 0;

            switch (e.data.cmd) {
                case 'test':
                    this.postMessage({ 'board': e.data.board, 'threadNum': e.data.threadNum });
                    console.log('testing on thread ' + e.data.threadNum);

                    break;

                case 'console':
                    console.log(e.data.message);

                    break;

                case 'result':
                    switch (e.data.result) {
                        case sudokuUniqueResult.unique:
                            successCount += 1;

                            if (successCount > 1) {
                                //console.log('      not unique, board: ' + sudoku.toString(sudoku.workerResults[e.data.threadNum].board) + ' | (' + utilities.getTime() + ') thread: ' + e.data.threadNum);
                                sudoku.workerResults[e.data.threadNum] = { 'result': sudokuUniqueResult.notUnique, 'board': sudoku.workerResults[e.data.threadNum].board,
                                    'successCount': successCount, 'finished': true
                                };

                                this.terminate();
                            } else {
                                sudoku.workerResults[e.data.threadNum] = { 'board': sudoku.workerResults[e.data.threadNum].board, 'successCount': successCount, 'finished': false };
                                //console.log('got a solution to board: ' + sudoku.toString(sudoku.workerResults[e.data.threadNum].board) + ' | (' + utilities.getTime() + ') thread: ' + e.data.threadNum);

                                this.boardsReadyTimeout = setTimeout(function (i) {
                                    sudoku.workerResults[i] = { 'board': sudoku.workerResults[i].board, 'successCount': sudoku.workerResults[i].successCount, 'finished': true };

                                    if (sudoku.workerResults[i].successCount == 1) {
                                        console.log('got a solution to board: ' + sudoku.toString(sudoku.workerResults[e.data.threadNum].board) + ' | thread: ' + e.data.threadNum);

                                        sudoku.foundUnique = true;

                                        $('body').trigger('loadBoard', boardLoadType.fresh); // trigger event that a new board has been created

                                        sudoku.solver[i].terminate();
                                    } else {
                                        // loop through results checking if we've found a unique solution
                                        var resetWorkers = true;

                                        for (var i = 0; i < sudoku.workerResults.length; i++) {
                                            var wResult = sudoku.workerResults[i];

                                            if (wResult.finished == true && wResult.result == sudokuUniqueResult.unique) {
                                                resetWorkers = false;
                                                break;
                                            }
                                        }

                                        if (resetWorkers && !sudoku.foundUnique) {
                                            console.log('resetting');
                                            sudoku.sendNewBoardsToSolver(sudoku.cullNumber);
                                        }
                                    }
                                }, 50, e.data.threadNum);
                            }

                            break;

                        case sudokuUniqueResult.noSolution:
                            //console.log('no solution thread: ' + e.data.threadNum);
                            sudoku.workerResults[e.data.threadNum] = { 'result': sudokuUniqueResult.noSolution, 'board': sudoku.workerResults[e.data.threadNum].board,
                                'successCount': successCount, 'finished': true
                            };

                            this.terminate();

                            break;
                    }

                    break;

                default:

                    break;
            }
        }, false);
    },

    /**
    * Generates a complete sudoku board using the backtrack algorithm
    * @method
    */
    generate: function () {
        //We need to keep track of all numbers tried in every cell
        var cellNumbers = [];

        for (var i = 0; i < 81; i++) {
            cellNumbers[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }

        for (var i = 0; i < 81; i++) {
            var found = false;
            var row = Math.floor(i / 9);
            var col = i - (row * 9);

            while (cellNumbers[i].length > 0) {
                //Pick a random number to try
                var rnd = Math.floor(Math.random() * cellNumbers[i].length);
                var num = cellNumbers[i].splice(rnd, 1)[0];

                this.setValue(row, col, num);

                if (!this.cellConflicts(row, col)) {
                    found = true;
                    break;
                }
                else {
                    this.setValue(row, col, 0);
                    found = false;
                    continue;
                }
            }

            //If a possible number was not found, backtrack			
            if (!found) {
                //After backtracking we can try all numbers here again
                cellNumbers[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

                //Reduce by two, since the loop increments by one
                i -= 2;
            }
        }
    },

    /**
    * Clear N cells from the sudoku grid randomly
    * @method
    * @param {Number} numCellsToRemove
    */
    cull: function (numCellsToRemove) {
        // reset culled and player boards to complete board to make sure all boards are the same
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                this.culledBoard[r][c] = this.completeBoard[r][c];
                this.playerBoard[r][c] = this.completeBoard[r][c];
            }
        }

        var cells = [];

        // fill array with empty value (0)
        for (var i = 0; i < 81; i++)
            cells.push(i);

        // loop to number of cells to remove
        for (var i = 0; i < numCellsToRemove; i++) {
            // pick a random number, slice off value from array, calculate row and column to remove (set to 0)
            var rnd = Math.floor(Math.random() * cells.length);
            var value = cells.splice(rnd, 1);
            var row = Math.floor(value / 9);
            var col = value - (row * 9);

            // set both board cells to empty (0)
            this.playerBoard[row][col] = 0;
            this.culledBoard[row][col] = 0;
        }
    },

    /**
    * Resets the workerResults array and starts up this.numOfWorkers threads to solve puzzle
    * @method
    * @param {Number} numCellsToRemove
    */
    sendNewBoardsToSolver: function (numCellsToRemove) {
        this.foundUnique = false;

        this.clearBoards();
        this.generate();

        for (var i = 0; i < this.numOfWorkers; i++) {
            if (i % 5 == 0) {
                this.clearBoards();
                this.generate();
            }

            // re-cull with number to remove
            this.cull(numCellsToRemove);

            console.log(this.toString(this.culledBoard));

            this.workerResults[i] = { 'board': this.culledBoard, 'successCount': 0 };
            this.createWorker(i);
            this.solver[i].postMessage({ 'board': this.culledBoard, 'successCount': 0, 'threadNum': i });
        }
    },

    /**
    * Calls the _testUniqueness function until the grid only has one solution
    * @method
    * @param {Number} numCellsToRemove
    */
    guaranteeUniqueness: function (numCellsToRemove) {
        // grab time started, count and kick off first test
        this.startTime = utilities.getTime();
        var tryCount = 1;
        this.cullNumber = numCellsToRemove;

        if (this.enableWebWorkers) {
            // start the workers
            this.sendNewBoardsToSolver(this.cullNumber);
        } else {
            var unique = this._testUniqueness(tryCount);
            // while the sudoku puzzle is not unique or unsolvable, keep retrying with different culls / boards
            while (unique != sudokuUniqueResult.unique) {
                // if we've tried 5 different culls on a board, regenerate a board to try again
                if (tryCount % 5 == 0) {
                    this.clearBoards();
                    this.generate();
                }

                // re-cull with number to remove
                this.cull(numCellsToRemove);

                // test uniqueness and increment
                unique = this._testUniqueness(tryCount);

                tryCount++;
            }

            // reset culled to player board to ensure no changes were made to board during testing for uniqueness
            for (var r = 0; r < 9; r++) {
                for (var c = 0; c < 9; c++) {
                    this.culledBoard[r][c] = this.playerBoard[r][c];
                }
            }

            // stop time
            var endtime = utilities.getTime();
            //console.log('culled ' + numCellsToRemove + ' cells, took ' + tryCount + ' tries(s) and ' + ((endtime - this.startTime) / 1000) + ' sec(s) to generate board.');

            $('body').trigger('loadBoard', boardLoadType.fresh); // trigger event that a new board has been created
        }
    },

    /**
    * Compares the player array cell to the complete solution array cell
    * @method
    * @param {Number} numberToCheck
    * @param {Number} col
    * @param {Number} row
    * @return {Boolean}
    */
    checkCell: function (numberToCheck, row, col) {
        // check if cells don't match
        if (this.completeBoard[row][col] != numberToCheck) {
            return false;
        }

        return true;
    },


    /**
    * Compares the player array cell to the complete solution array cell
    * @method
    * @param {Number} col
    * @param {Number} row
    * @return {Boolean}
    */
    checkPlayerCell: function (row, col) {
        // check if cells don't match
        if (this.completeBoard[row][col] != this.playerBoard[row][col]) {
            return false;
        }

        return true;
    },

    /**
    * Compares the player array to the complete solution array
    * @method
    * @return {Boolean}
    */
    checkPlayerBoard: function () {
        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                // check if cell is empty (0) or if they don't match
                if (this.playerBoard[r][c] == 0 || this.completeBoard[r][c] != this.playerBoard[r][c]) {
                    return false;
                }
            }
        }

        return true;
    },

    /**
    * Checks if any position in playerBoard is 0 (empty)
    * @method
    * @return {Boolean}
    */
    isPlayerBoardFilled: function () {
        for (var r = 0; r < 9; r++) {
            if ($.inArray(0, sudoku.playerBoard[r]) > -1) {
                return false;
            }
        }

        return true;
    },

    /**
    * Checks if any the playerBoard has any non-empty cells
    * @method
    * @return {Boolean}
    */
    isGameInProgress: function () {
        for (var r = 0; r < 9; r++) {
            for (var c = 1; c < this.playerBoard[r].length + 1; c++) {
                if ($.inArray(c, this.playerBoard[r]) > -1) {
                    return true;
                }
            }
        }

        return false;
    },

    /**
    * Return value of a col,row in the grid
    * @method
    * @param {Number} col
    * @param {Number} row
    * @return {Number} 0 to 9, 0 meaning empty
    */
    getValue: function (row, col) {
        return this.completeBoard[row][col];
    },

    /**
    * Set value of col & row position in all boards
    * @method
    * @param {Number} column
    * @param {Number} row
    * @param {Number} value 0 to 9, 0 meaning empty
    */
    setValue: function (row, column, value) {
        this.completeBoard[row][column] = value;
        this.culledBoard[row][column] = value;
        this.playerBoard[row][column] = value;
    },

    /**
    * Set value of col & row position of playerBoard
    * @method
    * @param {Number} column
    * @param {Number} row
    * @param {Number} value 0 to 9, 0 meaning empty
    */
    setPlayerBoardValue: function (row, column, value) {
        if (this.playerBoard[row] != undefined) {
            this.playerBoard[row][column] = value;
        }
    },

    /**
    * Checks if a cell conflict with it's row / column
    * @method
    * @param {Number} column
    * @param {Number} row
    * @return {Boolean}
    */
    cellConflicts: function (row, column) {
        var value = this.completeBoard[row][column];

        if (value == 0)
            return false;

        // loop through row and column which cell is on
        for (var i = 0; i < 9; i++) {
            // check if we're not on the same row and then check if cell is a duplicate value
            if (i != row && this.completeBoard[i][column] == value) {
                return true;
            }

            // check if we're not on the same column and then check if cell is a duplicate value
            if (i != column && this.completeBoard[row][i] == value) {
                return true;
            }
        }

        // finally, check region for duplicate value
        return !this._regionValid(row, column);
    },

    /**
    * Returns the 
    * @method
    * @param {Number} row
    * @param {Number} column
    */
    getCellRelations: function (row, column) {
        var relations = [];
        var regionLimits = this.getRegionLocation(row, column); // get region cells

        // add region cell
        for (var r = regionLimits.start.r; r < regionLimits.end.r; r++) {
            for (var c = regionLimits.start.c; c < regionLimits.end.c; c++) {
                relations.push({ 'row': r, 'column': c });
            }
        }

        // get row cells
        for (var tempCol = 0; tempCol < 9; tempCol++) {
            relations.push({ 'row': row, 'column': tempCol });
        }

        // get column cells
        for (var tempRow = 0; tempRow < 9; tempRow++) {
            relations.push({ 'row': tempRow, 'column': column });
        }

        return relations;
    },

    /**
    * Counts the number of times a single number has been used on a sudoku board
    * @method
    * @param {Number} number
    * @param {Array} boardToSearch
    */
    checkNumberUsage: function (number) {
        var count = 0;

        // count how many times each selector number has been used on board
        for (var r = 0; r < this.playerBoard.length; r++) {
            for (var c = 0; c < this.playerBoard[r].length; c++) {
                if (this.playerBoard[r][c] == number) {
                    count += 1;
                }
            }
        }

        return count;
    },

    /**
    * Checks if inner 3x3 region a cell resides in is valid
    * @method
    * @private
    * @param {Number} column
    * @param {Number} row
    * @return {Boolean}
    */
    _regionValid: function (row, column) {
        // get region location start / end
        var regionLimits = this.getRegionLocation(row, column)

        var numbers = [];

        // loop through 3x3 region looking for any duplicate values
        for (var r = regionLimits.start.r; r < regionLimits.end.r; r++) {
            for (var c = regionLimits.start.c; c < regionLimits.end.c; c++) {
                var value = this.completeBoard[r][c];
                if (value == 0)
                    continue;

                if ($.inArray(value, numbers) > -1)
                    return false;

                numbers.push(value);
            }
        }

        return true;
    },

    /**
    * Calculates 3x3 region a cell resides in
    * @method
    * @param {Number} column
    * @param {Number} row
    * @return {JSON} regionLimits - contains start row/col and end row/col for region
    */
    getRegionLocation: function (row, column) {
        // very snazzy way to determine which 3x3 region cell belongs to
        // too bad I didn't come up with it =( (nice one Jani)
        var mgX = Math.floor(column / 3);
        var mgY = Math.floor(row / 3);

        var startCol = mgX * 3;
        var startRow = mgY * 3;

        var endCol = (mgX + 1) * 3;
        var endRow = (mgY + 1) * 3;

        var regionLimits = { 'start': { r: startRow, c: startCol }, 'end': { r: endRow, c: endCol} };

        return regionLimits;
    },

    /**
    * Runs board through a series of tests to ensure that it only has one solution
    * @method
    * @private
    */
    _testUniqueness: function (tryCount) {
        // Find untouched location with most information
        var rp = 0, cp = 0;
        var Mp = null;
        var cMp = 10;

        for (var r = 0; r < 9; r++) {
            for (var c = 0; c < 9; c++) {
                // Is this spot unused?
                if (this.culledBoard[r][c] == 0) {
                    // Set M of possible solutions
                    var M = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                    var cM = 0;

                    // Remove used numbers in the vertical direction
                    for (var a = 0; a < 9; a++) {
                        M[this.culledBoard[r][a]] = 0;
                    }

                    // Remove used numbers in the horizontal direction
                    for (var b = 0; b < 9; b++) {
                        M[this.culledBoard[b][c]] = 0;
                    }

                    // Remove used numbers in the region
                    var regionLimits = this.getRegionLocation(r, c);

                    for (var x = regionLimits.start.r; x < regionLimits.end.r; x++) {
                        for (var y = regionLimits.start.c; y < regionLimits.end.c; y++) {
                            M[this.culledBoard[x][y]] = 0;
                        }
                    }

                    // Calculate cardinality of M
                    for (var d = 1; d < 10; d++) {
                        cM += M[d] == 0 ? 0 : 1;
                    }

                    // Is there more information in this spot than in the best yet?
                    if (cM < cMp) {
                        cMp = cM;
                        Mp = M;
                        rp = r;
                        cp = c;
                    }
                }
            }
        }

        // Finished?
        if (cMp == 10) {
            //console.log('NON-THREADED result: unique (cMp == 10)');
            return sudokuUniqueResult.unique;
        }

        // Couldn't find a solution?
        if (cMp == 0) {
            //console.log('NON-THREADED result: no solution (cMp == 0)');
            return sudokuUniqueResult.noSolution;
        }

        // Try elements
        var success = 0;
        for (var i = 1; i < 10; i++) {
            if (Mp[i] != 0) {
                this.culledBoard[rp][cp] = Mp[i];

                //console.log('NON-THREADED row: ' + rp + ' col: ' + cp + ' value: ' + Mp[i]);

                switch (this._testUniqueness(tryCount)) {

                    case sudokuUniqueResult.unique:
                        success++;
                        //console.log('NON-THREADED result: unique (_testUniqueness result)');
                        break;

                    case sudokuUniqueResult.notUnique:
                        //console.log('NON-THREADED result: not unique (_testUniqueness result)');
                        return sudokuUniqueResult.notUnique;

                    case sudokuUniqueResult.noSolution:
                        //console.log('NON-THREADED result: no solution (_testUniqueness result)');
                        break;
                }

                // More than one solution found?
                if (success > 1) {
                    //console.log('NON-THREADED result: not unique (success > 1)');
                    return sudokuUniqueResult.notUnique;
                }
            }
        }

        // Restore to original state.
        this.culledBoard[rp][cp] = 0;

        switch (success) {
            case 0:
                //console.log('NON-THREADED result: no solution (success switch)');
                return sudokuUniqueResult.noSolution;

            case 1:
                //console.log('NON-THREADED result: unique (success switch)');
                return sudokuUniqueResult.unique;

            default:
                // Won't happen, not unique
                //console.log('NON-THREADED result: not unique (success switch)');
                return sudokuUniqueResult.notUnique;
        }
    },

    /**
    * Return a string representation of the grid.
    * @method
    * @return {String}
    */
    toString: function (board) {
        var str = '';
        for (var i = 0; i < 9; i++) {
            //str += this.completeBoard[i].join(' ') + "\r\n";
            //str += this.completeBoard[i].join('');
            //str += this.culledBoard[i].join('');
            str += board[i].join('');
        }

        return str;
    },

    /**
    * Return the puzzle as an array, for example for saving
    * @method
    * @return {Array}
    */
    toArray: function (board) {
        var cells = [];
        for (var row = 0; row < board.length; row++) {
            for (var col = 0; col < board.length; col++)
                cells.push(board[row][col]);
        }

        return cells;
    },

    /**
    * Fill the puzzle from an array
    * @method
    * @param {Array} cells
    */
    fromArray: function (cells, boardToFill) {
        if (cells.length != 81)
            throw new Error('Array length is not 81');

        var arrayToReturn = [];

        for (var i = 0; i < 81; i++) {
            var row = Math.floor(i / 9);
            var col = i - (row * 9);

            boardToFill[row][col] = parseInt(cells[i]);
        }

        return arrayToReturn;
    },

    /**
    * Checks if a save game exists
    * @method
    */
    isSaveAvailable: function () {
        sudoku.savesAvailable = !($.totalStorage('sudokuJS.save') == null);

        return sudoku.savesAvailable;
    },

    /**
    * Saves the boards, difficulty, elapsed time and current date/time to local storage
    * @method
    */
    saveState: function () {
        // check if board is complete
        var completeBoard = sudoku.isPlayerBoardFilled() && sudoku.checkPlayerBoard();

        // don't want to save a already completed board
        if (!completeBoard) {
            var saveData = new Array();

            // get complete board exploded array (1 dimension, not 2 dimensional)
            var completeBoardArray = this.toArray(this.completeBoard);

            var numOfZeros = $.grep(completeBoardArray, function (elem) { return elem === 0; });

            // quick check to make sure there is a valid complete board
            if (completeBoardArray.length == 81 && numOfZeros.length != 81) {
                // see if board is filled and complete

                // save all boards (complete, player and culled), difficulty, time on puzzle and current date/time
                saveData.push(completeBoardArray);
                saveData.push(this.toArray(this.playerBoard));
                saveData.push(this.toArray(this.culledBoard));
                saveData.push(utilities.getJSONNotes());
                saveData.push(sudoku.difficulty);
                saveData.push(board.timeElapsedInSec);
                saveData.push((new Date()));

                // save to storage
                $.totalStorage('sudokuJS.save', saveData);

                this.savesAvailable = true;
            }
        } else {
            $.totalStorage('sudokuJS.save', null);
        }
    },

    /**
    * Reads the boards, difficulty, elapsed time and current date/time from local storage.  Afterwards, it calls the board view
    * @method
    */
    loadState: function () {
        var saveData = $.totalStorage('sudokuJS.save');

        if (saveData != null && saveData.length == 7) {
            // if this is the first load, initialize so that the timeElapsedInSec property can be set
            if (board == null || board.initialized == false) {
                board.initialize(menu.paper);
            }

            // load the boards, notes, difficulty and time from saveData array
            this.fromArray(saveData[0], this.completeBoard);
            this.fromArray(saveData[1], this.playerBoard);
            this.fromArray(saveData[2], this.culledBoard);
            this.notes = saveData[3];
            sudoku.difficulty = saveData[4];
            board.timeElapsedInSec = saveData[5];

            this.savesAvailable = true;
        } else {
            throw new Error('Error loading data from local storage');
        }
    }
};