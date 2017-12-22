import React from 'react';
import { BrowserRouter, Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import GroupsDashboard from '../components/GroupsDashboard';
import EventsDashboard from '../components/EventsDashboard';

export const history = createHistory();

const PageNotFound = () => (
  <div>
      404! - <Link to="/">Go home</Link>
  </div>
);

// app router imports all components
// for front end interface
// Components should be able to 
// access state.dataType at this point
const AppRouter = () => (
  // mapview
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

// inside each dashboard
  // map component
  // sidebar
    // filters
    // table
      // table cell

export default AppRouter;
