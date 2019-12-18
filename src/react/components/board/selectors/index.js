import { connect } from 'react-redux'

import Selectors from './component'
//import { BoardTypes, setCell } from '../../redux/actions';

const mapStateToProps = (state, props) => ({
  active: state.game.active
});

// const mapDispatchToProps = (dispatch, props) => ({
//   onClick: () => dispatch(setCell(BoardTypes.PLAYER, props.row, props.col, 25))
// });

export default connect(
  mapStateToProps,
//  mapDispatchToProps
)(Selectors);
