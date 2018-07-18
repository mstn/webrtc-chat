import React from 'react';

import { FormattedMessage } from 'react-intl';

import Header from '../components/Header/Header';

import withConnection from '../state/withConnection';

const Layout = (WrappedComponent) => {
  return withConnection(class LayoutComponent extends React.Component {
    render() {
      const { connection } = this.props;

      if (connection.state.connecting) {
        return <b><FormattedMessage id="app.layout.connecting" /></b>;
      }

      return (
        <React.Fragment>
          <Header displayName={connection.state.peerId} />
          <WrappedComponent {...this.props} />
        </React.Fragment>
      );
    }
  });
}

export default Layout;
