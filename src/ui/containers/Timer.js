import { connect } from 'react-redux'

import Timer from '../components/Timer'

const mapStateToProps = (state, ownProps) => ({
  active: state.game.active,
  time: state.game.time,
  startedAt: state.game.startedAt,
  stoppedAt: state.game.stoppedAt
});

export default connect(
  mapStateToProps
)(Timer);
