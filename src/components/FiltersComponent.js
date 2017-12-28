import React from 'react';
import { connect } from 'react-redux';
import {
  setTextFilter,
  sortByDate,
  sortByChange
} from '../actions/filters';

export class FiltersComponent extends React.Component {
  state = {
    initKey: ''
  };
  onTextChange = e => {
    this.props.setTextFilter(e.target.value);
  };
  onSortChange = e => {
    this.props.sortByChange(e.target.value);
  };
  render() {
    console.log(this.props);
    return (
      <div className="content-container-filters">
        <div className="input-group-filters">
        <div className="input-group__item">
            <select
              className="select"
              // value={this.props.filters.sortBy}
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
              value={this.props.filters.text}
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
    )
  }
}

const mapStateToProps = (state) => {
  return {
    filters: state.filterState,
  };
};

// implicit return example
const mapDispatchToProps = dispatch => ({
  setTextFilter: text => dispatch(setTextFilter(text)),
  sortByChange: val => dispatch(sortByChange(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltersComponent);
