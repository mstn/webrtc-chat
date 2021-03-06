import findLastIndex from 'lodash/fp/findLastIndex';

import { parse } from './parse';

/**
 * describe how a REMOTE command changes the local state
 */
const commands = {
  DATA(state, action) {
    return {
      messages: state.messages.concat({
        text: parse(action.payload),
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
        text: parse(action.payload),
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
  COUNTDOWN(state, action) {
    const args = action.payload.split(' ');
    if (args.length !== 2) {
      throw new Error('Malformed command');
    }
    const countdown = parseInt(args[0], 10);
    if (isNaN(countdown)) {
      throw new Error(`Malformed command: ${countdown} is not an Int`);
    }
    // TODO verify is string is url
    const countdownUrl = args[1];
    return {
      countdown,
      countdownUrl,
    };
  },
  HIGHLIGHT(state, action) {
    return {
      messages: state.messages.concat({
        text: parse(action.payload),
        highlight: true,
        remote: true,
      })
    };
  },
}

export default commands;