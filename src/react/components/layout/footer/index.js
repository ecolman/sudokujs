import { connect } from 'react-redux'

import Footer from './component'
import { BoardTypes } from '../../../../game/constants';
import { actions as gameActions } from '../../../../redux/game';

const mapStateToProps = (state, props) => ({
  active: state.game.active,
  difficulty: state.boards[BoardTypes.BASE] ? state.boards[BoardTypes.BASE].difficulty : '',
  notesMode: state.game.notesMode
});

const mapDispatchToProps = (dispatch, props) => ({
  setNotesMode: isNotesMode => dispatch(gameActions.SET_NOTES_MODE(isNotesMode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
