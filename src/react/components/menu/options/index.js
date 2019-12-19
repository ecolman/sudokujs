import { connect } from 'react-redux'

import Options from './component'
import { actions as optionsActions, selectors as optionsSelectors } from '../../../../redux/options';
import { selectors as gameSelectors } from '../../../../redux/game'
import { options } from '../../../../game/constants';

const mapStateToProps = (state, props) => ({
  active: gameSelectors.isActive(state),
  options,
  feedback: optionsSelectors.isFeedback(state),
  highlighting: optionsSelectors.isHighlighting(state),
  numberFirst: optionsSelectors.isNumberFirst(state),
  penalty: optionsSelectors.isPenalty(state),
  removeNotes: optionsSelectors.isRemoveNotes(state),
  timer: optionsSelectors.isTimer(state),
  optionsVisible: optionsSelectors.isVisible(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  showOptions: () =>  dispatch(optionsActions.SET_OPTION({
    option: options.VISIBLE,
    value: true
  })),
  setOption: (option, value) => dispatch(optionsActions.SET_OPTION({ option, value }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Options);
