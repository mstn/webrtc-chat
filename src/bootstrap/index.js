/**
 * Bootstrap app global settings
 */
import { addLocaleData } from 'react-intl';

import { createBrowserHistory } from 'history';

// load locale data
const en = require('react-intl/locale-data/en');

function initLocaleData() {
  return Promise.resolve(addLocaleData(en))
    .catch((_) => null); // throw away catch messages
}

function initHistory() {
  return createBrowserHistory();
}

export default () => Promise.all([
  initHistory(),
  initLocaleData(),
  // Put other init here
  // ...
]).then((([history]) => ({
  history,
  locale: 'en' // set default locale to en
})))
