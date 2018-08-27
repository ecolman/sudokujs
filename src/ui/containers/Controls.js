import { connect } from 'react-redux'

import Controls from '../components/Controls'

const mapStateToProps = (state, ownProps) => ({
  time: state.time || 0
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  //pause: () => dispatch(setCell(BoardTypes.PLAYER, ownProps.row, ownProps.col, 25))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);
