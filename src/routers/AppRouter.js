import React from 'react';
import { BrowserRouter, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import GroupsDashboard from '../components/GroupsDashboard';
import EventsDashboard from '../components/EventsDashboard';

export const history = createHistory();

const PageNotFound = () => (
  <div>
    <h2>404</h2>
    <ul>
      <li><Link to={`/events`}>Go to events</Link></li>
      <li><Link to={`/groups`}>Go to groups</Link></li>
    </ul>
  </div>
);

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/events" component={EventsDashboard} />
        <Route path="/groups" component={GroupsDashboard} />
        <Route component={PageNotFound} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
