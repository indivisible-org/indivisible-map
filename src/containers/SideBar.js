import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as selections from '../state/selections/selectors';

import MenuBar from './MenuBar';

import Table from '../components/Table';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.renderTable = this.renderTable.bind(this);
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
  render() {
    const {
      allItems,
      colorMap,
      items,
      refcode,
      type,
      selectItem,
    } = this.props;

    return (
      <div className="side-bar-container">
        <MenuBar items={items} type={type} allItems={allItems} />
        <Table
          colorMap={colorMap}
          items={items}
          refcode={refcode}
          shouldRender={this.renderTable()}
          type={type}
          selectItem={selectItem}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  location: selections.getLocation(state),
  filterBy: selections.getFilterBy(state),
});

SideBar.propTypes = {
  allItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})),
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterBy: PropTypes.string.isRequired,
  location: PropTypes.shape({}).isRequired,
  refcode: PropTypes.string,
  type: PropTypes.string.isRequired,
  selectItem: PropTypes.func,
};

SideBar.defaultProps = {
  refcode: '',
  colorMap: [],
  selectItem: () => {},
};
export default connect(mapStateToProps)(SideBar);
