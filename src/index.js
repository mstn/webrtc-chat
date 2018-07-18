import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import bootstrap from './bootstrap';

// register some global variables
const version = 'webrtc_chat_version';
global[version] = process.env.REACT_APP_VERSION;

const root = document.getElementById('root');

bootstrap().then((initialState) => {
  ReactDOM.render(<App initialState={initialState} />, root);
});
