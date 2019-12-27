import { all, put, select, takeEvery } from 'redux-saga/effects';
import { map } from 'lodash';

import { actions as boardsActions, selectors as boardsSelectors } from '../boards';
import { selectors as optionsSelectors } from '../options';
import { actions as gameActions } from '../game'
import { checkCell } from '../../game/board';
import { BoardTypes } from '../../game/constants';
import { getCellIndex, getCellRelations } from '../../game/utilities';

function* setCell(action) {
  try {
    const { row, col, value } = action.payload;
    const baseBoard = yield select(boardsSelectors.getBoard, BoardTypes.BASE);
    const completeBoard = yield select(boardsSelectors.getBoard, BoardTypes.COMPLETE);
    const playerBoard = yield select(boardsSelectors.getBoard, BoardTypes.PLAYER);
    const isCorrect = completeBoard[row][col] === value;
    const isCellCorrect = playerBoard[row][col] === completeBoard[row][col];
    const isPrepopulated = !checkCell(baseBoard, row, col, 0);

    let wasSet = false;

    // don't set prepopulated or already correct cells
    if (!isPrepopulated) {
      const isFeedback = yield select(optionsSelectors.isFeedback);
      const isPenalty = yield select(optionsSelectors.isPenalty);
      const isRemoveNotes = yield select(optionsSelectors.isRemoveNotes);

      // feedback will let user know the entered number is wrong
      if (isFeedback) {
        if (isCorrect) {
          yield put(boardsActions.SET_CELL({ row, col, value }));
          wasSet = true;
        } else if (!isCellCorrect) {
          yield put(gameActions.SET_ERROR({
            index: getCellIndex(row, col),
            penalty: isPenalty
          }));
        }
      } else {
        yield put(boardsActions.SET_CELL({ row, col, value }));
        wasSet = true;
      }

      // remove note from row, col, and region of cell for value
      if (wasSet && isRemoveNotes) {
        let cellRelations = getCellRelations(row, col);

        yield all(map(cellRelations, cr => put(boardsActions.DELETE_NOTE({
          row: cr.row,
          col: cr.col,
          value
        }))));
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
