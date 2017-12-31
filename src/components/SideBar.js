import React from 'react';
import Table from './Table';
import Filters from './FiltersComponent';

class SideBar extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div>
        <Filters />
        <Table items={items}/>
      </div>
    );
  }
}

export default SideBar;

