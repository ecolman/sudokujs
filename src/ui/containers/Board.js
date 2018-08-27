import { connect } from 'react-redux'

import Board from '../components/Board'
import { BoardTypes } from '../../redux/actions';

const mapStateToProps = (state, ownProps) => ({
  board: state.boards[BoardTypes.PLAYER]
});

export default connect(
  mapStateToProps
)(Board);
