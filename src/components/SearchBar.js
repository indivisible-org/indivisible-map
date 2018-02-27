import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

/* eslint-disable */
require('style-loader!css-loader!antd/es/style/index.css');
require('style-loader!css-loader!antd/es/input/style/index.css');
/* eslint-enable */

const { Search } = Input;

const SearchStateDefault = {
  zipcode: '',
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(value) {
    const {
      submitHandler,
    } = this.props;
    submitHandler(Object.assign({}, { query: value }));
  }

  render() {
    const {
      searchType,
    } = this.props;
    const textMap = {
      district: 'district, ex WA-09',
      proximity: 'zipcode, state, or title',
    };
    return (
      <Search
        placeholder={textMap[searchType]}
        onSearch={value => this.handleSubmit(value)}
        style={{ width: '100%' }}
      />
    );
  }
}


SearchBar.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
};

export default SearchBar;
