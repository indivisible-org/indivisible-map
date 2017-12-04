import React from 'react';
import ReactDom from 'react-dom';
import MapView from './components/MapView';
import getData from './logics/getData';

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

  getEvents() {
    const url = 'https://indivisible.actionkit.com/rest/v1/event/?name=local-indivisible-actions&is_private=false';
    getData(url).then((result) => {
      const events = result['u"objects"'];
      this.setState({ events });
    });
  }

  render() {
    return (
      <div>
                Hello World
        <MapView
          getEvents={this.getEvents}
          events={this.state.events}
          groups={this.state.groups}
          featuresHome={this.state.featuresHome}
        />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));
