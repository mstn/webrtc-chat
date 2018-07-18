import React from 'react';

import T from 'prop-types';

import { FormattedMessage } from 'react-intl';

const PeerList = (props) => {
  const {
    loading,
    data,
    onRefreshList,
    onPeerSelected
  } = props;

  if (loading) {
    return (
      <FormattedMessage id="app.peerList.loadingPeers" />
    );
  }

  if (data.length === 0) {
    return (
      <React.Fragment>
        <FormattedMessage id="app.peerList.noPeers" />
        <button onClick={onRefreshList}>
          <FormattedMessage id="app.peerList.refresh" />
        </button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <h4><FormattedMessage id="app.peerList.availablePeers" /></h4>
      <ul>
        {
          data.map((peerId, index) => (
            <li key={index} onClick={() => onPeerSelected(peerId)}>{peerId}</li>
          ))
        }
      </ul>
      <button onClick={onRefreshList}>
        <FormattedMessage id="app.peerList.refresh" />
      </button>
    </React.Fragment>
  );
}

PeerList.propTypes = {
  loading: T.bool.isRequired,
  data: T.array.isRequired,
  onRefreshList: T.func.isRequired,
  onPeerSelected: T.func.isRequired
};

export default PeerList;
