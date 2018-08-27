'use strict';

import _ from 'lodash';
import Utils from './utilities';
import Board from './board';
import { boardTypes } from './constants';

class Game {
  constructor() {
    this.boards = {
      base: new Board(),
      player: new Board(),
      solved: new Board()
    }

    this.startTime = new Date().getTime();
    this.timePlayed = 0;
    this.completed = false;
  }

  checkBoardType(boardType) {
    return _.find(boardTypes, t => t === boardType) !== undefined;
  }
}

let game = new Game();

export default Game;
