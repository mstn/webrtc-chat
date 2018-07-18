import findLastIndex from 'lodash/fp/findLastIndex';

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
  OOPS(state, action) {
    const index = findLastIndex(message => {
      return !!message.remote
    }, state.messages);
    if (index > -1) {
      const messages = [...state.messages];
      messages.splice(index, 1);
      return {
        messages,
      }
    }
    return {};
  },
}

export default commands;