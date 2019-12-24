import { connect } from 'react-redux'

import Events from './component'
import { BoardTypes } from '../../../../game/constants';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../redux/boards';
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  baseBoard: boardsSelectors.getBoard(state, BoardTypes.BASE),
  notesBoard: boardsSelectors.getBoard(state, BoardTypes.NOTES),
  notesMode: gameSelectors.isNotesMode(state),
  selectedCell: gameSelectors.getSelectedCell(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  addNote: (row, col, value) => dispatch(boardsActions.ADD_NOTE({ row, col, value })),
  clearCell: (row, col) => dispatch(boardsActions.CLEAR_CELL({ row, col })),
  deleteNote: (row, col, value) => dispatch(boardsActions.DELETE_NOTE({ row, col, value })),
  selectCell: index => dispatch(gameActions.SELECT_CELL(index)),
  setCell: (row, col, value) => dispatch(boardsActions.SET_CELL_REQUEST({ row, col, value }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events);
