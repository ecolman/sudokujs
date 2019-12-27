export const showLogs = false;
export const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const noteNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const penaltyMs = 5000;

export const menuBoard = [
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

export const sizes = {
  cell: {
    width: 60,
    height: 50
  },
  selector: {
    width: 45,
    height: 45
  }
};

export const difficulties = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  EXPERT: 'Expert'
};

export const cullCount = {
  [difficulties.EASY]: 42,
  [difficulties.MEDIUM]: 50,
  [difficulties.HARD]: 58,
  [difficulties.EXPERT]: 66,
}

export const BoardTypes = {
  BASE: 'base',
  COMPLETE: 'complete',
  DISPLAY: 'display',
  PLAYER: 'player',
  NOTES: 'notes'
};

export const options = {
  FEEDBACK: 'feedback',
  HIGHLIGHTING: 'highlighting',
  NUMBER_FIRST: 'numberFirst',
  PENALTY: 'penalty',
  REMOVE_NOTES: 'removeNotes',
  TIMER: 'timer',
  VISIBLE: 'visible'
};
