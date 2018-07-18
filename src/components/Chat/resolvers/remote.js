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
  },
  NICK(state, action) {
    return {
      peerNickname: action.payload
    };
  },
  THINK(state, action) {
    return {
      messages: state.messages.concat({
        text: action.payload,
        think: true,
        remote: true,
      })
    };
  },
}

export default commands;