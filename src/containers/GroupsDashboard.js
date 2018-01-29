import React from 'react';
import { connect } from 'react-redux';
import MapView from '../components/MapView';
import SideBar from '../components/SideBar';
import selectGroups from '../state/groups/selectors';

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

// these should be passed down
const mapStateToProps = state => ({
  groups: selectGroups(state.groups.groups, state.filters),
  featuresHome: state.groups.featuresHome,
});

export default connect(mapStateToProps)(GroupsDashboard);
