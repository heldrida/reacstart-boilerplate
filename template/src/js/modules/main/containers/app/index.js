import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replay } from '../../actions'
import { withRouter, Route } from 'react-router'
import Utils from 'utils'
import Config from 'config'
import * as actions from '../../actions'
import * as components from '../../components'
import * as constants from '../../constants'

const API = {
  actions,
  components,
  constants
  // containers, TODO: ** CIRCULAR DEPENDENCY, had to import directly, try improve? **
}

// include the stylesheet entry-point
Utils.helpers.isBrowser() && require('sass/app.scss')

class App extends Component {
  render () {
    return (
      <div>
        {
          Array.isArray(this.props.routes) && this.props.routes.map(route => <Route key={route.path} exact={route.exact} path={route.path} component={route.component} />)
        }
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    [API.constants.NAME]: state[API.constants.NAME]
  }
}

function matchDispatchToProps (dispatch) {
  return bindActionCreators({
    replay: replay
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(withRouter(App))