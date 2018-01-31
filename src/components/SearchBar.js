import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';


require('style-loader!css-loader!antd/es/style/index.css');
require('style-loader!css-loader!antd/es/input/style/index.css');

const { Search } = Input;

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

  handleSubmit(value) {
    const { submitHandler } = this.props;
    submitHandler(Object.assign({}, { zipcode: value }));
    this.setState({ ...SearchStateDefault });
  }

  render() {
    return (

      <Search
        placeholder="zipcode or state"
        onSearch={value => this.handleSubmit(value)}
        style={{ width: '100%' }}
      />
    );
  }
}


SearchBar.propTypes = {
  submitHandler: PropTypes.func.isRequired,
};

export default SearchBar;
