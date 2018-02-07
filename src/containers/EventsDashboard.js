import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getEvents,
  getVisbleEvents,
  getColorMap,
} from '../state/events/selectors';

import { getLocation, getRefCode } from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import SideBar from './SideBar';
import MapView from '../components/MapView';

class EventsDashboard extends React.Component {
  componentDidMount() {
    this.props.setInitialFilters(this.props.allEvents);
  }

  componentWillMount() {
    const { setRefCode } = this.props;
    if (location.search) {
      console.log(location.search);
      setRefCode(location.search);
    }
    console.log(location);
  }
  render() {
    const {
      events,
      center,
      colorMap,
      refcode,
    } = this.props;
    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar items={events} colorMap={colorMap} refcode={refcode} />
        <MapView center={center} events={events} colorMap={colorMap} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allEvents: getEvents(state),
  events: getVisbleEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  refcode: getRefCode(state),
});

const mapDispatchToProps = dispatch => ({
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
});

EventsDashboard.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setInitialFilters: PropTypes.func.isRequired,
};

EventsDashboard.defaultProps = {
  center: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
