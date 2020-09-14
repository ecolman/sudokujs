import { DIFFICULTIES } from '../components/constants';

export const CULL_COUNT = {
  [DIFFICULTIES.EASY]: 42,
  [DIFFICULTIES.MEDIUM]: 50,
  [DIFFICULTIES.HARD]: 58,
  // [DIFFICULTIES.EXPERT]: 66
  [DIFFICULTIES.EXPERT]: 20
};

export const GIVEN_COUNT = {
  [DIFFICULTIES.EASY]: 56,
  [DIFFICULTIES.MEDIUM]: 50,
  [DIFFICULTIES.HARD]: 46,
  [DIFFICULTIES.EXPERT]: 42
  //[DIFFICULTIES.EXPERT]: 80
};

export const gameDefaults = {
  active: false,
  notesMode: false,
  paused: false,
  loading: false,
  time: 0,
  penalties: 0,
  errorCell: -1,
  selectedCell: -1,
  selectorCell: -1,
  showSolved: false,
  startedAt: undefined,
  stoppedAt: undefined
}
