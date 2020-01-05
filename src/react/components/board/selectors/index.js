import { connect } from 'react-redux'

import Selectors from './component'
import { BOARD_TYPES } from '../../../constants';
import { SIZES } from '../../../constants';
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../redux/boards';
import { selectors as optionsSelectors } from '../../../../redux/options';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  baseBoard: boardsSelectors.getBoard(state, BOARD_TYPES.BASE),
  height: SIZES.SELECTOR.HEIGHT,
  selectedCellIndex: gameSelectors.getSelectedCell(state),
  selectorCellIndex: gameSelectors.getSelectorCell(state),
  isNotesMode: gameSelectors.isNotesMode(state),
  isNumberFirst: optionsSelectors.isNumberFirst(state),
  width: SIZES.SELECTOR.WIDTH
});

const mapDispatchToProps = (dispatch, props) => ({
  addNote: (row, col, value) => dispatch(boardsActions.ADD_NOTE({ row, col, value })),
  setCell: (row, col, value) => dispatch(boardsActions.SET_CELL_REQUEST({ row, col, value })),
  setSelector: index => dispatch(gameActions.SELECT_SELECTOR(index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Selectors);
