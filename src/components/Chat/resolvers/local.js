/**
 * describe how a LOCAL command changes the local state
 */
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
  },
  NICK(state, action) {
    return {
      message: ''
    }; // do nothing
  },
}

export default commands;