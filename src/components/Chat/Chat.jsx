import React from 'react';

import { FormattedMessage } from 'react-intl';

import './Chat.css';

import Bubble from './Bubble';

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

  }
  onSubmit = () => {

  }

}

export default Chat;
