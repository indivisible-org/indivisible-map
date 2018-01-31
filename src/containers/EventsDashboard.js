import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getEvents, getVisbleEvents } from '../state/events/selectors';
import { getLocation } from '../state/selections/selectors';

import * as selectionActions from '../state/selections/actions';

import SideBar from './SideBar';
import MapView from '../components/MapView';

class EventsDashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('event props', this.props.allEvents);
    this.props.setInitialFilters(this.props.allEvents);
  }

  render() {
    const {
      issues,
      events,
      featuresHome,
      center,
    } = this.props;
    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar items={events} />
        <MapView center={center} featuresHome={featuresHome} events={events} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allEvents: getEvents(state),
  events: getVisbleEvents(state),
  featuresHome: state.events.featuresHome,
  center: getLocation(state),
});

const mapDispatchToProps = dispatch => ({
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
});

EventsDashboard.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  featuresHome: PropTypes.shape({}).isRequired,
  center: PropTypes.shape({}),
};

EventsDashboard.defaultProps = {
  center: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
