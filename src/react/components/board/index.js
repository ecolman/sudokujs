import { connect } from 'react-redux'

import Board from './component'
import { BoardTypes, menuBoard } from '../../../game/constants';
import { actions as gameActions, selectors as gameSelectors } from '../../../redux/game';
import { selectors as boardsSelectors } from '../../../redux/boards';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  baseBoard: boardsSelectors.getBoard(state, BoardTypes.BASE),
  displayBoard: boardsSelectors.getBoard(state, BoardTypes.DISPLAY),
  menuBoard,
  paused: gameSelectors.isPaused(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  resumeGame: () =>  dispatch(gameActions.RESUME_GAME())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
