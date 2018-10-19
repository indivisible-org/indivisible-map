import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import Point from '../logics/features';

class MapInset extends React.Component {
  constructor(props) {
    super(props);
    this.addClickListener = this.addClickListener.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.createFeatures = this.createFeatures.bind(this);
    this.updateData = this.updateData.bind(this);
    this.getColorForEvents = this.getColorForEvents.bind(this);
    this.addClusterLayers = this.addClusterLayers.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.highlightDistrict = this.highlightDistrict.bind(this);
    this.districtSelect = this.districtSelect.bind(this);
    this.removeHighlights = this.removeHighlights.bind(this);
  }

  componentDidMount() {
    const { items } = this.props;
    const featuresHome = this.createFeatures(items);
    this.initializeMap(featuresHome);
  }

  componentWillReceiveProps(nextProps) {
    const {
      items,
      type,
      selectedItem,
    } = nextProps;
    this.map.metadata = { searchType: nextProps.searchType };

    if (items.length !== this.props.items.length) {
      this.updateData(items, `${type}-points`);
    }
    // Highlight selected item
    if (this.props.selectedItem !== selectedItem) {
      this.map.setFilter('unclustered-point-selected', ['==', 'id', selectedItem ? selectedItem.id : false]);
    }
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

  updateData(items, layer) {
    const featuresHome = this.createFeatures(items);
    if (!this.map.getSource(layer)) {
      return;
    }
    this.map.getSource(layer).setData(featuresHome);
  }

  createFeatures(items) {
    const featuresHome = {
      features: [],
      type: 'FeatureCollection',
    };
    const { type } = this.props;

    featuresHome.features = items.map((indEvent) => {
      let colorObject;
      if (type === 'events') {
        colorObject = this.getColorForEvents(indEvent);
      } else {
        colorObject = {
          ...indEvent,
          color: '#1cb7ec',
          filterBy: false,
          icon: 'circle-15-blue',
        };
      }
      const newFeature = new Point(colorObject);
      return newFeature;
    });
    return featuresHome;
  }

  districtSelect(feature) {
    if (feature.state) {
      this.highlightDistrict(feature.geoID);
    } else {
      const visibility = this.map.getLayoutProperty('selected-fill', 'visibility');
      if (visibility === 'visible') {
        this.map.setLayoutProperty('selected-fill', 'visibility', 'none');
        this.map.setLayoutProperty('selected-border', 'visibility', 'none');
      }
    }
  }

  toggleFilters(layer, filter) {
    this.map.setFilter(layer, filter);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  // Handles the highlight for districts when clicked on.
  highlightDistrict(geoid) {
    let filter;
    // Filter for which district has been selected.
    if (typeof geoid === 'object') {
      filter = ['any'];

      geoid.forEach((i) => {
        filter.push(['==', 'GEOID', i]);
      });
    } else {
      filter = ['all', ['==', 'GEOID', geoid]];
    }
    // Set that layer filter to the selected
    this.toggleFilters('selected-fill', filter);
    this.toggleFilters('selected-border', filter);
  }

  addClickListener() {
    const {
      searchByQueryString,
      stateName,
    } = this.props;
    const { map } = this;

    map.on('click', () => {
      searchByQueryString({ filterBy: 'state', filterValue: stateName });
    });
  }

  addLayer(featuresHome) {
    this.map.addLayer(
      {
        id: 'events-points',
        layout: {
          'icon-ignore-placement': true,
          'icon-image': '{icon}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        },
        source: {
          data: featuresHome,
          type: 'geojson',
        },
        type: 'symbol',
      },
      'district_interactive',
    );
  }

  clusterData(featuresHome) {
    this.map.addSource('groups-points', {
      cluster: false,
      data: featuresHome,
      type: 'geojson',
    });
    this.addClusterLayers();
  }

  addClusterLayers() {
    this.map.addLayer({
      filter: ['!has', 'point_count'],
      id: 'unclustered-point',
      paint: {
        'circle-color': '#11b4da',
        'circle-opacity': 0.5,
        'circle-radius': 4,
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1,
      },
      source: 'groups-points',
      type: 'circle',
    });

    // Layer to highlight selected group
    this.map.addLayer({
      filter: ['==', 'id', false],
      id: 'unclustered-point-selected',
      paint: {
        'circle-color': '#f00',
        'circle-opacity': 1,
        'circle-radius': 6,
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 2,
      },
      source: 'groups-points',
      type: 'circle',
    });
  }

  removeHighlights() {
    this.map.setLayoutProperty('selected-fill', 'visibility', 'none');
    this.map.setLayoutProperty('selected-border', 'visibility', 'none');
  }

  handleReset() {
    this.removeHighlights();
    this.props.resetSelections();
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
    const {
      bounds,
      mapId,
      type,
      searchType,
      stateName,
    } = this.props;

    mapboxgl.accessToken =
        'pk.eyJ1IjoibWF5YXlhaXIiLCJhIjoiY2phdWl3Y2dnNWM0djJxbzI2M3l6ZHpmNSJ9.m00H0mS_DpchMFMbQ72q2w';
    const styleUrl = 'mapbox://styles/mayayair/cjd14wlhs0abt2sp8o10s64el';

    this.map = new mapboxgl.Map({
      container: mapId,
      doubleClickZoom: false,
      dragPan: false,
      scrollZoom: false,
      style: styleUrl,
    });

    // Set Mapbox map controls
    this.map.metadata = {
      searchType,
    };
    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds(bounds, {
        easeTo: { duration: 0 },
        linear: true,
      });
      this.addClickListener();
      if (type === 'events') {
        this.addLayer(featuresHome);
        this.map.getSource('events-points').setData(featuresHome);
      } else {
        this.toggleFilters('group-points', ['==', 'state', stateName]);
        this.map.setLayoutProperty('group-points', 'visibility', 'visible');
        this.clusterData(featuresHome);
      }
    });
  }

  render() {
    const {
      filterByValue,
      center,
      mapId,
      selectedUsState,
    } = this.props;
    const mapClassNames = classNames({
      hidden: filterByValue.state || center.LAT || filterByValue.title || selectedUsState,
      inset: true,
    });
    return (
      <React.Fragment>
        <div id={mapId} className={mapClassNames} data-bounds={this.props.bounds} />
      </React.Fragment>
    );
  }
}

MapInset.propTypes = {
  bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterByValue: PropTypes.shape({}),
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  mapId: PropTypes.string.isRequired,
  resetSelections: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  searchType: PropTypes.string,
  selectedItem: PropTypes.PropTypes.shape({}),
  selectedUsState: PropTypes.string,
  stateName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

MapInset.defaultProps = {
  center: {},
  filterByValue: {},
  searchType: 'proximity',
  selectedItem: null,
  selectedUsState: null,
};

export default MapInset;
