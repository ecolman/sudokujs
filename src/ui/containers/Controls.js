import { connect } from 'react-redux'

import Controls from '../components/Controls'
import { activateGame, deactivateGame, pauseGame, resumeGame } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  active: state.game.active,
  paused: state.game.paused
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  deactivateGame: () => dispatch(deactivateGame()),
  pauseGame: () => dispatch(pauseGame()),
  resumeGame: () => dispatch(resumeGame())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls);
