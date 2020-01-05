import { put, select, takeEvery } from 'redux-saga/effects';

import { actions as boardsActions, selectors as boardsSelectors } from '../boards';
import { selectors as optionsSelectors } from '../options';
import { actions as gameActions, selectors as gameSelectors } from '../game'
import { checkCell } from '../../game/board';
import { isBoardValid } from '../../game/solver';
import { BOARD_TYPES } from '../../react/constants'
import { getCellIndex, getCellRelations, getElapsedTime } from '../../game/utilities';

function* setCell(action) {
  try {
    const { row, col, value } = action.payload;
    const baseBoard = yield select(boardsSelectors.getBoard, BOARD_TYPES.BASE);
    const completeBoard = yield select(boardsSelectors.getBoard, BOARD_TYPES.COMPLETE);
    const playerBoard = yield select(boardsSelectors.getBoard, BOARD_TYPES.PLAYER);
    const notesBoard = yield select(boardsSelectors.getBoard, BOARD_TYPES.NOTES);
    const notesMode = yield select(gameSelectors.isNotesMode);
    const isCorrect = completeBoard[row][col] === value;
    const isCellCorrect = playerBoard[row][col] === completeBoard[row][col];
    const isPrepopulated = !checkCell(baseBoard, row, col, 0);
    const cellIndex = getCellIndex(row, col);

    let wasSet = false;

    // don't set prepopulated or already correct cells
    if (!isPrepopulated) {
      const isFeedback = yield select(optionsSelectors.isFeedback);
      const isPenalty = yield select(optionsSelectors.isPenalty);

      if (notesMode) {
        // check if note exists and decide add/remove
        if (notesBoard[cellIndex].indexOf(value) > -1) {
          yield put(boardsActions.DELETE_NOTE({ row, col, value }));
        } else {
          yield put(boardsActions.ADD_NOTE({ row, col, value }));
        }
      } else if (isFeedback) {
        // feedback will let user know the entered number is wrong
        if (isCorrect) {
          yield put(boardsActions.SET_CELL_SUCCESS({ row, col, value }));
          wasSet = true;
        } else if (!isCellCorrect) {
          yield put(gameActions.SET_ERROR({
            index: cellIndex,
            penalty: isPenalty
          }));
        }
      } else {
        yield put(boardsActions.SET_CELL_SUCCESS({ row, col, value }));
        wasSet = true;
      }

      if (wasSet) {
        const isRemoveNotes = yield select(optionsSelectors.isRemoveNotes);

        yield put(boardsActions.SET_SHOW_NOTES({ row, col, value: false }));

        // remove note from row, col, and region of cell for value
        if (isRemoveNotes) {
          let cellRelations = getCellRelations(row, col);

          yield put(boardsActions.DELETE_CELLS_NOTE({ cells: cellRelations, value }));
        }

        const updatedPlayerBoard = yield select(boardsSelectors.getBoard, BOARD_TYPES.PLAYER);

        // check if board is valid and set solved flag
        if (isBoardValid(updatedPlayerBoard)) {
          yield put(boardsActions.SET_SOLVED(true));
          yield put(gameActions.SET_SHOW_SOLVED(true));

          const time = yield select(gameSelectors.getTime);
          const startedAt = yield select(gameSelectors.getStartedAt);
          const stoppedAt = yield select(gameSelectors.getStoppedAt);

          yield put(gameActions.SET_TIME(getElapsedTime(time, startedAt, stoppedAt)));
        }
      }
    }
  }
  catch(e) {
    console.error(e);
  }
}

function* watchSetCell() {
  yield takeEvery(boardsActions.SET_CELL_REQUEST.type, setCell);
}

export const sagas = {
  watchSetCell
};
