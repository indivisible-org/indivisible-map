import React from 'react';
import { connect } from 'react-redux';

import selectEvents from '../state/events/selectors';

import MapView from '../components/MapView';
import SideBar from '../components/SideBar';


class EventsDashboard extends React.Component {
  render() {
    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar items={this.props.events} />
        <MapView featuresHome={this.props.featuresHome} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  events: selectEvents(state.events.events, state.filters),
  featuresHome: state.events.featuresHome,
});

export default connect(mapStateToProps)(EventsDashboard);
