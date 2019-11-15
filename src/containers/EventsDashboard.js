/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import {
  getVisibleEvents,
  getColorMap,
  getEvents,
  getEventsByDistrict,
  getFilteredEvents,
  getNumberTownHallsVisible,
  getNumberTownHallsInDistrict,
} from '../state/events/selectors';
import {
  startSetEvents,
  updateColorMap,
} from '../state/events/actions';

import {
  getError,
  getDistance,
  getLocation,
  getFilterBy,
  getFilterValue,
  getSearchType,
  getDistrict,
  getIssueFilters,
  getSelectedState,
  getRsvpParams,
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
  }

  componentDidMount() {
    const {
      getInitialEvents,
      issueFilters,
      setInitialFilters,
    } = this.props;
    getInitialEvents()
      .then((returned) => {
        if (issueFilters === 'init') {
          setInitialFilters(returned);
        }
      });
  }

  renderTotal(items) {
    const { district, filterValue, numberTownHallsInDistrict, numberTownHallsVisible } = this.props;
    console.log(numberTownHallsInDistrict, numberTownHallsVisible)
    if (district) {
      return (
        <p className="event-count">
        Viewing {items.length} events in {filterValue}-{district}
        </p>);
    }
    return (<p className="event-count">Viewing {items.length} events <br />
      <span className="town-hall">{numberTownHallsVisible} Town Halls </span> and <span className="grassroots">{items.length - numberTownHallsVisible} grassroot events</span>
    </p>);
  }

  renderMap() {
    const {
      distance,
      district,
      visibleEvents,
      center,
      colorMap,
      urlParams,
      setLatLng,
      resetSelections,
      selectedUsState,
      filterBy,
      filterValue,
      searchType,
      searchByDistrict,
      filteredEvents,
      searchByQueryString,
      onColorMapUpdate,
    } = this.props;
    const searchTypeMapMap = {
      district: filteredEvents,
      proximity: visibleEvents,
    };
    let items;
    if (filterBy === 'state') {
      items = filteredEvents;
    } else {
      items = searchTypeMapMap[searchType];
    }

    if (!mapboxgl.supported()) {
      return (<WebGlError mapType="event" />);
    }
    return (<MapView
      items={items}
      center={center}
      selectedUsState={selectedUsState}
      colorMap={colorMap}
      onColorMapUpdate={onColorMapUpdate}
      district={district}
      type="events"
      filterByValue={{ [filterBy]: [filterValue] }}
      resetSelections={resetSelections}
      searchByDistrict={searchByDistrict}
      urlParams={urlParams}
      setLatLng={setLatLng}
      distance={distance}
      searchType={searchType}
      searchByQueryString={searchByQueryString}
    />);
  }

  render() {
    const {
      allEvents,
      center,
      visibleEvents,
      eventsByDistrict,
      colorMap,
      urlParams,
      resetSelections,
      searchType,
      filterBy,
      error,
    } = this.props;

    if (!allEvents.length) {
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
          urlParams={urlParams}
          searchType={searchType}
          type="events"
          resetSelections={resetSelections}
          filterBy={filterBy}
          location={center}
          error={error}
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
  error: getError(state),
  eventsByDistrict: getEventsByDistrict(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  filteredEvents: getFilteredEvents(state),
  issueFilters: getIssueFilters(state),
  searchType: getSearchType(state),
  selectedUsState: getSelectedState(state),
  urlParams: getRsvpParams(state),
  visibleEvents: getVisibleEvents(state),
  numberTownHallsVisible: getNumberTownHallsVisible(state),
  numberTownHallsInDistrict: getNumberTownHallsInDistrict(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialEvents: () => dispatch(startSetEvents()),
  onColorMapUpdate: colormap => dispatch(updateColorMap(colormap)),
  resetSearchByQueryString: () => dispatch(selectionActions.resetSearchByQueryString()),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  resetSelectionsExceptState: () => dispatch(selectionActions.resetSelectionsExceptState()),
  searchByDistrict: val => dispatch(selectionActions.searchByDistrict(val)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  searchByZip: zipcode => dispatch(selectionActions.getLatLngFromZip(zipcode)),
  searchHandler: (query, searchType) => dispatch(selectionActions.searchHandler(query, searchType, 'event')),
  setFilters: filters => dispatch(selectionActions.setIssueTypeFilters(filters)),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  setUsState: usState => dispatch(selectionActions.setUsState(usState)),
});

EventsDashboard.propTypes = {
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.number.isRequired,
  district: PropTypes.number,
  error: PropTypes.string,
  eventsByDistrict: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterBy: PropTypes.string,
  filterValue: PropTypes.string,
  filteredEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getInitialEvents: PropTypes.func.isRequired,
  issueFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onColorMapUpdate: PropTypes.func.isRequired,
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  selectedUsState: PropTypes.string,
  setInitialFilters: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  urlParams: PropTypes.string,
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

EventsDashboard.defaultProps = {
  center: null,
  district: null,
  error: '',
  filterBy: 'all',
  filterValue: [],
  selectedUsState: null,
  urlParams: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
