import { connect } from 'react-redux'

import Cell from './component'
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../../redux/boards';

const mapStateToProps = (state, props) => ({
  showCellNotes: boardsSelectors.showCellNotes(state, props.index),
});

const mapDispatchToProps = (dispatch, props) => ({
  clearCell: () => dispatch(boardsActions.CLEAR_CELL({
    col: props.col,
    row: props.row
  })),
  deleteCellNotes: () => dispatch(boardsActions.DELETE_CELL_NOTES({
    col: props.col,
    row: props.row
  }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
