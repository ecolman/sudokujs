import { getElapsedTime } from '../../game/utilities';

const game = (state = {
  active: false,
  paused: false,
  time: 0,
  startedAt: undefined,
  stoppedAt: undefined
}, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        active: true,
        time: action.time,
        startedAt: action.now,
        stoppedAt: undefined
      };

    case "DEACTIVATE_GAME":
        return {
          ...state,
          active: false,
          stoppedAt: action.now
        };

    case "PAUSE_GAME":
      return {
        ...state,
        paused: true,
        stoppedAt: action.now
      };

    case "RESUME_GAME":
        return {
          ...state,
          active: true,
          paused: false,
          time: getElapsedTime(state.time, state.startedAt, state.stoppedAt),
          startedAt: action.now,
          stoppedAt: undefined
        };

    case "RESET_GAME":
      return {
        ...state,
        active: false,
        paused: false,
        time: 0,
        startedAt: state.startedAt ? action.now : undefined,
        stoppedAt: state.stoppedAt ? action.now : undefined
      };

    default:
      return state;
  }
}

export default game;
