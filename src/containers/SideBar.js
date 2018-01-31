import React from 'react';
import PropTypes from 'prop-types';

import MenuBar from './MenuBar';

import Table from '../components/Table';

class SideBar extends React.Component {
  render() {
    const { items, children } = this.props;
    return (
      <div>
        {children}
        <MenuBar />
        <Table items={items} />
      </div>
    );
  }
}

SideBar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  // children: PropTypes.arrayOf(React.PropTypes.node),
};

export default SideBar;
