import { put, select, takeEvery } from 'redux-saga/effects';
import { map, times } from 'lodash';

import { actions as boardsActions, selectors as boardsSelectors } from '../boards';
import { actions as gameActions, selectors as gameSelectors } from '../game';

import { CULL_COUNT, GIVEN_COUNT } from '../constants';
import { BOARD_TYPES } from '../../react/constants';

import * as BoardUtils from '../../game/board';
import * as Generator from '../../game/generator';
import { generate } from '../../game';

function* startGame(action) {
  try {
    const { difficulty } = action.payload;
    const cull = difficulty in CULL_COUNT ? CULL_COUNT[difficulty] : 42;
    const givenCount = difficulty in GIVEN_COUNT ? GIVEN_COUNT[difficulty] : 42;

    let generated = generate(givenCount);
    // let generated = Generator.generate(cull);
    let base = generated.base;
    let solution = generated.solution;
    let time = 0;

    let baseBoard = BoardUtils.createBoard(base, {
      difficulty,
      type: BOARD_TYPES.BASE
    });

    let completeBoard = BoardUtils.createBoard(solution, {
      difficulty,
      type: BOARD_TYPES.COMPLETE
    });

    yield put(boardsActions.SET_BOARD({
      boardType: BOARD_TYPES.COMPLETE,
      board: Object.assign({}, completeBoard)
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BOARD_TYPES.PLAYER,
      board: Object.assign({}, baseBoard, { type: BOARD_TYPES.PLAYER })
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BOARD_TYPES.BASE,
      board: Object.assign({}, baseBoard)
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BOARD_TYPES.DISPLAY,
      board: Object.assign({}, baseBoard)
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BOARD_TYPES.NOTES,
      board: map(times(81, n => []))
    }));

    yield put(boardsActions.SET_SOLVED(false));
    yield put(gameActions.START_GAME({ difficulty, time }));
  }
  catch(e) {
    console.error(e);
  }
}

function* watchStartGame() {
  yield takeEvery(gameActions.START_GAME_REQUEST.type, startGame);
}

export const sagas = {
  watchStartGame
};
