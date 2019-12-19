import { connect } from 'react-redux'

import Notes from './component'
import { BoardTypes } from '../../../../../game/constants';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../../redux/boards';
import { selectors as gameSelectors } from '../../../../../redux/game';

const mapStateToProps = (state, props) => {
  let notesBoard = boardsSelectors.getBoard(state, BoardTypes.NOTES);

  return ({
    notes: notesBoard !== undefined ? notesBoard[props.index] : null,
    notesMode: gameSelectors.isNotesMode(state),
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
