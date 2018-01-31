import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import MapView from '../components/MapView';
import { getFilteredGroups } from '../state/groups/selectors';

import SideBar from './SideBar';

class GroupsDashboard extends React.Component {
  render() {
    return (
      <div>
        <h2 className="dash-title">Group Dashboard</h2>
        <SideBar items={this.props.groups} />
        <MapView featuresHome={this.props.featuresHome} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: getFilteredGroups(state),
  featuresHome: state.groups.featuresHome,
});

GroupsDashboard.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  featuresHome: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps)(GroupsDashboard);
