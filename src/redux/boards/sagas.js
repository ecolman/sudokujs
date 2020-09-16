import { put, select, takeEvery } from 'redux-saga/effects';

import { actions as boardsActions, selectors as boardsSelectors } from '../boards';
import { selectors as optionsSelectors } from '../options';
import { actions as gameActions, selectors as gameSelectors } from '../game'
import { equals } from '../../game/board';
import { BOARD_TYPES } from '../../components/constants'
import { getCellIndex, getCellRelations, getElapsedTime } from '../../game/utilities';

function* setCell(action) {
  try {
    const { row, col, value } = action.payload;
    const baseCell = yield select(boardsSelectors.getCell, BOARD_TYPES.BASE, row, col);
    const isPaused = yield select(gameSelectors.isPaused);
    const isPrepopulated = baseCell ? baseCell !== 0 : false;
    let wasSet = false;

    // don't update cell when paused or prepopulated
    if (!isPaused && !isPrepopulated) {
      const playerBoardString = yield select(boardsSelectors.getBoardString, BOARD_TYPES.PLAYER);
      const cellIndex = getCellIndex(row, col);
      const completeCell = yield select(boardsSelectors.getCell, BOARD_TYPES.COMPLETE, row, col);
      const playerCell = yield select(boardsSelectors.getCell, BOARD_TYPES.PLAYER, row, col);
      const isNotesMode = yield select(gameSelectors.isNotesMode);
      const isFeedback = yield select(optionsSelectors.isFeedback);
      const regex = new RegExp(value, 'g' );
      const isAllUsed = (playerBoardString.match(regex) || []).length > 8;

      if (isNotesMode) {
        // check if note exists and decide add/remove
        const notesCell = yield select(boardsSelectors.getCellIndex, BOARD_TYPES.NOTES, cellIndex);

        if (notesCell.indexOf(value) > -1) {
          yield put(boardsActions.DELETE_NOTE({ row, col, value }));
        } else {
          yield put(boardsActions.ADD_NOTE({ row, col, value }));
        }
      } else if (isFeedback) {
        // feedback will let user know the entered number is wrong
        const isCorrect = completeCell === value;
        const isCellCorrect = playerCell === completeCell;
        const isPenalty = yield select(optionsSelectors.isPenalty);

        if (isCorrect && !isAllUsed) {
          yield put(boardsActions.SET_CELL_SUCCESS({ row, col, value }));
          wasSet = true;
        } else if (!isCellCorrect) {
          yield put(gameActions.SET_ERROR({
            index: cellIndex,
            penalty: isPenalty
          }));
        }
      } else if (!isAllUsed) {
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
        const completeBoard = yield select(boardsSelectors.getBoard, BOARD_TYPES.COMPLETE);

        // check if board is valid, set solved flag
        if (equals(updatedPlayerBoard, completeBoard)) {
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
