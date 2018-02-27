import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import geoViewport from '@mapbox/geo-viewport';
import classNames from 'classnames';

import bboxes from '../data/bboxes';
import Point from '../logics/features';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.addPopups = this.addPopups.bind(this);
    this.addClickListener = this.addClickListener.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.createFeatures = this.createFeatures.bind(this);
    this.updateData = this.updateData.bind(this);
    this.getColorForEvents = this.getColorForEvents.bind(this);
    this.focusMap = this.focusMap.bind(this);
    this.addClusterLayers = this.addClusterLayers.bind(this);
    this.handleReset = this.handleReset.bind(this);
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
      distance,
      searchType,
      type,
      selectedItem,
    } = nextProps;
    this.map.resize();
    this.addClickListener(searchType);
    if (items.length !== this.props.items.length) {
      this.updateData(items, `${type}-points`);
    }
    // Highlight selected item
    if (this.props.selectedItem !== selectedItem) {
      this.map.setFilter('unclustered-point-selected', ['==', 'id', selectedItem ? selectedItem.id : false]);
    }
    if (center.LNG) {
      return this.map.flyTo({
        center: [Number(center.LNG), Number(center.LAT)],
        zoom: 9.52 - (distance * (4.7 / 450)),
      });
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

  updateData(items, layer) {
    const featuresHome = this.createFeatures(items);
    this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
    if (!this.map.getSource(layer)) {
      return;
    }
    this.map.getSource(layer).setData(featuresHome);
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

  addPopups(layer) {
    const { map } = this;
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [layer] });
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

  addClickListener(searchType) {
    const { setLatLng } = this.props;
    const { map } = this;

    map.on('click', (e) => {
      console.log(searchType);
      if (searchType === 'proximity') {
        // handle proximity
      } else if (searchType === 'district') {
        // handle district
      }
      const formatLatLng = {
        LAT: e.lngLat.lat.toString(),
        LNG: e.lngLat.lng.toString(),
      };
      setLatLng(formatLatLng);
    });
  }

  addLayer(featuresHome) {
    this.map.addLayer(
      {
        id: 'events-points',
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

  clusterData(featuresHome) {
    this.map.addSource('groups-points', {
      type: 'geojson',
      data: featuresHome,
      cluster: false,
    });
    this.addClusterLayers();
  }

  addClusterLayers() {
    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'groups-points',
      filter: ['!has', 'point_count'],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
        'circle-opacity': 0.5,
      },
    });

    // Layer to highlight selected group
    this.map.addLayer({
      id: 'unclustered-point-selected',
      type: 'circle',
      source: 'groups-points',
      filter: ['==', 'id', false],
      paint: {
        'circle-color': '#f00',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
        'circle-opacity': 1,
      },
    });
  }

  handleReset() {
    this.props.resetSearchByZip();
  }
  // Creates the button in our zoom controls to go to the national view
  makeZoomToNationalButton() {
    document.querySelector('.mapboxgl-ctrl-compass').remove();
    if (document.querySelector('.mapboxgl-ctrl-usa')) {
      document.querySelector('.mapboxgl-ctrl-usa').remove();
    }
    const usaButton = document.createElement('button');
    usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';
    usaButton.innerHTML = '<span class="usa-icon"></span>';

    usaButton.addEventListener('click', this.handleReset);
    document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
  }

  initializeMap(featuresHome) {
    const { type } = this.props;

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
      this.addClickListener();
      if (type === 'events') {
        this.addLayer(featuresHome);
        this.addPopups('events-points');
        this.map.getSource('events-points').setData(featuresHome);
      } else {
        this.addPopups('unclustered-point');
        this.clusterData(featuresHome);
      }
    });
  }

  render() {
    const { type } = this.props;
    const mapClass = classNames({
      [type]: true,
      searched: this.props.center.LAT,
    });
    return (
      <div>
        <div id="map" className={mapClass} />
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
  setLatLng: PropTypes.func.isRequired,
  filterByValue: PropTypes.shape({}),
  distance: PropTypes.number,
  searchType: PropTypes.string,
};

MapView.defaultProps = {
  center: {},
  filterByValue: {},
  distance: 50,
  searchType: 'proximity',
};

export default MapView;
