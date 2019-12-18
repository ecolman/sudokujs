import { connect } from 'react-redux'

import Notes from './component'
import { BoardTypes } from '../../../../../game/constants';
import { actions as boardsActions } from '../../../../../redux/boards';

const mapStateToProps = (state, props) => {
  return ({
    notes: state.boards[BoardTypes.NOTES] !== undefined ? state.boards[BoardTypes.NOTES][props.index] : null,
    notesMode: state.game.notesMode,
  });
}

const mapDispatchToProps = (dispatch, props) => ({
  addNote: value => dispatch(boardsActions.ADD_NOTE({
    row: props.row,
    col: props.col,
    value
  })),
  deleteNote: value => dispatch(boardsActions.DELETE_NOTE({
    row: props.row,
    col: props.col,
    value
  }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);
