/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import states from '../data/states';
import {
  getVisbleEvents,
  getColorMap,
  getEvents,
  getEventsByDistrict,
  getFilteredEvents,
} from '../state/events/selectors';
import {
  startSetEvents,
  updateColorMap,
} from '../state/events/actions';

import {
  getError,
  getDistance,
  getLocation,
  getRefCode,
  getFilterBy,
  getFilterValue,
  getSearchType,
  getDistrict,
  getFilters,
  getSelectedState,
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
      setUsState,
    } = this.props;

    if (document.location.search) {
      setRefCode(document.location.search);
    }
    // const query = document.location.search.match(new RegExp('([?&])issue-filter[^&]*'));

    const params = ['location', 'issue-filter'];
    const queries = params.reduce((acc, cur) => {
      const query = document.location.search.match(new RegExp(`[?&]${cur}[^&]*`));
      if (query && query[0].split('=').length > 1) {
        acc[cur] = query[0].split('=')[1];
      }
      return acc;
    }, {});
    if (queries['issue-filter']) {
      this.setState({ issueFilter: decodeURI(queries['issue-filter']) });
    }
    if (queries.location) {
      if (find(states, ele => ele.USPS === queries.location)) {
        setUsState(queries.location);
      }
      return this.searchHandler({
        query: queries.location,
      });
    }
  }

  componentDidMount() {
    const {
      getInitialEvents,
    } = this.props;
    getInitialEvents()
      .then((returned) => {
        if (this.state.issueFilter) {
          this.props.setFilters(this.state.issueFilter);
          this.setState({ issueFilter: null });
        } else {
          this.props.setInitialFilters(returned);
        }
        this.setState({ init: false });
      });
  }

  searchHandler(value) {
    const {
      query,
    } = value;
    const {
      resetSelections,
      resetSearchByZip,
      resetSearchByQueryString,
      searchType,
      searchByZip,
      searchByQueryString,
      searchByDistrict,
    } = this.props;

    resetSearchByQueryString();

    if (!query) {
      return resetSelections();
    }
    if (searchType === 'proximity') {
      if (SearchBar.isZipCode(query)) {
        return searchByZip(value);
      }
      if (SearchBar.isState(query)) {
        resetSearchByZip();
        return searchByQueryString({
          filterBy: 'state',
          filterValue: SearchBar.isState(query).USPS,
        });
      }
      const filterBy = 'title';
      return searchByQueryString({
        filterBy,
        filterValue: query,
      });
    } else if (searchType === 'district') {
      const stateMatch = query.match(/([A-Z]|[a-z]){2}/g)[0];
      const districtMatch = query.match(/([0-9]{2})|([0-9]{1})/g)[0];
      if (stateMatch.length > 0 && districtMatch.length > 0) {
        const state = query.match(/([A-Z]|[a-z]){2}/g)[0];
        const district = Number(query.match(/([0-9]{2})|([0-9]{1})/g)[0]);
        return searchByDistrict({
          district,
          state,
        });
      }
    }
    return resetSelections();
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
      center,
      visibleEvents,
      eventsByDistrict,
      colorMap,
      refcode,
      resetSelections,
      searchType,
      filterBy,
      error,
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
  issueFilters: getFilters(state),
  refcode: getRefCode(state),
  searchType: getSearchType(state),
  selectedUsState: getSelectedState(state),
  visibleEvents: getVisbleEvents(state),
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
  setFilters: filters => dispatch(selectionActions.setFilters(filters)),
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
  onColorMapUpdate: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  resetSearchByQueryString: PropTypes.func.isRequired,
  resetSearchByZip: PropTypes.func.isRequired,
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  searchByZip: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  selectedUsState: PropTypes.string,
  setFilters: PropTypes.func.isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  setRefCode: PropTypes.func.isRequired,
  setUsState: PropTypes.func.isRequired,
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

EventsDashboard.defaultProps = {
  center: null,
  district: null,
  error: '',
  filterBy: 'all',
  filterValue: [],
  refcode: '',
  selectedUsState: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
