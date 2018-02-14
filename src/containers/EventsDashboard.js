/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getVisbleEvents,
  getColorMap,
} from '../state/events/selectors';
import { startSetEvents } from '../state/events/actions';

import { getLocation, getRefCode } from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import SideBar from './SideBar';
import MapView from '../components/MapView';

class EventsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
    };
  }

  componentWillMount() {
    const {
      setRefCode,
    } = this.props;

    if (location.search) {
      setRefCode(location.search);
    }
  }

  componentDidMount() {
    const {
      initalEvents,
    } = this.props;
    initalEvents()
      .then((returned) => {
        this.props.setInitialFilters(returned);
        this.setState({ init: false });
      });
  }

  componentWillReceiveProps(newProps) {
    console.log('new Props:', newProps);
  }

  render() {
    const {
      visibleEvents,
      center,
      colorMap,
      refcode,
    } = this.props;
    if (this.state.init) {
      return null;
    }

    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar
          colorMap={colorMap}
          items={visibleEvents}
          refcode={refcode}
          type="events"
        />
        <MapView
          items={visibleEvents}
          center={center}
          colorMap={colorMap}
          type="events"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visibleEvents: getVisbleEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  refcode: getRefCode(state),
});

const mapDispatchToProps = dispatch => ({
  initalEvents: () => dispatch(startSetEvents()),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
});

EventsDashboard.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setRefCode: PropTypes.string,
};

EventsDashboard.defaultProps = {
  center: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
