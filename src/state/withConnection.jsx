import React from 'react';
import { Subscribe } from 'unstated';
import Connection from './Connection';

const withConnection = (WrappedComponent) => {
  return class ConnectedComponent extends React.Component {
    render() {
      return (
        <Subscribe to={[Connection]}>
          {connection => <WrappedComponent {...this.props} connection={connection} />}
        </Subscribe>
      );
    }
  };
}

export default withConnection;
