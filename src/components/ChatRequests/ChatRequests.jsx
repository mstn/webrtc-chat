import React from 'react';

import T from 'prop-types';

import { FormattedMessage } from 'react-intl';

const ChatRequests = (props) => {
  const {
    data,
    loading,
    onChatSelected
  } = props;

  if (loading) {
    return (
      <FormattedMessage id="app.chatRequests.loadingRequests" />
    );
  }

  if (data.length === 0) {
    return (
      <FormattedMessage id="app.chatRequests.noRequests" />
    );
  }

  return (
    <React.Fragment>
      <h4>
        <FormattedMessage id="app.chatRequests.title" />
      </h4>
      <ul>
        {
          data.map(([key, value]) => (
            <li key={key}>
              {value.peer} @ {value.id}
              <button onClick={() => onChatSelected(value.id)}>
                <FormattedMessage id="app.chatRequests.join" />
              </button>
            </li>
          ))
        }
      </ul>
    </React.Fragment>
  );
}

ChatRequests.propTypes = {
  loading: T.bool.isRequired,
  data: T.array.isRequired,
  onChatSelected: T.func.isRequired
};


export default ChatRequests;
