import { connect } from 'react-redux'

import Footer from './component'
import { BOARD_TYPES } from '../../constants';
import { selectors as boardsSelectors } from '../../../redux/boards';
import { actions as gameActions, selectors as gameSelectors } from '../../../redux/game';

const mapStateToProps = (state, props) => {
  const baseBoard = boardsSelectors.getBoard(state, BOARD_TYPES.BASE);

  return ({
    active: gameSelectors.isActive(state),
    difficulty: baseBoard ? baseBoard.difficulty : '',
    notesMode: gameSelectors.isNotesMode(state)
  })
};

const mapDispatchToProps = (dispatch, props) => ({
  setNotesMode: isNotesMode => dispatch(gameActions.SET_NOTES_MODE(isNotesMode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
