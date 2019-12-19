import { connect } from 'react-redux'

import Selectors from './component'
import { selectors as gameSelectors } from '../../../../redux/game';
//import { BoardTypes, setCell } from '../../redux/actions';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state)
});

// const mapDispatchToProps = (dispatch, props) => ({
//   onClick: () => dispatch(setCell(BoardTypes.PLAYER, props.row, props.col, 25))
// });

export default connect(
  mapStateToProps,
//  mapDispatchToProps
)(Selectors);
