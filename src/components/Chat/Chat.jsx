import React from 'react';

import { FormattedMessage } from 'react-intl';

import './Chat.css';

import Bubble from './Bubble';

import {
  parse,
  buildExecutor,
} from './utils';

import localResolvers from './resolvers/local';

const exec = buildExecutor(localResolvers);

class Chat extends React.Component {

  state = {
    message: '',
    messages: [],
  };

  render() {
    const {
      messages,
      message,
    } = this.state;

    const canSubmit = message !== undefined

    return (
      <React.Fragment>
        <div className="chat-container">
          {messages.map((message, index) => <Bubble key={index} {...message} />)}
        </div>
        <input
          type="text"
          onChange={event => this.onTyping(event.target.value)}
          value={this.state.message}
        />
        <button onClick={this.onSubmit} disabled={!canSubmit}>
          <FormattedMessage id="app.chat.send" />
        </button>
      </React.Fragment>
    );
  }

  onTyping = (message) => {
    this.dispatch({
      type: 'TYPING',
      payload: message,
      time: Date.now()
    });
  }

  onSubmit = () => {
    const command = parse(this.state.message);
    this.dispatch(command);
  }

  dispatch(action) {
    this.setState(prevState => exec(prevState, action));
    // TODO every local actions should be send over to other peer
    // this.props.send(action);
  }

}

export default Chat;
