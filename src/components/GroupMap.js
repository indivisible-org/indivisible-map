import React from 'react';
import PropTypes from 'prop-types';
import geoViewport from '@mapbox/geo-viewport';
import bboxes from '../data/bboxes';
import states from '../data/states';
import MapInset from '../components/MapInset';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.addPopups = this.addPopups.bind(this);
    this.addClickListener = this.addClickListener.bind(this);
    this.focusMap = this.focusMap.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.highlightDistrict = this.highlightDistrict.bind(this);
    this.districtSelect = this.districtSelect.bind(this);
    this.removeHighlights = this.removeHighlights.bind(this);
  }

  componentDidMount() {
    this.initializeMap();
    this.map.resize();
  }

  componentWillReceiveProps() {
    this.map.resize();
  }

  componentDidUpdate() {
    const {
      center,
      filterByValue,
      distance,
      selectedItem,
      district,
    } = this.props;
    this.map.resize();

    // Highlight selected item
    if (this.props.selectedItem !== selectedItem) {
      this.toggleFilters('group-point-selected', ['==', 'id', selectedItem ? selectedItem.id : false]);
    }

    if (filterByValue.state) {
      let bbname = filterByValue.state[0].toUpperCase();
      if (district) {
        const zeros = '00';
        const districtString = district.toString();
        const districtPadded = zeros
          .substring(0, zeros.length - districtString.length) + districtString;
        bbname = `${bbname}${districtPadded}`;

        // highlight district
        const stateFIPS = states.find(cur => cur.USPS === filterByValue.state[0]).FIPS;
        const geoID = `${stateFIPS}${districtPadded}`;
        const selectObj = { state: filterByValue.state[0], district: districtPadded, geoID };

        this.districtSelect(selectObj);
      }
      const stateBB = bboxes[bbname];
      return this.focusMap(stateBB);
    }
    if (center.LNG) {
      this.map.resize();
      this.map.flyTo({
        center: [Number(center.LNG), Number(center.LAT)],
        zoom: 9.52 - (distance * (4.7 / 450)),
      });
      return this.map.resize();
    }

    return this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
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
        return popup.setLngLat(feature.geometry.coordinates)
          .setHTML(`
            <h4>${feature.properties.title}</h4>
            <div>${feature.properties.city}</div>
            ${feature.properties.facebook ? `
              <div><a href=${feature.properties.facebook} target="_blank"><span class="connect-text-popover">connect via facebook</span></a></div>
              ` : `
              `}

            ${feature.properties.twitter ?  `
                <div><a href=${feature.properties.twitter} target="_blank"><span class="connect-text-popover">connect via twitter</span></a></div>
              ` : `
              `}

            ${feature.properties.email ? `
                <div><a href=${feature.properties.email} target="_blank"></span><span class="connect-text-popover">connect via email</span></a></div>
              ` : `
              `}
            ${linkMapping[type]}
            `)
          .addTo(map);
      }
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

  toggleFilters(layer, filterSetting) {
    this.map.setFilter(layer, filterSetting);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  // Handles the highlight for districts when clicked on.
  highlightDistrict(geoid) {
    let filterSetting;
    // Filter for which district has been selected.
    if (typeof geoid === 'object') {
      filterSetting = ['any'];

      geoid.forEach((i) => {
        filterSetting.push(['==', 'GEOID', i]);
      });
    } else {
      filterSetting = ['all', ['==', 'GEOID', geoid]];
    }
    // Set that layer filter to the selected
    this.toggleFilters('selected-fill', filterSetting);
    this.toggleFilters('selected-border', filterSetting);
  }

  addClickListener() {
    const {
      searchByDistrict,
      setLatLng,
    } = this.props;
    const { map } = this;

    map.on('click', (e) => {
      const { searchType } = this.map.metadata;
      if (searchType === 'proximity') {
        // handle proximity
        const points = map.queryRenderedFeatures(e.point, { layers: ['group-points'] });
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
        const points = map.queryRenderedFeatures(e.point, { layers: ['group-points'] });

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

  initializeMap() {
    const { searchType } = this.props;

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
      this.map.setLayoutProperty('group-points', 'visibility', 'visible');

      this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
      this.addClickListener();

      this.addPopups('group-points');
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
      searchByQueryString,
      refcode,
      setLatLng,
      distance,
      searchType,
    } = this.props;

    if (this.map) {
      this.map.resize();
    }

    return (
      <React.Fragment>
        <div id="map" >
          <div className="map-overlay" id="legend">
            <MapInset
              center={center}
              colorMap={colorMap}
              district={district}
              searchByQueryString={searchByQueryString}
              items={[]}
              stateName="AK"
              type={type}
              filterByValue={filterByValue}
              resetSelections={resetSelections}
              searchByDistrict={searchByDistrict}
              refcode={refcode}
              setLatLng={setLatLng}
              distance={distance}
              searchType={searchType}
              mapId="map-overlay-alaska"
              bounds={[[-170.15625, 51.72702815704774], [-127.61718749999999, 71.85622888185527]]}
            />
            <MapInset
              center={center}
              colorMap={colorMap}
              district={district}
              searchByQueryString={searchByQueryString}
              items={[]}
              stateName="HI"
              type={type}
              filterByValue={filterByValue}
              resetSelections={resetSelections}
              searchByDistrict={searchByDistrict}
              refcode={refcode}
              setLatLng={setLatLng}
              distance={distance}
              searchType={searchType}
              mapId="map-overlay-hawaii"
              bounds={
              [[-161.03759765625, 18.542116654448996], [-154.22607421875, 22.573438264572406]]
            }
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
  type: PropTypes.string.isRequired,
  resetSelections: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  filterByValue: PropTypes.shape({}),
  distance: PropTypes.number,
  searchType: PropTypes.string,
  selectedItem: PropTypes.shape({}),
  district: PropTypes.string,
  refcode: PropTypes.string,
  searchByDistrict: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
};

MapView.defaultProps = {
  center: {},
  filterByValue: {},
  distance: 50,
  selectedItem: null,
  searchType: 'proximity',
  refcode: '',
  district: '',
};

export default MapView;
