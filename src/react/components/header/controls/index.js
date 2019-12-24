import { connect } from 'react-redux'

import Controls from './component'
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  paused: gameSelectors.isPaused(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  deactivateGame: () => dispatch(gameActions.DEACTIVATE_GAME()),
  pauseGame: () => dispatch(gameActions.PAUSE_GAME()),
  resumeGame: () => dispatch(gameActions.RESUME_GAME())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);