import { connect } from 'react-redux'
import { map, times } from 'lodash';

import Menu from './component'
import { actions as boardsActions } from '../../../redux/boards';
import { actions as gameActions } from '../../../redux/game'
import { actions as optionsActions } from '../../../redux/options';
import { BoardTypes, options } from '../../../game/constants';
import * as BoardUtils from '../../../game/board';
import Generator from '../../../game/generator';

const mapStateToProps = (state, props) => ({
  active: state.game.active,
  options: state.options.visible,
  paused: state.game.paused,
  stoppedAt: state.game.stoppedAt
});

const mapDispatchToProps = (dispatch, props) => ({
  showOptions: () => dispatch(optionsActions.SET_OPTION({ option: options.VISIBLE, value: true })),
  startGame: difficulty => {
    let board = Generator.generate(20);
    let time = 0;

    let baseBoard = BoardUtils.createBoard(BoardUtils.toString(board.base), {
      difficulty,
      type: BoardTypes.BASE
    });
    let completeBoard = BoardUtils.createBoard(BoardUtils.toString(board.solved), {
      difficulty,
      type: BoardTypes.COMPLETE
    });

    dispatch(boardsActions.SET_BOARD({
      boardType: BoardTypes.COMPLETE,
      board: Object.assign({}, completeBoard)
    }));
    dispatch(boardsActions.SET_BOARD({
      boardType: BoardTypes.BASE,
      board: Object.assign({}, baseBoard)
    }));
    dispatch(boardsActions.SET_BOARD({
      boardType: BoardTypes.PLAYER,
      board: Object.assign({}, baseBoard, { type: BoardTypes.PLAYER })
    }));
    dispatch(boardsActions.SET_BOARD({
      boardType: BoardTypes.DISPLAY,
      board: BoardUtils.toDimensionalArray(board.base)
    }));
    dispatch(boardsActions.SET_BOARD({
      boardType: BoardTypes.NOTES,
      board: map(times(81, n => []))
    }));

    dispatch(gameActions.START_GAME({ difficulty, time }));
  },
  resumeGame: () => dispatch(gameActions.RESUME_GAME()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
