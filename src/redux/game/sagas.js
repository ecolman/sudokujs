import { put, takeEvery } from 'redux-saga/effects';
import { map, times } from 'lodash';

import { actions as boardsActions } from '../boards';
import { actions as gameActions } from '../game';
import { BoardTypes, cullCount } from '../../game/constants';
import * as BoardUtils from '../../game/board';
import * as Generator from '../../game/generator';

function* startGame(action) {
  try {
    const { difficulty } = action.payload;

    //let board = Generator.generate(difficulty in cullCount ? cullCount[difficulty] : 42);
    let board = Generator.generate(20);
    console.log(`generated board with ${Generator.lastGeneration.steps} steps, taking ${Generator.lastGeneration.time / 1000} seconds`);
    let time = 0;

    let baseBoard = BoardUtils.createBoard(BoardUtils.toString(board.base), {
      difficulty,
      type: BoardTypes.BASE
    });

    let completeBoard = BoardUtils.createBoard(BoardUtils.toString(board.solved), {
      difficulty,
      type: BoardTypes.COMPLETE
    });

    yield put(boardsActions.SET_BOARD({
      boardType: BoardTypes.COMPLETE,
      board: Object.assign({}, completeBoard)
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BoardTypes.PLAYER,
      board: Object.assign({}, baseBoard, { type: BoardTypes.PLAYER })
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BoardTypes.BASE,
      board: Object.assign({}, baseBoard)
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BoardTypes.DISPLAY,
      board: BoardUtils.toDimensionalArray(board.base)
    }));

    yield put(boardsActions.SET_BOARD({
      boardType: BoardTypes.NOTES,
      board: map(times(81, n => []))
    }));

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
