import React from 'react';
import PropTypes from 'prop-types';

const FilterStateDefault = {
  zipcode: '',
};

class FilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = FilterStateDefault;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    const { submitHandler } = this.props;
    e.preventDefault();
    submitHandler(Object.assign({}, this.state));
    this.setState({ ...SearchStateDefault });
  }

  render() {
    return (

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
      </div>
    );
  }
}


FilterBar.propTypes = {
  submitHandler: PropTypes.func.isRequired,
};

export default FilterBar;
