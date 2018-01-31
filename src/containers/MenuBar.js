import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as selectionActions from '../state/selections/actions';

import { getFilters } from '../state/selections/selectors';
import { getCurrentIssueFocuses } from '../state/events/selectors';

import SearchBar from '../components/SearchBar';
import IssueFilter from '../components/IssueFilter';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onSortChange = this.onSortChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  onSortChange(e) {
    const { setTextFilter, sortByChange } = this.props;
    sortByChange(e.target.value);
    setTextFilter('');
  }

  render() {
    const {
      issues,
      searchByZip,
      userSelections,
      changedFilters,
      selectedFilters,
    } = this.props;

    return (
      <div className="content-container-filters">
        <SearchBar submitHandler={searchByZip} />
        <IssueFilter issues={issues} changedFilters={changedFilters} selectedFilters={selectedFilters} />
        <div className="input-group-filters">
          <div className="input-group__item">
            <select
              className="select"
              onChange={this.onSortChange}
            >
              <option value="all">Choose Filter</option>
              <option value="title">Title</option>
              <option value="type">Type</option>
              <option value="district">District</option>
            </select>
          </div>
          <div className="input-group__item">
            <input
              type="text"
              className="text-input"
              placeholder="Search"
              value={userSelections.filter}
              onChange={this.onTextChange}
            />
          </div>
          {/*
          <div className="input-group__item">
            <DateRangePicker
              startDate={this.props.filters.startDate}
              endDate={this.props.filters.endDate}
              onDatesChange={this.onDatesChange}
              focusedInput={this.state.calendarFocused}
              onFocusChange={this.onFocusChange}
              showClearDates={true}
              numberOfMonths={1}
              isOutsideRange={() => false}
            />
          </div>
          */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userSelections: state.selections,
  issues: getCurrentIssueFocuses(state),
  selectedFilters: getFilters(state),
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
