import React from 'react';

import T from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { withProps } from 'recompose';

import './Chat.css';

import isEmpty from 'lodash/fp/isEmpty';

import Bubble from './Bubble';
import Countdown from '../Countdown/Countdown';

import {
  parse,
  buildExecutor,
} from './utils';

import localResolvers from './resolvers/local';
import remoteResolvers from './resolvers/remote';

const exec = buildExecutor(localResolvers);
const execRemote = buildExecutor(remoteResolvers);

/**
 * Scroll to bottom based on this answer     
 * https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
 */

class Chat extends React.Component {

  state = {
    message: '',
    messages: [],
    peerIsTyping: false,
    isTerminated: false,
    peerNickname: undefined,
    error: undefined,
    countdown: undefined,
    countdownUrl: undefined
  };

  componentDidMount() {
    this.props.addOnDataListener(this.onMessage);
    this.props.addOnCloseListener(this.onClose);
    if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
    this.scrollToBottom();
    this.input.focus();
  }

  componentWillUnmount() {
    this.props.close();
  }

  componentDidUpdate() {
    if (this.state.peerIsTyping) {
      this.timeoutHandle = setTimeout(this.unsetPeerIsTyping, 1000);
    }
    this.scrollToBottom();
  }

  render() {
    const {
      messages,
      message,
      peerIsTyping,
      isTerminated,
      peerNickname,
      error,
      countdown,
      remoteError,
    } = this.state;

    const canSubmit = !isEmpty(message) && !isTerminated;

    return (
      <React.Fragment>
        {peerNickname && (
          <h3>
            <FormattedMessage id="app.chat.youAreChattingWith" values={{ peerNickname }} />
          </h3>
        )}
        <div className="chat-container">
          {messages.map((message, index) => <Bubble key={index} {...message} />)}
          {peerIsTyping && (
            <p>
              <FormattedMessage id="app.chat.peerIsTyping" />
            </p>
          )}
          <div ref={el => { this.bottom = el; }} />
        </div>
        <div className="chat-control">
          <input
            type="text"
            onChange={event => this.onTyping(event.target.value)}
            onKeyPress={this.handleKeyPress}
            value={this.state.message}
            ref={el => { this.input = el; }}
          />
          <button onClick={this.onSubmit} disabled={!canSubmit}>
            <FormattedMessage id="app.chat.send" />
          </button>
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
          {remoteError && (
            <p>
              <FormattedMessage id="app.chat.remoteCommandError" />
              <br />
              <span>
                {JSON.stringify(remoteError.action)}
              </span>
              <button onClick={this.onCloseErrorMessage}>
                <FormattedMessage id="app.chat.close" />
              </button>
            </p>
          )}
          {countdown && countdown > 0 && (
            <Countdown
              countdown={this.state.countdown}
              link={this.state.countdownUrl}
              onDone={this.handleCountdownDone}
            />
          )}
        </div>
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

  onCloseErrorMessage = () => {
    this.setState({
      remoteError: undefined
    });
  }

  handleKeyPress = event => {
    const { message, isTerminated } = this.state;
    const canSubmit = !isEmpty(message) && !isTerminated;
    if (event.key === 'Enter' && canSubmit) {
      this.onSubmit();
    }
  }

  handleCountdownDone = () => {
    this.setState({
      countdown: undefined,
      countdownUrl: undefined,
    });
  }

  dispatchRemote(action) {
    try {
      const updateState = execRemote(this.state, action);
      this.setState(updateState);
    } catch (error) {
      // TODO we can do better, just print the error for now
      console.error(error);
      this.setState({
        remoteError: {
          error,
          action,
        }
      });
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

  scrollToBottom = () => {
    this.bottom.scrollIntoView({ behavior: "smooth" });
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
