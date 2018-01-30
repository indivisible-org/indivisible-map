import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getEventsByDistance } from '../state/events/selectors';

import MapView from '../components/MapView';
import SideBar from '../components/SideBar';

class EventsDashboard extends React.Component {
  render() {
    const {
      events,
      featuresHome,
    } = this.props;
    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar items={events} />
        <MapView featuresHome={featuresHome} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  events: getEventsByDistance(state),
  featuresHome: state.events.featuresHome,
  getEventsByDistance,
});

EventsDashboard.propTypes = {
  events: PropTypes.shape({}).isRequired,
  featuresHome: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps)(EventsDashboard);
