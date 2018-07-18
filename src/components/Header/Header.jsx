import React from 'react';

import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

const Header = (props) => {
  const { displayName } = props;
  return (
    <React.Fragment>
      <h2><Link to="/">WebRTC Chat</Link></h2>
      <p>
        <FormattedMessage
          id="app.header.welcomeMessage"
          values={{ displayName }}
        />
      </p>
    </React.Fragment>
  );
}

export default Header;
