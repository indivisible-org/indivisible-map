/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getVisbleEvents,
  getColorMap,
  getEvents,
  getEventsByDistrict,
  getFilteredEvents,
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

import MapView from '../components/EventMap';
import WebGlError from '../components/WebGlError';

import SearchBar from './SearchBar';
import SideBar from './SideBar';

class EventsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderTotal = this.renderTotal.bind(this);
    this.renderMap = this.renderMap.bind(this);

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

  renderTotal(items) {
    const { district, filterValue } = this.props;
    if (district) {
      return (
        <p className="event-count">
        Viewing {items.length} events in {filterValue}-{district}
        </p>);
    }
    return (<p className="event-count">Viewing {items.length} events</p>);
  }

  renderMap() {
    const {
      distance,
      district,
      visibleEvents,
      center,
      colorMap,
      refcode,
      setLatLng,
      resetSelections,
      filterBy,
      filterValue,
      searchType,
      searchByDistrict,
      filteredEvents,
      searchByQueryString,
    } = this.props;

    const searchTypeMapMap = {
      district: filteredEvents,
      proximity: visibleEvents,
    };

    if (mapboxgl.supported()) {
      return (<WebGlError mapType="event" />);
    }

    return (<MapView
      items={searchTypeMapMap[searchType]}
      center={center}
      colorMap={colorMap}
      district={district}
      type="events"
      filterByValue={{ [filterBy]: [filterValue] }}
      resetSelections={resetSelections}
      searchByDistrict={searchByDistrict}
      refcode={refcode}
      setLatLng={setLatLng}
      distance={distance}
      searchType={searchType}
      searchByQueryString={searchByQueryString}
    />);
  }

  render() {
    const {
      allEvents,
      visibleEvents,
      eventsByDistrict,
      colorMap,
      refcode,
      resetSelections,
      searchType,
    } = this.props;

    if (this.state.init) {
      return null;
    }
    const searchTypeMapSideBar = {
      district: eventsByDistrict,
      proximity: visibleEvents,
    };

    return (
      <div className="events-container main-container">
        <h2 className="dash-title">Event Dashboard</h2>
        <SearchBar items={searchTypeMapSideBar[searchType]} mapType="event" />
        <SideBar
          renderTotal={this.renderTotal}
          colorMap={colorMap}
          items={searchTypeMapSideBar[searchType]}
          allItems={allEvents}
          refcode={refcode}
          type="events"
          resetSelections={resetSelections}
        />
        {this.renderMap()}
        <div className="footer" />
      </div>

    );
  }
}

const mapStateToProps = state => ({
  allEvents: getEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  distance: getDistance(state),
  district: getDistrict(state),
  eventsByDistrict: getEventsByDistrict(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  filteredEvents: getFilteredEvents(state),
  refcode: getRefCode(state),
  searchType: getSearchType(state),
  visibleEvents: getVisbleEvents(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialEvents: () => dispatch(startSetEvents()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByDistrict: val => dispatch(selectionActions.searchByDistrict(val)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
});

EventsDashboard.propTypes = {
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.number.isRequired,
  district: PropTypes.number,
  eventsByDistrict: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterBy: PropTypes.string,
  filterValue: PropTypes.string,
  filteredEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getInitialEvents: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  setRefCode: PropTypes.func.isRequired,
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

EventsDashboard.defaultProps = {
  center: null,
  district: null,
  filterBy: 'all',
  filterValue: [],
  refcode: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
