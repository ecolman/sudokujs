import { connect } from 'react-redux'

import Cell from './component'
import { BoardTypes, sizes } from '../../../../game/constants';
import { actions as boardsActions } from '../../../../redux/boards';

const mapStateToProps = (state, props) => {
  return ({
    hasNotes: state.boards[BoardTypes.NOTES] !== undefined && state.boards[BoardTypes.NOTES][props.index]
      ? state.boards[BoardTypes.NOTES][props.index].length > 0
      : false,
    height: props.height || sizes.cell.height,
    isActive: state.game.active,
    notesMode: state.game.notesMode,
    offsetX: props.offsetX || 0,
    offsetY: props.offsetY || 0,
    selected: state.boards.selectedCell === props.index,
    width: props.width || sizes.cell.width
  });
}

const mapDispatchToProps = (dispatch, props) => ({
  setCell: value => dispatch(boardsActions.SET_CELL({ row: props.row, col: props.col, value })),
  selectCell: () => dispatch(boardsActions.SELECT_CELL(props.index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cell);
