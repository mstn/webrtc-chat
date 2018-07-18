import React, { Component } from 'react';
import './App.css';

import { IntlProvider } from 'react-intl';

import { Route, Router, Switch, Redirect } from 'react-router-dom';

import { Provider } from 'unstated';

import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import JoinChatPage from './pages/JoinChatPage';

const en = require('./locale/en.json');
const messages = { en };

class App extends Component {
  render() {
    const {
      locale,
      history,
    } = this.props.initialState;
    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Provider>
          <Router history={history}>
            <Switch>
              <Route path={'/join'} component={JoinChatPage} />
              <Route path={'/chat/:chatId'} component={ChatPage} />
              <Redirect exact={true} from="/" to="/join" />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </Provider>
      </IntlProvider>
    );
  }
}

export default App;
