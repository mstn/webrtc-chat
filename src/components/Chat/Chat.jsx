import React from 'react';

import T from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { withProps } from 'recompose';

import './Chat.css';

import Bubble from './Bubble';

import {
  parse,
  buildExecutor,
} from './utils';

import localResolvers from './resolvers/local';
import remoteResolvers from './resolvers/remote';

const exec = buildExecutor(localResolvers);
const execRemote = buildExecutor(remoteResolvers);

class Chat extends React.Component {

  state = {
    message: '',
    messages: [],
    peerIsTyping: false,
    isTerminated: false,
    peerNickname: undefined,
    error: undefined,
  };

  componentDidMount() {
    this.props.addOnDataListener(this.onMessage);
    this.props.addOnCloseListener(this.onClose);
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
  }

  componentWillUnmount() {
    this.props.close();
  }

  componentDidUpdate() {
    if (this.state.peerIsTyping) {
      this.timeoutHandle = setTimeout(this.unsetPeerIsTyping, 1000);
    }
  }

  render() {
    const {
      messages,
      message,
      peerIsTyping,
      isTerminated,
      peerNickname,
      error,
    } = this.state;

    const canSubmit = message !== undefined && !isTerminated;

    return (
      <React.Fragment>
        {peerNickname && (
          <h3>
            <FormattedMessage id="app.chat.youAreChattingWith" values={{ peerNickname }} />
          </h3>
        )}
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
        {peerIsTyping && (
          <p>
            <FormattedMessage id="app.chat.peerIsTyping" />
          </p>
        )}
        {isTerminated && (
          <p>
            <FormattedMessage id="app.chat.chatTerminatedByPeer" />
          </p>
        )}
        {error && (
          <p>
            <FormattedMessage id="app.chat.unknownCommand" />
          </p>
        )}
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

  onMessage = command => {
    this.dispatchRemote(command);
  }

  onClose = () => {
    this.setState({
      isTerminated: true
    });
  }

  dispatchRemote(action) {
    try {
      const updateState = execRemote(this.state, action);
      this.setState(updateState);
    } catch (error) {
      // it should not happen, just print error for debugging
      console.error(error);
    }
  }

  dispatch(action) {
    try {
      const updateState = exec(this.state, action);
      this.setState(updateState);
      // every local actions should be send over to other peer
      this.props.send(action);
    } catch (error) {
      this.setState({
        error
      });
    }
  }

  unsetPeerIsTyping = () => {
    this.setState({
      peerIsTyping: false
    });
  }

}

Chat.propTypes = {
  send: T.func.isRequired,
  addOnDataListener: T.func.isRequired,
  addOnCloseListener: T.func.isRequired,
  close: T.func.isRequired,
};

// inject into the class some utility methods to interact with connection object
const withSendAndReceive = withProps(props => ({
  send: (message) => props.connection.send(JSON.stringify(message)),
  addOnDataListener: (listener) => props.connection.on('data', (data) => {
    listener(JSON.parse(data));
  }),
  addOnCloseListener: (listener) => props.connection.on('close', () => {
    listener();
  }),
  close: () => props.connection.close()
}))

export default withSendAndReceive(Chat);
