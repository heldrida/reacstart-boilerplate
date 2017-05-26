import React from 'react'
import { render } from 'react-dom'
import { AppContainer as HotReload } from 'react-hot-loader'
import Root from './root'
import configureStore from './rootStore'
import { syncHistoryWithStore } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import { isBrowser } from 'reactatouille'

// include the stylesheet entry-point
isBrowser() && require('../sass/app.scss')

const store = configureStore()
const history = syncHistoryWithStore(createBrowserHistory(), store)

// render method for instantiation and Hot module reload
const renderApp = (RootComponent, store, history) => {
  let rootEl = document.getElementById('app')
  render(
    <HotReload>
      <RootComponent store={store} history={history} />
    </HotReload>,
    rootEl
  )
}

// create instance
renderApp(Root, store, history)

// Hot Module Replacement API
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./root', () => {
    const NextRoot = require('./root').default
    // (re)render, the updated app
    renderApp(NextRoot, store, history)
  })
}
