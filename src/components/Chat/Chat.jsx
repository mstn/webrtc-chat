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
        {peerIsTyping && (
          <p>Peer is typing</p>
        )}
        {isTerminated && (
          <p>Chat terminated by your peer</p>
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
    this.setState(prevState => execRemote(prevState, action));
  }

  dispatch(action) {
    this.setState(prevState => exec(prevState, action));
    // every local actions should be send over to other peer
    this.props.send(action);
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
