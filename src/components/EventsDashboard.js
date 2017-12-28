import React from 'react';
import { connect } from 'react-redux';
import MapView from './MapView';
import SideBar from './SideBar';
import Table from './Table';
import selectEvents from '../selectors/events';

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

// these should be passed down
const mapStateToProps = (state) => {
  return {
    events: selectEvents(state.eventState.events, state.filterState), // selectEvents(state.events, state.filters)
    featuresHome: state.eventState.featuresHome,
  };
};

export default connect(mapStateToProps)(EventsDashboard);
