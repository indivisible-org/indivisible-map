import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { union } from 'lodash';
import { Radio } from 'antd';
import * as selectionActions from '../state/selections/actions';

import { getDistance, getIssueFilters, getLocation, getSearchType } from '../state/selections/selectors';
import { getCurrentIssueFocuses, getColorMap } from '../state/events/selectors';

import SearchInput from '../components/SearchInput';
import DistanceFilter from '../components/DistanceSlider';
import IssueFilterTags from '../components/IssueFilterTags';

const RadioGroup = Radio.Group;
/* eslint-disable */
require('style-loader!css-loader!antd/es/radio/style/index.css');
/* eslint-enable */

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.distanceHandler = this.distanceHandler.bind(this);
    this.switchSearchType = this.switchSearchType.bind(this);
    this.renderSwitch = this.renderSwitch.bind(this);
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  onSearch(query) {
    const {
      resetSelections,
      resetSearchByQueryString,
      searchType,
      searchHandler,
      mapType,
    } = this.props;

    resetSearchByQueryString();

    if (!query) {
      return resetSelections();
    }
    return searchHandler(query, searchType, mapType);
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
          submitHandler={this.onSearch}
          searchType={searchType}
        />
        {this.renderSwitch()}
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
  selectedFilters: getIssueFilters(state),
  userSelections: state.selections,
});

const mapDispatchToProps = dispatch => ({
  changeSearchType: searchType => dispatch(selectionActions.changeSearchType(searchType)),
  onFilterChanged: filters => dispatch(selectionActions.setIssueTypeFilters(filters)),
  resetSearchByQueryString: () => dispatch(selectionActions.resetSearchByQueryString()),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByDistrict: district => dispatch(selectionActions.searchByDistrict(district)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  searchByZip: zipcode => dispatch(selectionActions.getLatLngFromZip(zipcode)),
  searchHandler: (query, searchType, mapType) => (
    dispatch(selectionActions.searchHandler(query, searchType, mapType))),
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
  resetSelections: PropTypes.func.isRequired,
  searchHandler: PropTypes.func.isRequired,
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
