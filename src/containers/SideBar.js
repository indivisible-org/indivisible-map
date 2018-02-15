import React from 'react';
import PropTypes from 'prop-types';

import MenuBar from './MenuBar';

import Table from '../components/Table';

class SideBar extends React.Component {
  render() {
    const {
      items,
      colorMap,
      refcode,
      type,
    } = this.props;
    return (
      <div>
        <MenuBar items={items} type={type} />
        <Table items={items} colorMap={colorMap} refcode={refcode} type={type} />
      </div>
    );
  }
}

SideBar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default SideBar;
