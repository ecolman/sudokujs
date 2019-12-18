import { connect } from 'react-redux'

import Board from './component'
import { BoardTypes, menuBoard } from '../../../game/constants';
import { actions as gameActions } from '../../../redux/game';

const mapStateToProps = (state, props) => ({
  active: state.game.active,
  baseBoard: state.boards[BoardTypes.BASE],
  displayBoard: state.boards[BoardTypes.DISPLAY],
  menuBoard,
  paused: state.game.paused
});

const mapDispatchToProps = (dispatch, props) => ({
  resumeGame: () =>  dispatch(gameActions.RESUME_GAME())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
