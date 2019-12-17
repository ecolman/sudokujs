import { map, times } from 'lodash';

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

  Store.dispatch(setBoard(BoardTypes.COMPLETE, new Board(board.solved.toString(), BoardTypes.COMPLETE, difficulty)));
  Store.dispatch(setBoard(BoardTypes.BASE, new Board(board.base.toString(), BoardTypes.COMPLETE, difficulty)));
  Store.dispatch(setBoard(BoardTypes.PLAYER, new Board(board.base.toString(), BoardTypes.COMPLETE, difficulty)));
  Store.dispatch(setBoard(BoardTypes.DISPLAY, board.base.toDimensionalArray(), BoardTypes.DISPLAY));
  Store.dispatch(setBoard(BoardTypes.NOTES, map(times(81, n => []))));

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

export const setNotesMode = isNotesMode => ({
  type: 'SET_NOTES_MODE',
  notesMode: isNotesMode
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
