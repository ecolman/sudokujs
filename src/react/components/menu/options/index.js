import { connect } from 'react-redux'

import Options from './component'
import { actions as optionsActions } from '../../../../redux/options';
import { options } from '../../../../game/constants';

const mapStateToProps = (state, props) => ({
  active: state.game.active,
  options,
  feedback: state.options.feedback,
  highlighting: state.options.highlighting,
  numberFirst: state.options.numberFirst,
  penalty: state.options.penalty,
  removeNotes: state.options.removeNotes,
  timer: state.options.timer,
  optionsVisible: state.options.visible
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
