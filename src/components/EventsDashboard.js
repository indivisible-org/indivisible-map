import React from 'react';
import { connect } from 'react-redux';
import MapView from './MapView';
import SideBar from './SideBar';
import selectEvents from '../state/events/selectors';

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

const mapStateToProps = (state) => {
  return {
    events: selectEvents(state.eventState.events, state.filterState), 
    featuresHome: state.eventState.featuresHome,
  };
};

export default connect(mapStateToProps)(EventsDashboard);
