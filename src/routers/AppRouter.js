import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import GroupsDashboard from '../components/GroupsDashboard';
import EventsDashboard from '../components/EventsDashboard';
import PageNotFound from '../components/PageNotFound';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/events" component={EventsDashboard} />
        <Route path="/groups" component={GroupsDashboard} />
        <Route path="/" component={EventsDashboard} />
        {/*<Route component={PageNotFound} /> this should be default for unknown url location*/}
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
