import React from 'react';
import PropTypes from 'prop-types';

import MenuBar from './MenuBar';

import Table from '../components/Table';

class SideBar extends React.Component {
  render() {
    const {
      allItems,
      items,
      colorMap,
      refcode,
      type,
    } = this.props;

    return (
      <div className="sidebar">
        <MenuBar items={items} type={type} allItems={allItems} />
        <Table items={items} colorMap={colorMap} refcode={refcode} type={type} />
      </div>
    );
  }
}

SideBar.propTypes = {
  allItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})),
  refcode: PropTypes.string,
  type: PropTypes.string.isRequired,
};

SideBar.defaultProps = {
  refcode: '',
  colorMap: [],
};
export default SideBar;
