import React from 'react';
// import { connect } from 'react-redux';

class MapView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  initializeMap() {
    // initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoidG93bmhhbGxwcm9qZWN0IiwiYSI6ImNqMnRwOG4wOTAwMnMycG1yMGZudHFxbWsifQ.FXyPo3-AD46IuWjjsGPJ3Q';
    
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/townhallproject/cj2tpe64q000y2spk1wjsrilw'
    });
    map.on('load', function() {
      map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
    })
  }
  componentDidMount() {
    this.initializeMap();
  }
  render() {
    return (
      <div>
        <div id="map"></div>
        <div className='map-overlay' id='legend'></div>
      </div>
    );
  }
}

export default MapView;