import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import * as selectionActions from '../state/selections/actions';

import { getFilters } from '../state/selections/selectors';
import { getCurrentIssueFocuses, getColorMap } from '../state/events/selectors';

import SearchBar from '../components/SearchBar';
import IssueFilter from '../components/IssueFilter';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onSortChange = this.onSortChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  onSortChange(e) {
    const { setTextFilter, sortByChange } = this.props;
    sortByChange(e.target.value);
    setTextFilter('');
  }

  isZipCode(query) {
    const zipcodeRegEx = /^(\d{5}-\d{4}|\d{5}|\d{9})$|^([a-zA-Z]\d[a-zA-Z] \d[a-zA-Z]\d)$/g;
    return query.match(zipcodeRegEx);
  }

  isState(query) {
    const { items, searchByZip } = this.props;
    return find(items, { state: query });
  }

  searchHandler(value) {
    const query = value.zipcode;
    if (query === '') {
      // TODO: rest
    }
    const { searchByZip, setTextFilter, sortByChange } = this.props;
    if (this.isZipCode(query)) {
      return searchByZip(value);
    }
    if (this.isState(query)) {
      sortByChange({ filterBy: 'state', filterValue: query });
    }
  }

  render() {
    const {
      issues,
      userSelections,
      changedFilters,
      selectedFilters,
      colorMap,
    } = this.props;

    return (
      <div className="content-container-filters">
        <SearchBar submitHandler={this.searchHandler} />
        <IssueFilter
          colorMap={colorMap}
          issues={issues}
          changedFilters={changedFilters}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSelections: state.selections,
  issues: getCurrentIssueFocuses(state),
  selectedFilters: getFilters(state),
  colorMap: getColorMap(state),
});

const mapDispatchToProps = dispatch => ({
  setTextFilter: text => dispatch(selectionActions.setTextFilter(text)),
  sortByChange: val => dispatch(selectionActions.sortByChange(val)),
  searchByZip: zipcode => dispatch(selectionActions.getLatLngFromZip(zipcode)),
  changedFilters: filters => dispatch(selectionActions.setFilters(filters)),
});

MenuBar.propTypes = {
  setTextFilter: PropTypes.func.isRequired,
  sortByChange: PropTypes.func.isRequired,
  searchByZip: PropTypes.func.isRequired,
  userSelections: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
