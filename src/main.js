import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { startSetEvents, startSetFeaturesHome } from './actions/events';
// import MapView from './components/MapView';
// import EventsTable from './components/EventsTable';
// import getData from './logics/getData';
// import Point from './logics/features';

import './style/app.scss';

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.getEvents = this.getEvents.bind(this);
//     this.state = {
//       events: [],
//       groups: [],
//       featuresHome: {
//         type: 'FeatureCollection',
//         features: [],
//       },
//     };
//   }

//   getEvents(map) {
//     const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
//     getData(url).then((result) => {
//       const response = JSON.parse(result.text);
//       console.log(response);
//       const events = Object.keys(response).map(id => response[id]);
//       const featuresHome = {
//         type: 'FeatureCollection',
//         features: [],
//       };

//       featuresHome.features = events.map((indEvent) => {
//         const newFeature = new Point(indEvent);
//         return newFeature;
//       });

//       this.setState({ featuresHome });
//       this.setState({ events });

//       map.getSource('event-points').setData(featuresHome);
//     });
//   }

//   render() {
//     console.log(window.location.href);
//     return (
//       <div>
//         <EventsTable
//           events={this.state.events}
//         />
//         <MapView
//           getEvents={this.getEvents}
//           events={this.state.events}
//           features={this.state.groups}
//           featuresHome={this.state.featuresHome}
//         />
//       </div>
//     );
//   }
// }

const store = configureStore();


// needs to be in a promise
// store.dispatch(startSetEvents());
// store.dispatch(startSetFeaturesHome());

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

let url = window.location.href;

const renderApp = () => {
  ReactDom.render(jsx, document.getElementById('root'));
};

ReactDom.render(<div>loading</div>, document.getElementById('root'));

if (url.includes('events')) {
  store.dispatch(startSetEvents()).then(() => {
    renderApp();
  })
} else if (url.includes('groups')) {
  // dispatch groups call
}

// jsx contains provider
// provider contains current state
// with dataType set
// AppRouter is inside Provider

// render App
// render jsx to element root

// get url subdomain
// setStartEvents or setStartGroups
// renderApp
// const getDataTypeFromUrl = () => {
//   let url = window.location.href;
//   console.log(url);
// };

// ReactDom.render(jsx, document.getElementById('root'));
