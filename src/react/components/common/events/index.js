import { connect } from 'react-redux'

import Events from './component'
import { BoardTypes } from '../../../../game/constants';
import { actions as boardsActions } from '../../../../redux/boards';

const mapStateToProps = (state, props) => ({
  active: state.game.active,
  baseBoard: state.boards[BoardTypes.BASE],
  notesBoard: state.boards[BoardTypes.NOTES],
  notesMode: state.game.notesMode,
  selectedCell: state.boards.selectedCell
});

const mapDispatchToProps = (dispatch, props) => ({
  addNote: (row, col, value) => dispatch(boardsActions.ADD_NOTE({ row, col, value })),
  clearCell: (row, col) => dispatch(boardsActions.CLEAR_CELL({ row, col })),
  deleteNote: (row, col, value) => dispatch(boardsActions.DELETE_NOTE({ row, col, value })),
  selectCell: index => dispatch(boardsActions.SELECT_CELL(index)),
  setCell: (row, col, value) => dispatch(boardsActions.SET_CELL({ row, col, value }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
