import React from 'react';
import PropTypes from 'prop-types';

import Filters from '../containers/FiltersComponent';

import Table from './Table';

class SideBar extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div>
        <Filters />
        <Table items={items} />
      </div>
    );
  }
}

SideBar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SideBar;
