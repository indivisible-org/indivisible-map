import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import Point from '../logics/features';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.addPopups = this.addPopups.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.createFeatures = this.createFeatures.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    const { events } = this.props;
    const featuresHome = this.createFeatures(events);
    this.initializeMap(featuresHome);
  }

  componentWillReceiveProps(nextProps) {
    const { center, events } = nextProps;
    if (events.length !== this.props.events.length) {
      this.updateData(events);
    }
    if (center) {
      return this.map.flyTo({ center: [Number(center.LNG), Number(center.LAT)], zoom: 9 });
    }
    return this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
  }

  updateData(events) {
    const featuresHome = this.createFeatures(events);
    this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
    this.map.addLayer(featuresHome);
    this.map.getSource('event-points').setData(featuresHome);
  }

  createFeatures(events) {
    const featuresHome = {
      type: 'FeatureCollection',
      features: [],
    };

    featuresHome.features = events.map((indEvent) => {
      const { colorMap } = this.props;
      let updatedObj = {};
      let colorObj = find(colorMap, { filter: indEvent.issueFocus });
      if (colorObj) {
        updatedObj = { ...indEvent, icon: colorObj.icon };
      } else {
        colorObj = find(colorMap, { filter: false });
        colorObj.filter = indEvent.issueFocus;
        updatedObj = { ...indEvent, icon: colorObj.icon };
      }
      const newFeature = new Point(updatedObj);
      return newFeature;
    });
    return featuresHome;
  }

  addPopups() {
    const { map } = this;
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['event-points'] });
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (!features.length) {
        popup.remove();
        return;
      }
      const feature = features[0];
      popup.setLngLat(feature.geometry.coordinates)
        .setHTML(`
          <h4>${feature.properties.title}</h4>
          <div>${feature.properties.startsAt}</div>`)
        .addTo(map);
    });
  }

  addLayer(featuresHome) {
    this.map.addLayer(
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
  }

  initializeMap(featuresHome) {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWxhbjA0MCIsImEiOiJjamFrNm81dWkyZzMzMnhsZTI3bjR3eDVoIn0.K3FKPy6S_PwzjDjb02aGHA';
    const styleUrl = 'mapbox://styles/alan040/cjaqgutcnhdun2slmi3xbhgu1';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: styleUrl,
    });


    // Set Mapbox map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.scrollZoom.disable();
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();

    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
      this.addLayer(featuresHome);
      this.addPopups();
      this.map.getSource('event-points').setData(featuresHome);
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
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  events: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

MapView.defaultProps = {
  center: null,
};

export default MapView;
