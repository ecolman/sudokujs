export const BoardTypes = {
  COMPLETE: 'complete',
  CULLED: 'culled',
  PLAYER: 'player'
};

export const rows = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8);

export const clearBoard = boardType => ({
  type: 'CLEAR_BOARD',
  boardType
});

export const setBoard = (boardType, values) => ({
  type: 'SET_BOARD',
  boardType,
  values
});

export const clearCell = (boardType, row, col) => ({
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
