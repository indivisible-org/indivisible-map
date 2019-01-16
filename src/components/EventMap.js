import React from 'react';
import PropTypes from 'prop-types';
import {
  find,
  filter,
} from 'lodash';
import geoViewport from '@mapbox/geo-viewport';
import bboxes from '../data/bboxes';
import Point from '../logics/features';
import states from '../data/states';

import MapInset from '../components/MapInset';

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
    this.toggleFilters = this.toggleFilters.bind(this);
    this.highlightDistrict = this.highlightDistrict.bind(this);
    this.districtSelect = this.districtSelect.bind(this);
    this.removeHighlights = this.removeHighlights.bind(this);
    this.filterForStateInsets = this.filterForStateInsets.bind(this);
    this.insetOnClickEvent = this.insetOnClickEvent.bind(this);
    this.makeZoomToNationalButton = this.makeZoomToNationalButton.bind(this);
    this.state = {
      alaskaItems: filter(this.props.items, { state: 'AK' }),
      hawaiiItems: filter(this.props.items, { state: 'HI' }),
      inset: !props.selectedUsState,
      popoverColor: 'popover-general-icon',
    };
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
      selectedItem,
      selectedUsState,
      district,
    } = nextProps;
    this.map.metadata = { searchType: nextProps.searchType };


    // Highlight selected item
    if (this.props.selectedItem !== selectedItem) {
      this.map.setFilter('unclustered-point-selected', ['==', 'id', selectedItem ? selectedItem.id : false]);
    }

    if (items.length !== this.props.items.length) {
      this.updateData(items, 'events-points');
      this.filterForStateInsets(items);
    }

    if (filterByValue.state || selectedUsState) {
      let bbname = selectedUsState || filterByValue.state[0].toUpperCase();
      if (district) {
        const zeros = '00';
        const districtString = district.toString();
        const districtPadded =
          zeros.substring(0, zeros.length - districtString.length) +
          districtString;
        bbname = `${bbname}${districtPadded}`;

        // highlight district
        const stateFIPS = states.find(cur => cur.USPS === bbname) ? states.find(cur => cur.USPS === bbname).FIPS : '';
        const geoID = `${stateFIPS}${districtPadded}`;
        const selectObj = {
          district: districtPadded,
          geoID,
          state: filterByValue.state[0],
        };
        this.districtSelect(selectObj);
      }
      const stateBB = bboxes[bbname];
      return this.focusMap(stateBB);
    }
    if (center.LNG) {
      if (this.state.inset === false) {
        return this.map.fitBounds(this.map.getBounds());
      }
      return this.map.flyTo({
        center: [Number(center.LNG), Number(center.LAT)],
        zoom: 9.52 - (distance * (4.7 / 450)),
      });
    }
    return this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
  }

  getColorForEvents(indEvent) {
    const {
      colorMap,
      onColorMapUpdate,
    } = this.props;
    let updatedObj = {};
    let colorObj = find(colorMap, { filterBy: indEvent.issueFocus });
    if (colorObj) {
      updatedObj = { ...indEvent, icon: colorObj.icon };
    } else {
      colorObj = find(colorMap, { filterBy: false });
      if (colorObj) {
        colorObj.filterBy = indEvent.issueFocus;
        updatedObj = { ...indEvent, icon: colorObj.icon };
      } else {
        colorObj = {
          color: '#6C9FC2',
          filterBy: indEvent.issueFocus,
          icon: 'general',
        };
        colorMap.push(colorObj);
        updatedObj = {
          ...indEvent,
          icon: colorObj.icon,
        };
      }
      onColorMapUpdate(colorMap);
    }
    return updatedObj;
  }

  filterForStateInsets(items) {
    const alaskaItems = filter(items, { state: 'AK' });
    const hawaiiItems = filter(items, { state: 'HI' });
    this.setState({
      alaskaItems,
      hawaiiItems,
    });
  }

  insetOnClickEvent(e) {
    this.setState({ inset: false });
    const dataBounds = e.target.parentNode.parentNode.getAttribute('data-bounds').split(',');
    const boundsOne = [Number(dataBounds[0]), Number(dataBounds[1])];
    const boundsTwo = [Number(dataBounds[2]), Number(dataBounds[3])];
    const bounds = boundsOne.concat(boundsTwo);
    this.map.fitBounds(bounds);
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
      console.log('no layer');
      return;
    }
    this.map.getSource(layer).setData(featuresHome);
  }

  createFeatures(items) {
    const featuresHome = {
      features: [],
      type: 'FeatureCollection',
    };
    featuresHome.features = items.map((indEvent) => {
      const colorObject = this.getColorForEvents(indEvent);
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

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [layer] });
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (features.length) {
        const feature = features[0];
        const { properties } = feature;
        const linkMapping = {
          events: `<a target="_blank" href=${properties.rsvpHref}${refcode}>rsvp</a>`,
          groups: '',
        };
        this.setState({ popoverColor: `popover-${feature.properties.icon}` });

        return popup.setLngLat(feature.geometry.coordinates)
          .setHTML(`
            <h4>${feature.properties.title}</h4>
            <div>${feature.properties.startsAt}</div>
            ${linkMapping[type]}
            `)
          .addTo(map);
      }
      return undefined;
    });
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

  toggleFilters(layer, filterSettings) {
    this.map.setFilter(layer, filterSettings);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  // Handles the highlight for districts when clicked on.
  highlightDistrict(geoid) {
    let filterSettings;
    // Filter for which district has been selected.
    if (typeof geoid === 'object') {
      filterSettings = ['any'];

      geoid.forEach((i) => {
        filterSettings.push(['==', 'GEOID', i]);
      });
    } else {
      filterSettings = ['all', ['==', 'GEOID', geoid]];
    }
    // Set that layer filter to the selected
    this.toggleFilters('selected-fill', filterSettings);
    this.toggleFilters('selected-border', filterSettings);
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

        if (features.length > 0) {
          feature.state = features[0].properties.ABR;
          feature.district = features[0].properties.GEOID.substring(2, 4);
          feature.geoID = features[0].properties.GEOID;

          searchByDistrict({
            district: Number(feature.district),
            state: feature.state,
          });
        }
      }
    });
  }

  addLayer(featuresHome) {
    this.map.addLayer(
      {
        id: 'events-points',
        layout: {
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'icon-image': '{icon}',
          'icon-offset': {
            base: 1,
            stops: [
              [0, [0, -15]],
              [10, [0, -10]],
              [12, [0, 0]],
            ],
          },
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        },
        paint: {
          'icon-opacity': 1,
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
    const {
      selectedUsState,
      resetSelections,
    } = this.props;
    this.removeHighlights();
    resetSelections();
    if (!selectedUsState) {
      this.setState({ inset: true });
    }
  }

  // Creates the button in our zoom controls to go to the national view
  makeZoomToNationalButton() {
    const {
      selectedUsState,
    } = this.props;
    document.querySelector('.mapboxgl-ctrl-compass').remove();
    if (document.querySelector('.mapboxgl-ctrl-usa')) {
      document.querySelector('.mapboxgl-ctrl-usa').remove();
    }
    const usaButton = document.createElement('button');
    usaButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-usa';
    if (selectedUsState) {
      usaButton.innerHTML = `<span>${selectedUsState}</span>`;
    } else {
      usaButton.innerHTML = '<span class="usa-icon"></span>';
    }
    usaButton.addEventListener('click', this.handleReset);
    document.querySelector('.mapboxgl-ctrl-group').appendChild(usaButton);
  }

  initializeMap(featuresHome) {
    const { type, searchType } = this.props;

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
    this.map.metadata = {
      searchType,
    };
    // map on 'load'
    this.map.on('load', () => {
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
    const {
      center,
      colorMap,
      district,
      type,
      filterByValue,
      resetSelections,
      searchByDistrict,
      refcode,
      setLatLng,
      distance,
      searchType,
      searchByQueryString,
      selectedUsState,
    } = this.props;

    return (
      <React.Fragment>
        <div id="map" className={this.state.popoverColor}>
          <div className="map-overlay" id="legend">
            <MapInset
              items={this.state.alaskaItems}
              selectedUsState={selectedUsState}
              center={center}
              stateName="AK"
              colorMap={colorMap}
              district={district}
              type={type}
              filterByValue={filterByValue}
              resetSelections={resetSelections}
              searchByDistrict={searchByDistrict}
              refcode={refcode}
              setLatLng={setLatLng}
              distance={distance}
              searchType={searchType}
              searchByQueryString={searchByQueryString}
              mapId="map-overlay-alaska"
              bounds={[[-170.15625, 51.72702815704774], [-127.61718749999999, 71.85622888185527]]}
            />
            <MapInset
              items={this.state.hawaiiItems}
              selectedUsState={selectedUsState}
              stateName="HI"
              center={center}
              colorMap={colorMap}
              district={district}
              type={type}
              filterByValue={filterByValue}
              resetSelections={resetSelections}
              searchByDistrict={searchByDistrict}
              refcode={refcode}
              setLatLng={setLatLng}
              distance={distance}
              searchType={searchType}
              searchByQueryString={searchByQueryString}
              mapId="map-overlay-hawaii"
              bounds={[
                [-161.03759765625, 18.542116654448996],
                [-154.22607421875, 22.573438264572406]]}
            />
          </div>
        </div>

      </React.Fragment>
    );
  }
}

MapView.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.number,
  district: PropTypes.number,
  filterByValue: PropTypes.shape({}),
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onColorMapUpdate: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  searchType: PropTypes.string,
  selectedItem: PropTypes.shape({}),
  selectedUsState: PropTypes.string,
  setLatLng: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

MapView.defaultProps = {
  center: {},
  distance: 50,
  district: NaN,
  filterByValue: {},
  refcode: '',
  searchType: 'proximity',
  selectedItem: null,
  selectedUsState: null,
};

export default MapView;
