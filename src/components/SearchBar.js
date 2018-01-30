import React from 'react';
import PropTypes from 'prop-types';

const SearchStateDefault = {
  zipcode: '',
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = SearchStateDefault;

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

      <form onSubmit={this.handleSubmit} className="search-form">

        <input
          name="zipcode"
          type="text"
          // value={this.state.zipcode}
          placeholder="Zipcode"
          onChange={this.handleChange}
        />

        <button type="submit">Search</button>

      </form>
    );
  }
}


SearchBar.propTypes = {
  submitHandler: PropTypes.func.isRequired,
};

export default SearchBar;
