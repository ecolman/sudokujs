import { connect } from 'react-redux'

import Menu from './component'
import { actions as gameActions, selectors as gameSelectors } from '../../../../redux/game'
import { actions as optionsActions, selectors as optionsSelectors } from '../../../../redux/options';
import { OPTIONS } from '../../../constants';

const mapStateToProps = (state, props) => ({
  isActive: gameSelectors.isActive(state),
  optionsVisible: optionsSelectors.isVisible(state),
  paused: gameSelectors.isPaused(state),
  stoppedAt: gameSelectors.getStoppedAt(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  showOptions: () => dispatch(optionsActions.SET_OPTION({ option: OPTIONS.VISIBLE, value: true })),
  startGame: difficulty => dispatch(gameActions.START_GAME_REQUEST({ difficulty })),
  resumeGame: () => dispatch(gameActions.RESUME_GAME()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
