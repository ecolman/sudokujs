import { connect } from 'react-redux'

import Cell from './Cell'
import { addNote, BoardTypes, deleteNote, selectCell, setCell, sizes } from '../../../../redux/actions';

const mapStateToProps = (state, ownProps) => {
  return ({
    hasNotes: state.boards[BoardTypes.NOTES] !== undefined && state.boards[BoardTypes.NOTES][ownProps.index]
      ? state.boards[BoardTypes.NOTES][ownProps.index].length > 0
      : false,
    height: ownProps.height || sizes.cell.height,
    isActive: state.game.active,
    notesMode: state.game.notesMode,
    offsetX: ownProps.offsetX || 0,
    offsetY: ownProps.offsetY || 0,
    selected: state.boards.selectedCell === ownProps.index,
    width: ownProps.width || sizes.cell.width
  });
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  setCell: value => dispatch(setCell(ownProps.row, ownProps.col, value)),
  selectCell: () => dispatch(selectCell(ownProps.index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
