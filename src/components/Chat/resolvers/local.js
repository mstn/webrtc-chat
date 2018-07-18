const commands = {
  DATA(state, action) {
    return {
      messages: state.messages.concat({
        text: action.payload
      }),
      message: ''
    };
  },
  TYPING(state, action) {
    return {
      message: action.payload
    };
  }
}

export default commands;