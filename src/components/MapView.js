import React from 'react';

class MapView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  initializeMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxhbjA0MCIsImEiOiJjamFrNm81dWkyZzMzMnhsZTI3bjR3eDVoIn0.K3FKPy6S_PwzjDjb02aGHA';
    
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/alan040/cjaqgutcnhdun2slmi3xbhgu1'
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