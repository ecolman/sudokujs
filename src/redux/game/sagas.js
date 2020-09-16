import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { map, times } from 'lodash';

import { actions as boardsActions } from '../boards';
import { actions as gameActions } from '../game';

import { CULL_COUNT, GIVEN_COUNT } from '../constants';
import { BOARD_TYPES } from '../../components/constants';

import * as BoardUtils from '../../game/board';
import GeneratorWorker from '../../game/generator.worker';

function* startGameWorker(action) {
  try {
    const { difficulty } = action.payload;
    //const cull = difficulty in CULL_COUNT ? CULL_COUNT[difficulty] : 42;
    const givenCount = difficulty in GIVEN_COUNT ? GIVEN_COUNT[difficulty] : 42;

    yield put(gameActions.SET_LOADING(true));
    const generatedBoard = yield call(generateBoard, givenCount);
    yield fork(watchGeneratedBoard, generatedBoard, difficulty);
  }
  catch(e) {
    yield put(gameActions.SET_LOADING(false));
    console.error(e);
  }
}

// creates worker and passes message to fork
function generateBoard(givenCount) {
  const worker = new GeneratorWorker();
  let deferred;

  worker.onmessage = event => {
    if (deferred) {
      deferred.resolve(event.data);
      deferred = null;
      worker.terminate();
    }
  }

  return {
    nextMessage() {
      if (!deferred) {
        deferred = {};
        deferred.promise = new Promise(resolve => deferred.resolve = resolve);
      }

      worker.postMessage(givenCount)

      return deferred.promise;
    }
  }
}

function* watchGeneratedBoard(generatedBoards, difficulty) {
  try {
    let generated = yield call(generatedBoards.nextMessage);

    if (generated.base && generated.solution) {
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
      yield put(gameActions.SET_LOADING(false));
      yield put(gameActions.START_GAME({ difficulty, time }));
    } else {
      // wasn't able to generate board, take back to main menu
      yield put(gameActions.RESET_GAME());
    }
  }
  catch(e) {
    yield put(gameActions.RESET_GAME());
    console.error(e);
  }
}

function* watchStartGame() {
  yield takeEvery(gameActions.START_GAME_REQUEST.type, startGameWorker);
}

export const sagas = {
  watchStartGame
};
