import React from 'react';
import ReactDom from 'react-dom';
import configureStore from './store/configureStore';
import MapView from './components/MapView';
import EventsTable from './components/EventsTable';
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
        features: [],
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
        <EventsTable
          events={this.state.events}
        />
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
