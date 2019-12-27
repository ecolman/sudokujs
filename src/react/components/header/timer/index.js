import { connect } from 'react-redux'

import Timer from './component'
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game'
import { selectors as optionsSelectors } from '../../../../redux/options'

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  paused: gameSelectors.isPaused(state),
  penalties: gameSelectors.getPenalties(state),
  time: gameSelectors.getTime(state),
  timerEnabled: optionsSelectors.isTimer(state),
  startedAt: gameSelectors.getStartedAt(state),
  stoppedAt: gameSelectors.getStoppedAt(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  setTime: time => dispatch(gameActions.SET_TIME(time))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
