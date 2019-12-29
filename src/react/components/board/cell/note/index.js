import { connect } from 'react-redux'

import Notes from './component'
import { BOARD_TYPES } from '../../../../constants';
import { actions as boardsActions, selectors as boardsSelectors } from '../../../../../redux/boards';
import { selectors as gameSelectors } from '../../../../../redux/game';

const mapStateToProps = (state, props) => {
  let notesBoard = boardsSelectors.getBoard(state, BOARD_TYPES.NOTES);

  return ({
    notes: notesBoard !== undefined ? notesBoard[props.index] : null,
    notesMode: gameSelectors.isNotesMode(state),
  });
}

export default connect(
  mapStateToProps
)(Notes);
