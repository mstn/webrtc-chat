import findLastIndex from 'lodash/fp/findLastIndex';

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
      message: action.payload,
      error: undefined, // cancel error on typing
    };
  },
  NICK(state, action) {
    return {
      message: ''
    }; // do nothing
  },
  THINK(state, action) {
    return {
      messages: state.messages.concat({
        text: action.payload,
        think: true
      }),
      message: ''
    };
  },
  OOPS(state, action) {
    const index = findLastIndex(message => {
      return !message.remote
    }, state.messages);
    if (index > -1) {
      const messages = [...state.messages];
      messages.splice(index, 1);
      return {
        messages,
        message: ''
      }
    }
    return { message: '' };
  },
  COUNTDOWN(state, action) {
    return {
      message: ''
    }; // do nothing
  },
  HIGHLIGHT(state, action) {
    return {
      messages: state.messages.concat({
        text: action.payload,
        highlight: true
      }),
      message: ''
    };
  },
}

export default commands;