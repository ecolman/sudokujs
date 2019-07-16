import { connect } from 'react-redux'

import Cell from '../components/Cell'
import { setCell, sizes } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  col: ownProps.col,
  cssClass: ownProps.class,
  height: ownProps.height || sizes.cell.height,
  offsetX: ownProps.offsetX || 0,
  offsetY: ownProps.offsetY || 0,
  row: ownProps.row,
  value: ownProps.value,
  width: ownProps.width || sizes.cell.width
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(setCell(ownProps.row, ownProps.col, 6))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
