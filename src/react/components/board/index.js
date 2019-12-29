import { connect } from 'react-redux'

import Board from './component'
import { BOARD_TYPES } from '../../constants';
import { actions as gameActions, selectors as gameSelectors } from '../../../redux/game';
import { selectors as boardsSelectors } from '../../../redux/boards';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  baseBoard: boardsSelectors.getBoard(state, BOARD_TYPES.BASE),
  displayBoard: boardsSelectors.getBoard(state, BOARD_TYPES.DISPLAY),
  paused: gameSelectors.isPaused(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  resumeGame: () =>  dispatch(gameActions.RESUME_GAME())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
