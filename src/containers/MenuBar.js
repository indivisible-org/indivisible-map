import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import * as selectionActions from '../state/selections/actions';

import { getDistance, getFilters, getLocation } from '../state/selections/selectors';
import { getCurrentIssueFocuses, getColorMap } from '../state/events/selectors';

import SearchBar from '../components/SearchBar';
import DistanceFilter from '../components/DistanceSlider';
import IssueFilter from '../components/IssueFilter';

class MenuBar extends React.Component {
  static isZipCode(query) {
    const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
    return query.match(zipcodeRegEx);
  }

  constructor(props) {
    super(props);
    this.state = {
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.distanceHandler = this.distanceHandler.bind(this);
    this.renderFilterBar = this.renderFilterBar.bind(this);
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  isState(query) {
    const { items } = this.props;
    return find(items, { state: query });
  }

  searchHandler(value) {
    const query = value.zipcode;
    const { resetSearchByZip } = this.props;
    if (!query) {
      resetSearchByZip();
    }
    const { searchByZip, searchByQueryString } = this.props;
    if (MenuBar.isZipCode(query)) {
      return searchByZip(value);
    }
    if (this.isState(query)) {
      return searchByQueryString({ filterBy: 'state', filterValue: query });
    }
    return searchByQueryString({ filterBy: 'title', filterValue: query });
  }

  distanceHandler(value) {
    const { setDistance } = this.props;
    return setDistance(value);
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

  render() {
    const {
      distance,
      items,
      location,
      resetSearchByZip,
      type,
    } = this.props;
    return (
      <div className="content-container-filters">
        <SearchBar
          submitHandler={this.searchHandler}
          resetSearchByZip={resetSearchByZip}
        />
        {this.renderFilterBar()}
        <DistanceFilter
          changeHandler={this.distanceHandler}
          distance={distance}
          hidden={!location.LAT}
        />
        <p>
          Viewing {items.length} {type}
        </p>
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
});

const mapDispatchToProps = dispatch => ({
  setTextFilter: text => dispatch(selectionActions.setTextFilter(text)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  searchByZip: zipcode => dispatch(selectionActions.getLatLngFromZip(zipcode)),
  changedFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setDistance: distance => dispatch(selectionActions.setDistance(distance)),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
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
  resetSearchByZip: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
