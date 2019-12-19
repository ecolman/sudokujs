import { connect } from 'react-redux'

import Timer from './component'
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game'

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  paused: gameSelectors.isPaused(state),
  time: gameSelectors.getTime(state),
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
