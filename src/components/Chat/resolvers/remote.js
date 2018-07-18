/**
 * describe how a REMOTE command changes the local state
 */
const commands = {
  DATA(state, action) {
    return {
      messages: state.messages.concat({
        text: action.payload,
        remote: true
      })
    };
  },
  TYPING(state, action) {
    return {
      peerIsTyping: true
    };
  }
}

export default commands;