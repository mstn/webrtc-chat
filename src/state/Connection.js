import { Container } from 'unstated';

import Peer from 'peerjs';

const SERVER_HOST = process.env.REACT_APP_SERVER || 'localhost';
const SERVER_PORT = process.env.REACT_APP_PORT || 9000;
const DEBUG_LEVEL = 3;

/**
 * ConnectionContainer keeps the state of a connection with a WebRTC signalling server
 * 
 *    connecting = true iff the client is getting a peerId from server
 *    loading    = true iff the client is connected and is getting a list of peers from server
 *    joining    = true iff the client is connected and is trying to connect with a peer
 *    
 *    peerId, the id of the current client
 *    peerIds, the list of peers from server
 *    connection, established connections between client and other peers
 */
class ConnectionContainer extends Container {

  peer = new Peer({
    host: SERVER_HOST,
    port: SERVER_PORT,
    debug: DEBUG_LEVEL,
    path: 'peerjs'
  });

  state = {
    connecting: true,
    loading: true,
    joining: false,
    peerId: undefined,
    peerIds: [],
    connections: {},
  };

  constructor() {
    super();

    // register the peerId from server
    this.peer.on('open', peerId => {
      this.setState({
        connecting: false,
        peerId,
      })
    });

    // the client receive a new connection request from a peer
    this.peer.on('connection', connection => {
      connection.on('open', () => {
        this.setState({
          connections: {
            ...this.state.connections,
            [connection.id]: connection
          },
        });
      });
    });
  }

  /**
   * get the list of peers
   */
  list() {
    return new Promise(resolve => {
      this.setState({
        loading: true
      }, () => {
        this.peer.listAllPeers(peerIds => {
          this.setState({
            loading: false,
            peerIds
          }, () => resolve(peerIds))
        });
      });
    });
  }

  /**
   * establish a connection with a peer
   * 
   * @param peerId an existing peerId
   */
  join(peerId) {
    return new Promise(resolve => {
      this.setState({
        joining: true
      }, () => {
        const connection = this.peer.connect(peerId);
        this.setState({
          joining: false,
          connections: {
            ...this.state.connections,
            [connection.id]: connection
          },
        }, () => resolve(connection));
      });
    });
  }

}

export default ConnectionContainer;
