import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import geoViewport from '@mapbox/geo-viewport';

import bboxes from '../data/bboxes';
import Point from '../logics/features';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.addPopups = this.addPopups.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.createFeatures = this.createFeatures.bind(this);
    this.updateData = this.updateData.bind(this);
    this.getColorForEvents = this.getColorForEvents.bind(this);
    this.focusMap = this.focusMap.bind(this);
  }

  componentDidMount() {
    const { items } = this.props;
    const featuresHome = this.createFeatures(items);
    this.initializeMap(featuresHome);
  }

  componentWillReceiveProps(nextProps) {
    const {
      center,
      items,
      filterByValue,
    } = nextProps;
    if (items.length !== this.props.items.length) {
      this.updateData(items);
    }
    if (center.LNG) {
      return this.map.flyTo({ center: [Number(center.LNG), Number(center.LAT)], zoom: 9 });
    }
    if (filterByValue.state) {
      const state = filterByValue.state[0];
      const stateBB = bboxes[state];
      return this.focusMap(stateBB);
    }
    return this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
  }

  getColorForEvents(indEvent) {
    const { colorMap } = this.props;
    let updatedObj = {};
    let colorObj = find(colorMap, { filterBy: indEvent.issueFocus });
    if (colorObj) {
      updatedObj = { ...indEvent, icon: colorObj.icon };
    } else {
      colorObj = find(colorMap, { filterBy: false });
      colorObj.filterBy = indEvent.issueFocus;
      updatedObj = { ...indEvent, icon: colorObj.icon };
    }
    return updatedObj;
  }

  focusMap(bb) {
    if (!bb) {
      return;
    }
    const height = window.innerHeight;
    const width = window.innerWidth;
    const view = geoViewport.viewport(bb, [width / 2, height / 2]);
    if (view.zoom < 2.5) {
      view.zoom = 2.5;
    } else {
      view.zoom -= 0.5;
    }
    this.map.flyTo(view);
  }

  updateData(items) {
    const featuresHome = this.createFeatures(items);
    this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
    if (this.map.getSource('event-points')) {
      this.map.getSource('event-points').setData(featuresHome);
    }
  }

  createFeatures(items) {
    const featuresHome = {
      type: 'FeatureCollection',
      features: [],
    };
    const { type } = this.props;

    featuresHome.features = items.map((indEvent) => {
      let colorObject;
      if (type === 'events') {
        colorObject = this.getColorForEvents(indEvent);
      } else {
        colorObject = {
          ...indEvent, icon: 'circle-15-blue', filterBy: false, color: '#1cb7ec',
        };
      }
      const newFeature = new Point(colorObject);
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
        },
      },
      'district_interactive',
    );
  }

  // Creates the button in our zoom controls to go to the national view
  makeZoomToNationalButton() {
    const {
      resetSearchByZip,
    } = this.props;
    document.querySelector('.mapboxgl-ctrl-compass').remove();
    if (document.querySelector('.mapboxgl-ctrl-usa')) {
      document.querySelector('.mapboxgl-ctrl-usa').remove();
    }
    const usaButton = document.createElement('button');
    usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';
    usaButton.innerHTML = '<span class="usa-icon"></span>';

    usaButton.addEventListener('click', resetSearchByZip);
    document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
  }

  initializeMap(featuresHome) {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWF5YXlhaXIiLCJhIjoiY2phdWl3Y2dnNWM0djJxbzI2M3l6ZHpmNSJ9.m00H0mS_DpchMFMbQ72q2w';
    const styleUrl = 'mapbox://styles/mayayair/cjd14wlhs0abt2sp8o10s64el';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: styleUrl,
    });

    // Set Mapbox map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.scrollZoom.disable();
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();
    this.makeZoomToNationalButton();
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
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
  resetSearchByZip: PropTypes.func.isRequired,
  filterByValue: PropTypes.shape({}),
};

MapView.defaultProps = {
  center: {},
  filterByValue: {},
};

export default MapView;
