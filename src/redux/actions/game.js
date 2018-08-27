export const pauseGame = () => ({
  type: 'PAUSE_GAME'
});

export const startGame = (values) => ({
  type: 'SET_BOARD',
  boardType,
  values
});

export const stopGame = (boardType, row, col) => ({
  type: 'CLEAR_CELL',
  boardType,
  row,
  col
});

export const setCell = (boardType, row, col, value) => ({
  type: 'SET_CELL',
  boardType,
  row,
  col,
  value
});
