import { connect } from 'react-redux'

import Menu from '../components/Menu'
import { options, setOption, startGame, resumeGame } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  active: state.game.active,
  options: state.options.visible,
  paused: state.game.paused
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  showOptions: () => dispatch(setOption(options.VISIBLE, true)),
  startGame: difficulty => dispatch(startGame(difficulty)),
  resumeGame: () => dispatch(resumeGame()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
