import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getEvents,
  getVisbleEvents,
  getColorMap,
} from '../state/events/selectors';

import { getLocation } from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import SideBar from './SideBar';
import MapView from '../components/MapView';

class EventsDashboard extends React.Component {
  componentDidMount() {
    this.props.setInitialFilters(this.props.allEvents);
  }

  render() {
    const {
      events,
      featuresHome,
      center,
      colorMap,
    } = this.props;
    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar items={events} colorMap={colorMap} />
        <MapView center={center} featuresHome={featuresHome} events={events} colorMap={colorMap} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allEvents: getEvents(state),
  events: getVisbleEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
});

const mapDispatchToProps = dispatch => ({
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
});

EventsDashboard.propTypes = {
  center: PropTypes.shape({}),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  featuresHome: PropTypes.shape({}).isRequired,
  setInitialFilters: PropTypes.func.isRequired,
};

EventsDashboard.defaultProps = {
  center: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
