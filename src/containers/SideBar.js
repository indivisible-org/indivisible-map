import React from 'react';
import PropTypes from 'prop-types';

import Table from '../components/Table';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.renderTable = this.renderTable.bind(this);
    this.renderTotal = this.renderTotal.bind(this);
  }

  renderTable() {
    const {
      location,
      filterBy,
      type,
    } = this.props;
    if ((type === 'groups') && (!location.LAT) && (filterBy === 'all')) {
      return false;
    }
    return true;
  }

  renderTotal() {
    const { items, renderTotal } = this.props;
    if (renderTotal) {
      return renderTotal(items);
    }
  }

  render() {
    const {
      colorMap,
      items,
      refcode,
      selectItem,
      type,
      error,
    } = this.props;
    return (
      <div className="side-bar-container">
        {this.renderTotal()}
        <Table
          colorMap={colorMap}
          items={items}
          refcode={refcode}
          shouldRender={this.renderTable()}
          type={type}
          selectItem={selectItem}
          error={error}
        />
      </div>
    );
  }
}

SideBar.propTypes = {
  allItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})),
  error: PropTypes.string,
  filterBy: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  location: PropTypes.shape({}).isRequired,
  refcode: PropTypes.string,
  selectItem: PropTypes.func,
  type: PropTypes.string.isRequired,
};

SideBar.defaultProps = {
  colorMap: [],
  error: '',
  refcode: '',
  selectItem: () => {},
};
export default SideBar;
