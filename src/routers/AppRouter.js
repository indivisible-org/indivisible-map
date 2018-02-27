import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GroupsDashboard from '../containers/GroupsDashboard';
import EventsDashboard from '../containers/EventsDashboard';

const AppRouter = () => (
  <BrowserRouter basename="/indivisible-map/">
    <div>
      <Switch>
        <Route path="/events" component={EventsDashboard} />
        <Route path="/groups" component={GroupsDashboard} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
