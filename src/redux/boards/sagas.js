import { put, select, takeEvery } from 'redux-saga/effects'

import { actions as boardsActions, selectors as boardsSelectors } from '../boards';
import { selectors as optionsSelectors } from '../options';
import { actions as gameActions } from '../game'
import { checkCell } from '../../game/board';
import { BoardTypes } from '../../game/constants';
import { getCellIndex } from '../../game/utilities';

function* setCell(action) {
  try {
    const { row, col, value } = action.payload;
    const baseBoard = yield select(boardsSelectors.getBoard, BoardTypes.BASE);

    const isPrepopulated = !checkCell(baseBoard, row, col, 0);

    if (!isPrepopulated) {
      const isFeedback = yield select(optionsSelectors.isFeedback);

      if (isFeedback) {
        const completeBoard = yield select(boardsSelectors.getBoard, BoardTypes.COMPLETE);
        const isCorrect = completeBoard[row][col] === value;

        if (isCorrect) {
          yield put(boardsActions.SET_CELL({ row, col, value }));
        } else {
          yield put(gameActions.SET_ERROR(getCellIndex(row, col)));
        }
      } else {
        yield put(boardsActions.SET_CELL({ row, col, value }));
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
