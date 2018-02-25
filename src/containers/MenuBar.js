import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { Switch } from 'antd';

import states from '../data/states';
import * as selectionActions from '../state/selections/actions';

import { getDistance, getFilters, getLocation, getSearchType } from '../state/selections/selectors';
import { getCurrentIssueFocuses, getColorMap } from '../state/events/selectors';

import SearchBar from '../components/SearchBar';
import DistanceFilter from '../components/DistanceSlider';
import IssueFilter from '../components/IssueFilterTags';

/* eslint-disable */
require('style-loader!css-loader!antd/es/switch/style/index.css');
/* eslint-enable */

class MenuBar extends React.Component {
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
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  searchHandler(value) {
    const query = value.zipcode;
    const {
      resetSelections,
      resetSearchByZip,
      resetSearchByQueryString,
    } = this.props;

    resetSearchByQueryString();

    if (!query) {
      return resetSelections();
    }
    const { searchByZip, searchByQueryString } = this.props;
    if (MenuBar.isZipCode(query)) {
      return searchByZip(value);
    }
    if (MenuBar.isState(query)) {
      resetSearchByZip();
      return searchByQueryString({ filterBy: 'state', filterValue: MenuBar.isState(query).USPS });
    }
    return searchByQueryString({ filterBy: 'title', filterValue: query });
  }

  distanceHandler(value) {
    const { setDistance } = this.props;
    return setDistance(value);
  }

  switchSearchType(val) {
    const { changeSearchType } = this.props;
    const searchType = val ? 'proximity' : 'district';
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
      <IssueFilter
        colorMap={colorMap}
        issues={issues}
        changedFilters={changedFilters}
        selectedFilters={selectedFilters}
      />
    );
  }

  renderTotal() {
    const {
      items,
      type,
    } = this.props;
    return type === 'events' ? (
      <p>
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
      <div className="content-container-filters">
        <SearchBar
          submitHandler={this.searchHandler}
        />
        {this.renderFilterBar()}
        <DistanceFilter
          changeHandler={this.distanceHandler}
          distance={distance}
          hidden={!location.LAT}
        />
        <div className="search-type-container">
          <span>Search Type: {searchType}</span>
          <Switch
            size="small"
            checkedChildren="proximity"
            unCheckedChildren="district"
            defaultChecked
            className="search-type-switch"
            onChange={this.switchSearchType}
          />
        </div>
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
  changedFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setDistance: distance => dispatch(selectionActions.setDistance(distance)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSearchByQueryString: () => dispatch(selectionActions.resetSearchByQueryString()),
  changeSearchType: searchType => dispatch(selectionActions.changeSearchType(searchType)),
});

MenuBar.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
