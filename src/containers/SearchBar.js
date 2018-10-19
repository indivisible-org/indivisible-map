import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find, union } from 'lodash';
import { Radio } from 'antd';
import states from '../data/states';
import * as selectionActions from '../state/selections/actions';

import { getDistance, getFilters, getLocation, getSearchType } from '../state/selections/selectors';
import { getCurrentIssueFocuses, getColorMap } from '../state/events/selectors';

import SearchInput from '../components/SearchInput';
import DistanceFilter from '../components/DistanceSlider';
import IssueFilterTags from '../components/IssueFilterTags';

const RadioGroup = Radio.Group;
/* eslint-disable */
require('style-loader!css-loader!antd/es/radio/style/index.css');
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
    this.renderSwitch = this.renderSwitch.bind(this);
  }

  componentWillMount() {
    const params = ['location'];
    const queries = params.reduce((acc, cur) => {
      const query = document.location.search.match(new RegExp(`[?&]${cur}[^&]*`));
      if (query && query[0].split('=').length > 1) {
        acc[cur] = query[0].split('=')[1];
      }
      return acc;
    }, {});

    // if (queries.location) {
    //   return this.searchHandler({
    //     query: queries.location,
    //   });
    // }
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  searchHandler(value) {
    const { query } = value;
    const {
      mapType,
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
      const filterBy = mapType === 'group' ? 'name' : 'title';
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
        return searchByDistrict({ district, state });
      }
    }
    return resetSelections();
  }

  distanceHandler(value) {
    const { setDistance } = this.props;
    return setDistance(value);
  }

  switchSearchType(e) {
    const searchType = e.target.value;
    const {
      changeSearchType,
      issues,
      onFilterChanged,
    } = this.props;
    if (searchType === 'district') {
      onFilterChanged(union(issues, ['Town Hall']));
    }
    changeSearchType(searchType);
  }

  renderFilterBar() {
    const {
      issues,
      onFilterChanged,
      selectedFilters,
      colorMap,
      mapType,
    } = this.props;
    if (mapType === 'group') {
      return null;
    }
    return (
      <div className="input-group-filters">
        <IssueFilterTags
          colorMap={colorMap}
          issues={issues}
          onFilterChanged={onFilterChanged}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  }

  renderSwitch() {
    const {
      searchType,
      mapType,
    } = this.props;
    if (mapType === 'group') {
      return null;
    }
    return (
      <div className="search-type-container">
        <span className="search-by-title">Search by </span>
        <RadioGroup onChange={this.switchSearchType} value={searchType}>
          <Radio value="proximity">proximity</Radio>
          <Radio value="district">district</Radio>
        </RadioGroup>
      </div>
    );
  }


  render() {
    const {
      distance,
      mapType,
      searchType,
    } = this.props;
    return (
      <div className="search-bar">
        <SearchInput
          mapType={mapType}
          submitHandler={this.searchHandler}
          searchType={searchType}
        />
        {this.renderSwitch()}
        {this.renderFilterBar()}
        <DistanceFilter
          changeHandler={this.distanceHandler}
          distance={distance}
          hidden={searchType === 'district'}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  colorMap: getColorMap(state),
  distance: getDistance(state),
  issues: getCurrentIssueFocuses(state),
  location: getLocation(state),
  searchType: getSearchType(state),
  selectedFilters: getFilters(state),
  userSelections: state.selections,
});

const mapDispatchToProps = dispatch => ({
  changeSearchType: searchType => dispatch(selectionActions.changeSearchType(searchType)),
  onFilterChanged: filters => dispatch(selectionActions.setFilters(filters)),
  resetSearchByQueryString: () => dispatch(selectionActions.resetSearchByQueryString()),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByDistrict: district => dispatch(selectionActions.searchByDistrict(district)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  searchByZip: zipcode => dispatch(selectionActions.getLatLngFromZip(zipcode)),
  setDistance: distance => dispatch(selectionActions.setDistance(distance)),
  setTextFilter: text => dispatch(selectionActions.setTextFilter(text)),
});

SearchBar.propTypes = {
  changeSearchType: PropTypes.func.isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.number.isRequired,
  issues: PropTypes.arrayOf(PropTypes.string).isRequired,
  mapType: PropTypes.string.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  resetSearchByQueryString: PropTypes.func.isRequired,
  resetSearchByZip: PropTypes.func.isRequired,
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  searchByZip: PropTypes.func.isRequired,
  searchType: PropTypes.string,
  selectedFilters: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string]).isRequired,
  setDistance: PropTypes.func.isRequired,
  setTextFilter: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  searchType: 'proximity',
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
