const options = (state = {
  feedback: false,
  highlighting: false,
  removeNotes: false,
  numberFirst: false,
  penalty: false,
  timer: true,
  visible: false
}, action) => {
  switch (action.type) {
    case 'SET_OPTION':
      if (action.option && action.option in state) {
        return {
          ...state,
          [action.option]: action.value
        }
      }

    default:
      return state;
  }
}

export default options;
