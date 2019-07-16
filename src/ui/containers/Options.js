import { connect } from 'react-redux'

import Options from '../components/Options'
import { options, setOption } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  showOptions: () =>  dispatch(setOption(options.VISIBLE, true)),
  setOption: (option, value) => dispatch(setOption(option, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Options);
