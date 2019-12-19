import { connect } from 'react-redux'

import Cell from './component'
import { BoardTypes, sizes } from '../../../../game/constants';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../redux/boards';
import { selectors as gameSelectors } from '../../../../redux/game';

const mapStateToProps = (state, props) => {
  let notesBoard = boardsSelectors.getBoard(state, BoardTypes.NOTES);

  return ({
    hasNotes: notesBoard !== undefined && notesBoard[props.index]
      ? notesBoard[props.index].length > 0
      : false,
    height: props.height || sizes.cell.height,
    isActive: gameSelectors.isActive(state),
    isPaused: gameSelectors.isPaused(state),
    notesMode: gameSelectors.isNotesMode(state),
    offsetX: props.offsetX || 0,
    offsetY: props.offsetY || 0,
    selected: boardsSelectors.getSelectedCell(state) === props.index,
    width: props.width || sizes.cell.width
  });
}

const mapDispatchToProps = (dispatch, props) => ({
  setCell: value => dispatch(boardsActions.SET_CELL({
    row: props.row,
    col: props.col,
    value
  })),
  selectCell: () => dispatch(boardsActions.SELECT_CELL(props.index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
