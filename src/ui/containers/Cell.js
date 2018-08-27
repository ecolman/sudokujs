import { connect } from 'react-redux'

import Cell from '../components/Cell'
import { BoardTypes, setCell } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  board: state.boards[BoardTypes.PLAYER]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(setCell(BoardTypes.PLAYER, ownProps.row, ownProps.col, 25))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
