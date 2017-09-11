import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import App from 'modules/app/containers/app'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'
import makePath from 'modules/routes/helpers/make-path'

import * as VIEWS from 'modules/routes/constants/views'
import * as COMPONENTS from 'modules/routes/constants/components'

const Routes = p => (
  <App>
    <Switch>
      <Route exact path={makePath(VIEWS.DEFAULT_VIEW)} component={COMPONENTS.Topics} />
      <Route path={makePath(VIEWS.MARKETS)} component={COMPONENTS.Markets} />
      <Route path={makePath(VIEWS.MARKET)} component={COMPONENTS.Market} />
      <Route path={makePath(VIEWS.AUTHENTICATION)} component={COMPONENTS.AuthLander} />
      <Route path={makePath(VIEWS.SIGNUP)} component={COMPONENTS.Signup} />
      <Route path={makePath(VIEWS.LOGIN)} component={COMPONENTS.Login} />
      <Route path={makePath(VIEWS.STYLE_SANDBOX)} component={COMPONENTS.StyleSandbox} />
      <AuthenticatedRoute path={makePath(VIEWS.FAVORITES)} component={COMPONENTS.Markets} />
      <AuthenticatedRoute path={makePath(VIEWS.MY_POSITIONS)} component={COMPONENTS.Portfolio} />
      <AuthenticatedRoute path={makePath(VIEWS.MY_MARKETS)} component={COMPONENTS.Portfolio} />
      <AuthenticatedRoute path={makePath(VIEWS.MY_REPORTS)} component={COMPONENTS.Portfolio} />
      <AuthenticatedRoute path={makePath(VIEWS.ACCOUNT)} component={COMPONENTS.Account} />
      <AuthenticatedRoute path={makePath(VIEWS.TRANSACTIONS)} component={COMPONENTS.Transactions} />
      <AuthenticatedRoute path={makePath(VIEWS.CREATE_MARKET)} component={COMPONENTS.CreateMarket} />
      <Redirect to={makePath(VIEWS.TOPICS)} />
    </Switch>
  </App>
)

export default Routes
