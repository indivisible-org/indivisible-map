/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getVisbleEvents,
  getColorMap,
  getEvents,
  getEventsByDistrict,
} from '../state/events/selectors';
import { startSetEvents } from '../state/events/actions';

import {
  getDistance,
  getLocation,
  getRefCode,
  getFilterBy,
  getFilterValue,
  getSearchType,
  getDistrict,
} from '../state/selections/selectors';
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

    if (document.location.search) {
      setRefCode(document.location.search);
    }
  }

  componentDidMount() {
    const {
      getInitialEvents,
    } = this.props;
    getInitialEvents()
      .then((returned) => {
        this.props.setInitialFilters(returned);
        this.setState({ init: false });
      });
  }

  render() {
    const {
      allEvents,
      distance,
      district,
      visibleEvents,
      eventsByDistrict,
      center,
      colorMap,
      refcode,
      setLatLng,
      resetSelections,
      filterBy,
      filterValue,
      searchType,
    } = this.props;
    if (this.state.init) {
      return null;
    }
    const searchTypeMap = {
      proximity: visibleEvents,
      district: eventsByDistrict,
    };
    return (
      <div className="events-container">
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar
          colorMap={colorMap}
          items={searchTypeMap[searchType]}
          allItems={allEvents}
          refcode={refcode}
          type="events"
          resetSelections={resetSelections}
        />
        <MapView
          items={searchTypeMap[searchType]}
          center={center}
          colorMap={colorMap}
          district={district}
          type="events"
          filterByValue={{ [filterBy]: [filterValue] }}
          resetSelections={resetSelections}
          refcode={refcode}
          setLatLng={setLatLng}
          distance={distance}
          searchType={searchType}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visibleEvents: getVisbleEvents(state),
  eventsByDistrict: getEventsByDistrict(state),
  district: getDistrict(state),
  allEvents: getEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  refcode: getRefCode(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  distance: getDistance(state),
  searchType: getSearchType(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialEvents: () => dispatch(startSetEvents()),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
});

EventsDashboard.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.shape({}),
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setRefCode: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  getInitialEvents: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  filterBy: PropTypes.string,
  filterValue: PropTypes.arrayOf(PropTypes.string),
};

EventsDashboard.defaultProps = {
  center: null,
  refcode: '',
  filterBy: 'all',
  filterValue: [],
  distance: {},
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
