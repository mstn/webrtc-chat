/**
 * parse the content of chat input field
 */
export function parse(content) {
  const tokens = content.split(' ');
  const match = /\/(.*)/.exec(tokens[0]);
  if (match) { // is a command
    const name = match[1];
    return {
      type: name.toUpperCase(),
      payload: content.substring(name.length + 2)
    };
  } else {
    return {
      type: 'DATA',
      payload: content
    };
  }
}

export function buildExecutor(commands) {
  return function exec(state, action) {
    const execute = commands[action.type];
    if (execute) {
      return execute(state, action);
    }
    throw new Error(`Unknown action ${action.type}`);
  }
}