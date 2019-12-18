import { connect } from 'react-redux'

import Timer from './component'

const mapStateToProps = (state, props) => ({
  active: state.game.active,
  paused: state.game.paused,
  time: state.game.time,
  startedAt: state.game.startedAt,
  stoppedAt: state.game.stoppedAt
});

export default connect(
  mapStateToProps
)(Timer);
