import { connect } from 'react-redux'

import Fireworks from './component'
import { selectors as boardsSelectors } from '../../../redux/boards';
import { actions as gameActions, selectors as gameSelectors } from '../../../redux/game';

const mapStateToProps = (state, props) => ({
  isActive: gameSelectors.isActive(state),
  isSolved: boardsSelectors.isSolved(state),
  showFireworks: gameSelectors.getShowFireworks(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  setShowFireworks: show => dispatch(gameActions.SET_SHOW_FIREWORKS(show))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fireworks);
