import store from 'store';

class State {
  constructor() {

  }

  isSaveAvailable() {
    return store.get('sudokujs') !== undefined;
  }

  saveState(board) {
    let save = {
      created: new Date().getTime(),
      boards: board.boards,
      notes: board.notes,
      difficulty: board.difficulty,
      startTime: board.startTime,
      timePlayed: board.timePlayed
    };

    store.set('sudokujs', save);
  }

  getState() {
    if (this.isSaveAvailable()) {
      return store.get('sudokujs');
    }
  }
}

var state = new State();

export default state;
