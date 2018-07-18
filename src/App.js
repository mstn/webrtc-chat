import React, { Component } from 'react';
import './App.css';

import { IntlProvider } from 'react-intl';

import { Route, Router, Switch } from 'react-router-dom';

import NotFoundPage from './pages/NotFoundPage';

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
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
      </IntlProvider>
    );
  }
}

export default App;
