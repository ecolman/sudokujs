import { connect } from 'react-redux'

import Cell from './component'
import { actions as boardsActions } from '../../../../../redux/boards';

const mapDispatchToProps = (dispatch, props) => ({
  clearCell: () => dispatch(boardsActions.CLEAR_CELL({
    col: props.col,
    row: props.row
  })),
  deleteCellNotes: () => dispatch(boardsActions.DELETE_NOTES({
    col: props.col,
    row: props.row
  }))
});

export default connect(
  null,
  mapDispatchToProps
)(Cell);
