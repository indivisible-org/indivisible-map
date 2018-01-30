import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GroupsDashboard from '../containers/GroupsDashboard';
import EventsDashboard from '../containers/EventsDashboard';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/events" component={EventsDashboard} />
        <Route path="/groups" component={GroupsDashboard} />
        <Route path="/" component={EventsDashboard} />
        {/* <Route component={PageNotFound} /> this should be default for unknown url location */}
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
