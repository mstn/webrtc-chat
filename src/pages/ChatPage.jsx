import React from 'react';

import { FormattedMessage } from 'react-intl';

import withConnection from '../state/withConnection';
import Chat from '../components/Chat/Chat';

class ChatPage extends React.Component {

  render() {
    const {
      connection,
      match: {
        params: {
          chatId
        }
      }
    } = this.props;

    const handle = connection.state.connections[chatId];

    if (!handle) {
      return (
        <b>
          <FormattedMessage id="app.pages.chat.chatDoesNotExist" />
        </b>
      );
    }

    return (
      <React.Fragment>
        <h3>
          <FormattedMessage id="app.pages.chat.title" />
        </h3>
        <Chat connection={handle} />
      </React.Fragment>
    );
  }

}

export default withConnection(ChatPage);