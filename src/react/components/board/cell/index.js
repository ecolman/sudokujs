import { connect } from 'react-redux'

import Cell from './component'
import { BoardTypes, sizes } from '../../../../game/constants';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../redux/boards';
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game';
import { selectors as optionsSelectors } from '../../../../redux/options';

const mapStateToProps = (state, props) => {
  let notesBoard = boardsSelectors.getBoard(state, BoardTypes.NOTES);

  return ({
    hasNotes: notesBoard !== undefined && notesBoard[props.index]
      ? notesBoard[props.index].length > 0
      : false,
    height: props.height || sizes.cell.height,
    isActive: gameSelectors.isActive(state),
    isHighlighted: optionsSelectors.isHighlighting(state) && props.value > 0 && boardsSelectors.getSelectedCellValue(state) === props.value,
    isNumberFirst: optionsSelectors.isNumberFirst(state),
    isPaused: gameSelectors.isPaused(state),
    notesMode: gameSelectors.isNotesMode(state),
    offsetX: props.offsetX || 0,
    offsetY: props.offsetY || 0,
    errored: gameSelectors.getErrorCell(state) === props.index,
    selected: gameSelectors.getSelectedCell(state) === props.index,
    selectorIndex: gameSelectors.getSelectorCell(state),
    width: props.width || sizes.cell.width
  });
}

const mapDispatchToProps = (dispatch, props) => ({
  clearCell: () => dispatch(boardsActions.CLEAR_CELL({
    col: props.col,
    row: props.row
  })),
  deleteCellNotes: () => dispatch(boardsActions.DELETE_NOTES({
    col: props.col,
    row: props.row
  })),
  setCell: value => dispatch(boardsActions.SET_CELL_REQUEST({
    col: props.col,
    row: props.row,
    value
  })),
  selectCell: () => dispatch(gameActions.SELECT_CELL(props.index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
