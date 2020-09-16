export const PENALTY_MS = 5000;
export const UPDATE_MS = 1000;
export const CELL_ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const NOTE_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const FADES_MS = {
  SLOW: 500,
  MEDIUM: 400,
  FAST: 300,
  FASTER: 200
};

export const BOARD_TYPES = {
  BASE: 'base',
  COMPLETE: 'complete',
  DISPLAY: 'display',
  PLAYER: 'player',
  NOTES: 'notes'
};

export const DIFFICULTIES = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert'
};

export const OPTIONS = {
  FEEDBACK: 'feedback',
  HIGHLIGHTING: 'highlighting',
  NUMBER_FIRST: 'numberFirst',
  PENALTY: 'penalty',
  REMOVE_NOTES: 'removeNotes',
  TIMER: 'timer',
  VISIBLE: 'visible'
};

export const SIZES = {
  CELL: {
    WIDTH: 60,
    HEIGHT: 50
  },
  SELECTOR: {
    WIDTH: 45,
    HEIGHT: 45
  }
};

export const MENU_BOARD = [
  [6, 0, 4, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 3, 0],
  [8, 0, 0, 0, 0, 0, 0, 0, 9],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 5],
  [0, 0, 0, 7, 0, 0, 0, 0, 0]
];
