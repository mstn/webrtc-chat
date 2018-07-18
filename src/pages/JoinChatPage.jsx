import React from 'react';

import T from 'prop-types';

import { FormattedMessage } from 'react-intl';

import toPairs from 'lodash/fp/toPairs';

import { Redirect } from 'react-router-dom';

import withConnection from '../state/withConnection';

import PeerList from '../components/PeerList/PeerList';
import ChatRequests from '../components/ChatRequests/ChatRequests';

class JoinChatPage extends React.Component {

  state = {
    goTo: undefined
  }

  componentDidMount() {
    this.fetchPeerListFromServer();
  }
  render() {

    const { connection } = this.props;

    if (this.state.goTo) {
      return <Redirect to={this.state.goTo} />
    }

    // the current client
    const self = connection.state.peerId;
    // the list of peers which are not the current client
    const peers = connection.state.peerIds.filter(peerId => peerId !== self);

    // list of open connections for the current client
    const connections = toPairs(connection.state.connections)
      .filter(([key, value]) => value.open);

    return (
      <React.Fragment>
        <h3>
          <FormattedMessage id="app.pages.joinChat.title" />
        </h3>
        <PeerList
          data={peers}
          loading={connection.state.loading}
          onPeerSelected={this.handlePeerSelected}
          onRefreshList={this.handleRefreshList}
        />
        <br /> <br />
        <ChatRequests
          loading={connection.state.connecting}
          data={connections}
          onChatSelected={this.handleChatSelected}
        />
      </React.Fragment>
    );
  }
  handlePeerSelected = (peerId) => {
    // connect to peer and then join the chat
    this.props.connection.join(peerId).then(connection => {
      this.setState({
        goTo: `/chat/${connection.id}`
      });
    });
  }
  handleChatSelected = (chatId) => {
    this.setState({
      goTo: `/chat/${chatId}`
    });
  }
  handleRefreshList = () => {
    this.fetchPeerListFromServer();
  }
  fetchPeerListFromServer = () => {
    this.props.connection.list();
  }
}

JoinChatPage.propTypes = {
  connection: T.shape({
    state: T.shape({
      connecting: T.bool.isRequired,
      loading: T.bool.isRequired,
      joining: T.bool.isRequired,
      peerId: T.string,
      peerIds: T.array.isRequired,
      connections: T.object.isRequired,
    })
  })
};

export default withConnection(JoinChatPage);
