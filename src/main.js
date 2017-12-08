import React from 'react';
import ReactDom from 'react-dom';
import MapView from './components/MapView';
import getData from './logics/getData';
import Point from './logics/features';

import './style/app.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.getEvents = this.getEvents.bind(this);
    this.state = {
      events: [],
      groups: [],
      featuresHome: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-122.3321, 47.6062],
            },
            properties: {
              icon: 'host-group',
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-76.609383, 39.299236],
            },
            properties: {
              icon: 'issue',
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-117.071869, 32.774799],
            },
            properties: {
              icon: 'challenge',
            },
          },
        ],
      },
    };
  }

  getEvents(map) {
    const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
    getData(url).then((result) => {
      const response = JSON.parse(result.text);
      const events = Object.keys(response).map(id => response[id]);
      const featuresHome = {
        type: 'FeatureCollection',
        features: [],
      };

      featuresHome.features = events.map((indEvent) => {
        const newFeature = new Point(indEvent);
        return newFeature;
      });

      this.setState({ featuresHome });
      this.setState({ events });

      map.getSource('event-points').setData(featuresHome);
    });
  }

  render() {
    return (
      <div>
        <MapView
          getEvents={this.getEvents}
          events={this.state.events}
          features={this.state.groups}
          featuresHome={this.state.featuresHome}
        />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
