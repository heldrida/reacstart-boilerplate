import React from 'react'
import { NOT_FOUND } from 'redux-first-router'
import AboutApi from 'modules/about'

const HomePanel = AboutApi.containers.HomePanel

const map = {
  'HOME': {
    path: '/',
    thunk: async (dispatch, getState) => {
      const request = await window.fetch(`//www.mocky.io/v2/59a1687b110000471164437a`)
      const data = await request.json()
      if (!data) {
        return dispatch({ type: NOT_FOUND })
      }
      dispatch({ type: 'DATA_FOUND', payload: data })
    },
    component: <HomePanel />
  },
  'ABOUT': {
    path: '/about',
    component: (<div>About component</div>)
  }
}

export default map
