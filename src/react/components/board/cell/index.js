import { connect } from 'react-redux'

import Cell from './component'
import { BOARD_TYPES } from '../../../constants';
import { SIZES } from '../../../constants';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../redux/boards';
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game';
import { selectors as optionsSelectors } from '../../../../redux/options';

const mapStateToProps = (state, props) => {
  let notesBoard = boardsSelectors.getBoard(state, BOARD_TYPES.NOTES);

  return ({
    hasNotes: notesBoard !== undefined && notesBoard[props.index]
      ? notesBoard[props.index].length > 0
      : false,
    height: props.height || SIZES.CELL.HEIGHT,
    isActive: gameSelectors.isActive(state),
    isHighlighted: optionsSelectors.isHighlighting(state) && props.value > 0 && boardsSelectors.getSelectedCellValue(state) === props.value,
    isNumberFirst: optionsSelectors.isNumberFirst(state),
    isPaused: gameSelectors.isPaused(state),
    isPenalty: optionsSelectors.isPenalty(state),
    notesMode: gameSelectors.isNotesMode(state),
    showCellNotes: boardsSelectors.showCellNotes(state, props.index),
    offsetX: props.offsetX || 0,
    offsetY: props.offsetY || 0,
    errored: gameSelectors.getErrorCell(state) === props.index,
    selected: gameSelectors.getSelectedCell(state) === props.index,
    selectorIndex: gameSelectors.getSelectorCell(state),
    width: props.width || SIZES.CELL.WIDTH
  });
}

const mapDispatchToProps = (dispatch, props) => ({
  setCell: value => dispatch(boardsActions.SET_CELL_REQUEST({
    col: props.col,
    row: props.row,
    value
  })),
  selectCell: () => dispatch(gameActions.SELECT_CELL(props.index)),
  clearError: () => dispatch(gameActions.SET_ERROR(-1))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
