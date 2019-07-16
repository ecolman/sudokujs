export const options = {
  FEEDBACK: 'feedback',
  HIGHLIGHTING: 'highlighting',
  NUMBER_FIRST: 'numberFirst',
  PENALTY: 'penalty',
  REMOVE_NOTES: 'removeNotes',
  TIMER: 'timer',
  VISIBLE: 'visible'
}

export const setOption = (option, value) => {
  return ({
    type: 'SET_OPTION',
    option,
    value
  });
}
