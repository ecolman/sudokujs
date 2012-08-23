/**
* Runs board through a series of tests to ensure that it only has one solution
* @method
* @private
*/

self.addEventListener('message', function (e) {
    var board = e.data.board;
    var threadNum = e.data.threadNum;
    var successCount = e.data.successCount;

    //Find untouched location with most information
    var rp = 0, cp = 0;
    var Mp = null;
    var cMp = 10;

    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            // Is this spot unused?
            if (board[r][c] == 0) {
                // Set M of possible solutions
                var M = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                var cM = 0;

                // Remove used numbers in the vertical direction
                for (var a = 0; a < 9; a++) {
                    M[board[r][a]] = 0;
                }

                // Remove used numbers in the horizontal direction
                for (var b = 0; b < 9; b++) {
                    M[board[b][c]] = 0;
                }

                // very snazzy way to determine which 3x3 region cell belongs to
                // too bad I didn't come up with it =( (nice one Jani)
                var mgX = Math.floor(c / 3);
                var mgY = Math.floor(r / 3);

                var startCol = mgX * 3;
                var startRow = mgY * 3;

                var endCol = (mgX + 1) * 3;
                var endRow = (mgY + 1) * 3;

                for (var x = startRow; x < endRow; x++) {
                    for (var y = startCol; y < endCol; y++) {
                        M[board[x][y]] = 0;
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
        self.postMessage({ 'cmd': 'result', 'result': 'unique', 'board': board, 'successCount': successCount, 'threadNum': threadNum, 'finished': true });
        //self.postMessage({ 'cmd': 'console', 'message': 'thread ' + threadNum + ' cMp == 10' });

        return;
    }

    // Couldn't find a solution?
    if (cMp == 0) {
        self.postMessage({ 'cmd': 'result', 'result': 'no solution', 'board': board, 'successCount': successCount, 'threadNum': threadNum, 'finished': true });
        //self.postMessage({ 'cmd': 'console', 'message': 'thread ' + threadNum + ' cMp == 0' });

        return;
    }

    // Try elements
    if (Mp != null) {
        for (var i = 1; i < 10; i++) {
            if (Mp[i] != 0) {
                board[rp][cp] = Mp[i];

                //  self.postMessage({ 'cmd': 'console', 'message': 'thread ' + threadNum + ' testing' });
                self.postMessage({ 'cmd': 'test', 'board': board, 'successCount': successCount, 'threadNum': threadNum, 'finished': false });

                
                ////self.postMessage({ 'cmd': 'console', 'message': 'THREADED row: ' + rp + ' col: ' + cp + ' value: ' + Mp[i] });
            }
        }
    }

    if (successCount == 0) {
        self.postMessage({ 'cmd': 'result', 'result': 'no solution', 'board': board, 'successCount': successCount, 'threadNum': threadNum, 'finished': false });
        //self.postMessage({ 'cmd': 'console', 'message': 'thread ' + threadNum + ' success switch (success == 0)' });
    } else if (successCount == 1) {
        self.postMessage({ 'cmd': 'result', 'result': 'unique', 'board': board, 'successCount': successCount, 'threadNum': threadNum, 'finished': false });
        //self.postMessage({ 'cmd': 'console', 'message': 'thread ' + threadNum + ' success switch (success == 1)' });
    } else {
        // Won't happen, not unique
        self.postMessage({ 'cmd': 'result', 'result': 'not unique', 'board': board, 'successCount': successCount, 'threadNum': threadNum, 'finished': false });
        //self.postMessage({ 'cmd': 'console', 'message': 'thread ' + threadNum + ' success switch (success == ' + successCount + ')' });
    }
}, false);