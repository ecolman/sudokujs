import { connect } from 'react-redux'

import Footer from './Footer'
import { BoardTypes, setNotesMode } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  active: state.game.active,
  difficulty: state.boards[BoardTypes.BASE] ? state.boards[BoardTypes.BASE].difficulty : '',
  notesMode: state.game.notesMode
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setNotesMode: isNotesMode => dispatch(setNotesMode(isNotesMode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
