import React from 'react';
import PropTypes from 'prop-types';

class MapView extends React.Component {
  componentDidMount() {
    this.initializeMap();
  }

  initializeMap() {
    const {
      featuresHome,
    } = this.props;

    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWxhbjA0MCIsImEiOiJjamFrNm81dWkyZzMzMnhsZTI3bjR3eDVoIn0.K3FKPy6S_PwzjDjb02aGHA';
    const styleUrl = 'mapbox://styles/alan040/cjaqgutcnhdun2slmi3xbhgu1';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: styleUrl,
    });


    const addLayer = (map) => {
      map.addLayer(
        {
          id: 'event-points',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: featuresHome,
          },
          layout: {
            'icon-image': '{icon}',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'icon-ignore-placement': true,
            'icon-offset': {
              base: 1,
              stops: [[0, [0, -15]], [10, [0, -10]], [12, [0, 0]]],
            },
          },
        },
        'district_interactive',
      );
    };

    // Set Mapbox map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.scrollZoom.disable();
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
      addLayer(this.map);
      this.props.getEvents(this.map);
    });
  }


  render() {
    return (
      <div>
        <div id="map" />
        <div className="map-overlay" id="legend" />
      </div>
    );
  }
}

MapView.propTypes = {
  getEvents: PropTypes.func.isRequired,
  featuresHome: PropTypes.shape({
    type: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default MapView;
