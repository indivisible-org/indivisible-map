import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import {
  getColorMap,

} from '../state/events/selectors';

import {
  getVisbleGroups,
  getGroups,
} from '../state/groups/selectors';
import { startSetGroups } from '../state/groups/actions';

import {
  getLocation,
  getDistance,
  getFilterBy,
  getFilterValue,
} from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import MapView from '../components/MapView';

import SideBar from './SideBar';

/* eslint-disable */
require('style-loader!css-loader!antd/es/layout/style/index.css');
/* eslint-enable */

class GroupsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      collapsed: false,
    };
    this.onCollapse = (collapsed) => {
      console.log(collapsed);
      this.setState({ collapsed });
    };
  }

  componentWillMount() {
    const {
      setRefCode,
    } = this.props;

    if (document.location.search) {
      setRefCode(document.location.search);
    }
  }

  componentDidMount() {
    const {
      getInitalGroups,
    } = this.props;
    getInitalGroups()
      .then(() => {
        this.setState({ init: false });
      });
  }

  render() {
    const {
      allGroups,
      distance,
      groups,
      colorMap,
      center,
      filterBy,
      filterValue,
      resetSelections,
    } = this.props;
    if (this.state.init) {
      return null;
    }

    return (
      <Layout>
        <h2 className="dash-title">Group Dashboard</h2>
        <Layout.Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          className="sidebar-container"
        >
          <SideBar type="groups" items={groups} allItems={allGroups} />
          <div className="sidebar-collapsed-text">Filters & Groups</div>
        </Layout.Sider>

        <Layout>
          <MapView
            center={center}
            type="groups"
            items={groups}
            colorMap={colorMap}
            filterByValue={{ [filterBy]: [filterValue] }}
            resetSearchByZip={resetSelections}
            distance={distance}
          />
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  allGroups: getGroups(state),
  groups: getVisbleGroups(state),
  colorMap: getColorMap(state),
  center: getLocation(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  distance: getDistance(state),
});
console.log(selectionActions);

const mapDispatchToProps = dispatch => ({
  getInitalGroups: () => dispatch(startSetGroups()),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
});

GroupsDashboard.propTypes = {
  allGroups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  center: PropTypes.shape({}).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.number.isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterBy: PropTypes.string.isRequired,
  filterValue: PropTypes.string.isRequired,
  setRefCode: PropTypes.func.isRequired,
  getInitalGroups: PropTypes.func.isRequired,
  resetSelections: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsDashboard);
