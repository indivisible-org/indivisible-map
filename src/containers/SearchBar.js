import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find, union } from 'lodash';
import { Switch } from 'antd';

import states from '../data/states';
import * as selectionActions from '../state/selections/actions';

import { getDistance, getFilters, getLocation, getSearchType } from '../state/selections/selectors';
import { getCurrentIssueFocuses, getColorMap } from '../state/events/selectors';

import SearchInput from '../components/SearchInput';
import DistanceFilter from '../components/DistanceSlider';
import IssueFilter from '../components/IssueFilterTags';

/* eslint-disable */
require('style-loader!css-loader!antd/es/switch/style/index.css');
/* eslint-enable */

class SearchBar extends React.Component {
  static isZipCode(query) {
    const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
    return query.match(zipcodeRegEx);
  }

  static isState(query) {
    return find(states, state =>
      state.USPS.toLowerCase().trim() === query.toLowerCase().trim()
    || state.Name.toLowerCase().trim() === query.toLowerCase().trim());
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.distanceHandler = this.distanceHandler.bind(this);
    this.switchSearchType = this.switchSearchType.bind(this);
    this.renderFilterBar = this.renderFilterBar.bind(this);
    this.renderTotal = this.renderTotal.bind(this);
    this.renderSwitch = this.renderSwitch.bind(this);
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  searchHandler(value) {
    const { query } = value;
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
        return searchByQueryString({ filterBy: 'state', filterValue: SearchBar.isState(query).USPS });
      }
      return searchByQueryString({ filterBy: 'title', filterValue: query });
    } else if (searchType === 'district') {
      const stateMatch = query.match(/([A-Z]|[a-z]){2}/g)[0];
      const districtMatch = query.match(/([0-9]{2})|([0-9]{1})/g)[0];
      if (stateMatch.length > 0 && districtMatch.length > 0) {
        const state = query.match(/([A-Z]|[a-z]){2}/g)[0];
        const district = Number(query.match(/([0-9]{2})|([0-9]{1})/g)[0]);
        return searchByDistrict({ state, district });
      }
    }
    return resetSelections();
  }

  distanceHandler(value) {
    const { setDistance } = this.props;
    return setDistance(value);
  }

  switchSearchType(val) {
    const {
      changeSearchType,
      issues,
      changedFilters,
    } = this.props;
    const searchType = val ? 'proximity' : 'district';
    if (searchType === 'district') {
      changedFilters(union(issues, ['Town Hall']));
    }
    changeSearchType(searchType);
  }

  renderFilterBar() {
    const {
      issues,
      changedFilters,
      selectedFilters,
      colorMap,
      type,
    } = this.props;
    if (type === 'groups') {
      return null;
    }
    return (
      <div className="input-group-filters">
        <IssueFilter
          colorMap={colorMap}
          issues={issues}
          changedFilters={changedFilters}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  }

  renderSwitch() {
    const {
      searchType,
      type,
    } = this.props;
    return type === 'events' ? (
      <div className="search-type-container">
        <span className="search-by-title">Search by </span>
        <Switch
          size="large"
          checkedChildren="proximity"
          unCheckedChildren="district"
          defaultChecked
          className="search-type-switch"
          onChange={this.switchSearchType}
          searchType={searchType}
        />
      </div>)
      : null;
  }

  renderTotal() {
    const {
      items,
      type,
    } = this.props;
    return type === 'events' ? (
      <p className="event-count">
        Viewing {items.length} {type}
      </p>)
      : null;
  }

  render() {
    const {
      distance,
      location,
      searchType,
    } = this.props;
    return (
      <div className="search-bar">
        <SearchInput
          submitHandler={this.searchHandler}
          searchType={searchType}
        />
        {this.renderSwitch()}
        {this.renderFilterBar()}
        <DistanceFilter
          changeHandler={this.distanceHandler}
          distance={distance}
          hidden={!location.LAT || searchType === 'district'}
        />
        {this.renderTotal()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSelections: state.selections,
  issues: getCurrentIssueFocuses(state),
  selectedFilters: getFilters(state),
  colorMap: getColorMap(state),
  distance: getDistance(state),
  location: getLocation(state),
  searchType: getSearchType(state),
});

const mapDispatchToProps = dispatch => ({
  setTextFilter: text => dispatch(selectionActions.setTextFilter(text)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  searchByZip: zipcode => dispatch(selectionActions.getLatLngFromZip(zipcode)),
  searchByDistrict: district => dispatch(selectionActions.searchByDistrict(district)),
  changedFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setDistance: distance => dispatch(selectionActions.setDistance(distance)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSearchByQueryString: () => dispatch(selectionActions.resetSearchByQueryString()),
  changeSearchType: searchType => dispatch(selectionActions.changeSearchType(searchType)),
});

SearchBar.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setTextFilter: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  searchByZip: PropTypes.func.isRequired,
  issues: PropTypes.arrayOf(PropTypes.string).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  changedFilters: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  distance: PropTypes.number.isRequired,
  setDistance: PropTypes.func.isRequired,
  location: PropTypes.PropTypes.shape({}).isRequired,
  resetSelections: PropTypes.func.isRequired,
  resetSearchByZip: PropTypes.func.isRequired,
  resetSearchByQueryString: PropTypes.func.isRequired,
  changeSearchType: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  searchType: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
