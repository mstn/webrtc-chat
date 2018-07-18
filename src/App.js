import React, { Component } from 'react';
import './App.css';

import { IntlProvider } from 'react-intl';

import { Route, Router, Switch, Redirect } from 'react-router-dom';

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
        <Router history={history}>
          <Switch>
            <Route path={'/join'} component={JoinChatPage} />
            <Route path={'/chat/:chatId'} component={ChatPage} />
            <Redirect exact={true} from="/" to="/join" />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </IntlProvider>
    );
  }
}

export default App;
