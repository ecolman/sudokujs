import { connect } from 'react-redux'

import Notes from './Notes'
import { addNote, BoardTypes, deleteNote } from '../../../../redux/actions';

const mapStateToProps = (state, ownProps) => {
  return ({
    notes: state.boards[BoardTypes.NOTES] !== undefined ? state.boards[BoardTypes.NOTES][ownProps.index] : null,
    notesMode: state.game.notesMode,
  });
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  addNote: value => dispatch(addNote(ownProps.row, ownProps.col, value)),
  deleteNote: value => dispatch(deleteNote(ownProps.row, ownProps.col, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);
