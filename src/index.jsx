import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from 'frontend-platform-vi';
import {
  AppProvider,
  ErrorPage,
} from 'frontend-platform-vi/react';

import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import Header, { messages as headerMessages } from 'frontend-component-header-vi';
import Footer, { messages as footerMessages } from 'frontend-component-footer-vi';

import appMessages from './i18n';
import { ProfilePage, NotFoundPage } from './profile';
import configureStore from './data/configureStore';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={configureStore()}>
      <Header />
      <main>
        <Switch>
          <Route path="/u/:username" component={ProfilePage} />
          <Route path="/notfound" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
  handlers: {
    config: () => {
      mergeConfig({
        ENABLE_LEARNER_RECORD_MFE: (process.env.ENABLE_LEARNER_RECORD_MFE || false),
        LEARNER_RECORD_MFE_BASE_URL: process.env.LEARNER_RECORD_MFE_BASE_URL,
        COLLECT_YEAR_OF_BIRTH: process.env.COLLECT_YEAR_OF_BIRTH,
      }, 'App loadConfig override handler');
    },
  },
});
