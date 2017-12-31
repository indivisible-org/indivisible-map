import React from 'react';
import { connect } from 'react-redux';
import MapView from './MapView';
import SideBar from './SideBar';
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
const mapStateToProps = (state) => {
  return {
    groups: selectGroups(state.groupState.groups, state.filterState),
    featuresHome: state.groupState.featuresHome,
  };
};

export default connect(mapStateToProps)(GroupsDashboard);

