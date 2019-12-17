import { connect } from 'react-redux'

import Events from './Events'
import { addNote, BoardTypes, clearCell, deleteNote, selectCell, setCell } from '../../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  active: state.game.active,
  baseBoard: state.boards[BoardTypes.BASE],
  notesBoard: state.boards[BoardTypes.NOTES],
  notesMode: state.game.notesMode,
  selectedCell: state.boards.selectedCell
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  addNote: (row, col, value) => dispatch(addNote(row, col, value)),
  clearCell: (row, col) => dispatch(clearCell(row, col)),
  deleteNote: (row, col, value) => dispatch(deleteNote(row, col, value)),
  selectCell: index => dispatch(selectCell(index)),
  setCell: (row, col, value) => dispatch(setCell(row, col, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
