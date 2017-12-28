import React from 'react';
import { connect } from 'react-redux';
import MapView from './MapView';
import EventsTable from './EventsTable';
// import { startSetEvents, startSetFeaturesHome } from '../actions/events';
// import getData from './logics/getData';
// import Point from '../logics/features';

class EventsDashboard extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    console.log(this.props);
    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <EventsTable />
        <MapView />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.eventState.events, // selectEvents(state.events, state.filters)
    featuresHome: state.eventState.featuresHome,
  };
};

export default connect(mapStateToProps)(EventsDashboard);
