import Store from '../redux';
import Board from './board';
import Solver from './solver';

import { BoardTypes, clearBoard, setBoard, setCell, clearCell } from '../redux/actions'

let complete = new Board(null, BoardTypes.COMPLETE, Store);
let culled = new Board(null, BoardTypes.CULLED, Store);
let player = new Board(null, BoardTypes.PLAYER, Store);

Store.dispatch(setBoard(BoardTypes.PLAYER, '207008690005402000006007003000080000920050030000040000050600070060000529009000080'));
Store.dispatch(setBoard(BoardTypes.COMPLETE, '413658729987132546562479318235947681198526473674381295726895134359214867841763952'));


// Store.dispatch(setCell(BoardTypes.CULLED, 5, 3, 25));
// Store.dispatch(setCell(BoardTypes.PLAYER, 0, 3, 25));
// Store.dispatch(clearCell(BoardTypes.PLAYER, 0, 2));

// console.log(Solver.isBoardValid(player));
// console.log(Solver.isBoardValid(complete));

// let solved = Solver.solve(player);

// console.log(Solver.isBoardValid(board), solved.toString());
// console.log(`${Solver.lastSolution.steps} steps, ${Solver.lastSolution.time}ms`);


// console.log(player.getRow(4));
// console.log(player.setCell(4, 5, 4));
// console.log(player.getRow(4));
// console.log(player.toString());
