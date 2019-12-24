import { connect } from 'react-redux'

import Selectors from './component'
import { BoardTypes, sizes } from '../../../../game/constants';
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../redux/boards';
import { selectors as optionsSelectors } from '../../../../redux/options';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  baseBoard: boardsSelectors.getBoard(state, BoardTypes.BASE),
  height: sizes.selector.height,
  selectedCellIndex: gameSelectors.getSelectedCell(state),
  selectorCellIndex: gameSelectors.getSelectorCell(state),
  isNumberFirst: optionsSelectors.isNumberFirst(state),
  width: sizes.selector.width
});

const mapDispatchToProps = (dispatch, props) => ({
  setCell: (row, col, value) => dispatch(boardsActions.SET_CELL({ row, col, value })),
  setSelector: index => dispatch(gameActions.SELECT_SELECTOR(index))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Selectors);
