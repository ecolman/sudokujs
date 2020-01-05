import { connect } from 'react-redux'

import Fireworks from './component'
import { selectors as boardsSelectors } from '../../../../redux/boards';
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game';

const mapStateToProps = (state, props) => ({
  isActive: gameSelectors.isActive(state),
  isSolved: boardsSelectors.isSolved(state),
  showSolved: gameSelectors.getShowSolved(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  setShowSolved: show => dispatch(gameActions.SET_SHOW_SOLVED(show))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fireworks);
