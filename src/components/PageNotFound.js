import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => (
  <div>
    <h2>404</h2>
    <ul>
      <li><Link to="/events" href="/events">Go to events</Link></li>
      <li><Link to="/groups" href="/groups">Go to groups</Link></li>
    </ul>
  </div>
);

export default PageNotFound;
