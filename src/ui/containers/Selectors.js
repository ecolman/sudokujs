import { connect } from 'react-redux'

import Selectors from '../components/Selectors'
//import { BoardTypes, setCell } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  active: state.game.active
});

// const mapDispatchToProps = (dispatch, ownProps) => ({
//   onClick: () => dispatch(setCell(BoardTypes.PLAYER, ownProps.row, ownProps.col, 25))
// });

export default connect(
  mapStateToProps,
//  mapDispatchToProps
)(Selectors);
