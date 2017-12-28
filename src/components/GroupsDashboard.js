import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import MapView from './MapView';
import Table from './Table';
// import getData from './logics/getData';
// import Point from '../logics/features';

class GroupsDashboard extends React.Component {
  render() {
    return (
      <div>
        <h2 className="dash-title">Group Dashboard</h2>
        <Table items={this.props.groups} />
        <MapView featuresHome={this.props.featuresHome} />
      </div>
    );
  }
}

// these should be passed down
const mapStateToProps = (state) => {
  console.log(state);
  return {
    groups: state.groupState.groups, // selectEvents(state.events, state.filters)
    featuresHome: state.groupState.featuresHome,
  };
};

export default connect(mapStateToProps)(GroupsDashboard);

// ReactDom.render(<GroupsDashboard />, document.getElementById('root'));
