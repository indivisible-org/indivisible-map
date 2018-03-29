import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import Point from '../logics/features';

class MapInset extends React.Component {
  constructor(props) {
    super(props);
    this.addPopups = this.addPopups.bind(this);
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
    const {
      type,
      refcode,
    } = this.props;
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    });

    // map.on('mousemove', (e) => {
    //   const { searchType } = this.map.metadata;
    //   const features = map.queryRenderedFeatures(e.point, { layers: [layer] });
    //   // Change the cursor style as a UI indicator.
    //   map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    //   if (features.length) {
    //     const feature = features[0];
    //     const { properties } = feature;
    //     const linkMapping = {
    //       events: `<a target="_blank" href=${properties.rsvpHref}${refcode}>rsvp</a>`,
    //       groups: '',
    //     };
    //     return popup.setLngLat(feature.geometry.coordinates)
    //       .setHTML(`
    //           <h4>${feature.properties.title}</h4>
    //           <div>${feature.properties.startsAt}</div>
    //           ${linkMapping[type]}
    //           `)
    //       .addTo(map);
    //   }
    // });
  }

  districtSelect(feature) {
    if (feature.state) {
      const locationData = {
        state: feature.state,
        district: [feature.district],
        validSelections: feature.geoID,
      };
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
      type,
      searchByDistrict,
      setLatLng,
    } = this.props;
    const { map } = this;

    map.on('click', (e) => {
      const { searchType } = this.map.metadata;
      if (searchType === 'proximity') {
        // handle proximity
        const points = map.queryRenderedFeatures(e.point, { layers: [`${type}-points`] });
        // selected a marker
        let formatLatLng;
        if (points.length > 0) {
          const point = points[0];
          formatLatLng = {
            LAT: point.geometry.coordinates[1].toString(),
            LNG: point.geometry.coordinates[0].toString(),
          };
        } else {
          formatLatLng = {
            LAT: e.lngLat.lat.toString(),
            LNG: e.lngLat.lng.toString(),
          };
        }
        setLatLng(formatLatLng);
      } else if (searchType === 'district') {
        const features = map.queryRenderedFeatures(
          e.point,
          {
            layers: ['district_interactive'],
          },
        );
        const feature = {};
        const points = map.queryRenderedFeatures(e.point, { layers: [`${type}-points`] });

        if (features.length > 0) {
          feature.state = features[0].properties.ABR;
          feature.district = features[0].properties.GEOID.substring(2, 4);
          feature.geoID = features[0].properties.GEOID;

          if (points.length > 0) {
            const point = points[0];
            const formatLatLng = {
              LAT: point.geometry.coordinates[1].toString(),
              LNG: point.geometry.coordinates[0].toString(),
            };
            setLatLng(formatLatLng);
          } else {
            searchByDistrict({ state: feature.state, district: feature.district });
          }
        }
      }
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
      type,
      searchType,
      mapId,
      bounds,
      state,
    } = this.props;

    mapboxgl.accessToken =
        'pk.eyJ1IjoibWF5YXlhaXIiLCJhIjoiY2phdWl3Y2dnNWM0djJxbzI2M3l6ZHpmNSJ9.m00H0mS_DpchMFMbQ72q2w';
    const styleUrl = 'mapbox://styles/mayayair/cjd14wlhs0abt2sp8o10s64el';

    this.map = new mapboxgl.Map({
      container: mapId,
      style: styleUrl,
      scrollZoom: false,
      doubleClickZoom: false,
      dragPan: false,
    });

    // Set Mapbox map controls
    this.map.metadata = {
      searchType,
    };
    // map on 'load'
    this.map.on('load', () => {
      this.map.fitBounds(bounds, {
        linear: true,
        easeTo: {duration: 0}
      });
      this.addClickListener();
      if (type === 'events') {
        this.addLayer(featuresHome);
        this.addPopups('events-points');
        this.map.getSource('events-points').setData(featuresHome);
      } else {
        this.toggleFilters('group-points', ['==', 'state', state]);
        this.map.setLayoutProperty('group-points', 'visibility', 'visible');
        this.addPopups('unclustered-point');
        this.clusterData(featuresHome);
      }
    });
  }

  render() {
    const {
      filterByValue,
      center,
      mapId,
    } = this.props;

    const mapClassNames = classNames({
      hidden: filterByValue.length > 0 || center.LAT,
      inset: true,
    });
    return (
      <React.Fragment>
        <div id={mapId} className={mapClassNames} data-bounds={this.props.bounds} onClick={this.props.onClick}/>
      </React.Fragment>
    );
  }
}

MapInset.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
  resetSelections: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  filterByValue: PropTypes.shape({}),
  selectItem: PropTypes.shape({}),
  searchType: PropTypes.string,
};

MapInset.defaultProps = {
  center: {},
  filterByValue: {},
  selectItem: null,
  searchType: 'proximity',
};

export default MapInset;
