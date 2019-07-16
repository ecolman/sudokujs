import Board from '../../game/board';
import Generator from '../../game/generator';
import Store from '../../redux';
import { BoardTypes, setBoard } from './boards';

export const difficulties = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert'
}

export const startGame = (difficulty = difficulties.EASY, time = 0) => {
  let board = Generator.generate(20);

  Store.dispatch(setBoard(BoardTypes.COMPLETE, new Board(board.solved.toString(), BoardTypes.COMPLETE)));
  Store.dispatch(setBoard(BoardTypes.BASE, new Board(board.base.toString(), BoardTypes.COMPLETE)));
  Store.dispatch(setBoard(BoardTypes.PLAYER, new Board(board.base.toString(), BoardTypes.COMPLETE)));
  Store.dispatch(setBoard(BoardTypes.DISPLAY, board.base.toDimensionalArray(), BoardTypes.DISPLAY));

  return ({
    difficulty,
    type: 'START_GAME',
    time,
    now: new Date().getTime()
  });
}

export const deactivateGame = () => ({
  type: 'DEACTIVATE_GAME',
  now: new Date().getTime()
});

export const pauseGame = () => ({
  type: 'PAUSE_GAME',
  now: new Date().getTime()
});

export const resumeGame = () => ({
  type: 'RESUME_GAME',
  now: new Date().getTime()
});

export const resetGame = () => ({
  type: 'RESET_GAME',
  now: new Date().getTime()
});
