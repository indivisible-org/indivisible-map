import React from 'react';
import ReactDom from 'react-dom';
import MapView from './MapView';
import EventsTable from './EventsTable';
// import getData from './logics/getData';
// import Point from '../logics/features';

class GroupsDashboard extends React.Component {
  render() {
    return (
      <div>
        <h2>Group Dashboard</h2>
        <EventsTable />
        <MapView />
      </div>
    );
  }
}

// should be groups table
// mapview will still need conditional rendering of elements
// not sure if this is fixing anything
// Or = write table instead of events table and cell instead of events cell
// -- make the components universal across both
// -- filters? - will need conditional rendering probably (that changes depending on which dataType)
// <h2>Group Dashboard</h2>
// <Table /> 
// <MapView />
// <SideBar />
// i would need to know what type of data to load depending on url inside of component still
// 

export default GroupsDashboard;

// ReactDom.render(<GroupsDashboard />, document.getElementById('root'));
