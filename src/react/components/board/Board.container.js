import { connect } from 'react-redux'

import Board from './Board'
import { BoardTypes, menuBoard, resumeGame } from '../../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  active: state.game.active,
  baseBoard: state.boards[BoardTypes.BASE],
  displayBoard: state.boards[BoardTypes.DISPLAY],
  menuBoard,
  paused: state.game.paused
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  resumeGame: () =>  dispatch(resumeGame())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
