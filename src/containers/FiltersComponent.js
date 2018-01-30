import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../state/selections/actions';

import SearchBar from '../components/SearchBar';

export class FiltersComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  onSortChange(e) {
    this.props.sortByChange(e.target.value);
  }

  render() {
    const { searchByZip, userSelections } = this.props;

    return (
      <div className="content-container-filters">
        <SearchBar submitHandler={searchByZip} />
        <div className="input-group-filters">
          <div className="input-group__item">
            <select
              className="select"
              onChange={this.onSortChange}
            >
              <option value="all">Choose Filter</option>
              <option value="zip">Zip Code</option>
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
});

const mapDispatchToProps = dispatch => ({
  setTextFilter: text => dispatch(actions.setTextFilter(text)),
  sortByChange: val => dispatch(actions.sortByChange(val)),
  searchByZip: zipcode => dispatch(actions.getLatLngFromZip(zipcode)),
});

FiltersComponent.propTypes = {
  setTextFilter: PropTypes.func.isRequired,
  sortByChange: PropTypes.func.isRequired,
  searchByZip: PropTypes.func.isRequired,
  userSelections: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FiltersComponent);
