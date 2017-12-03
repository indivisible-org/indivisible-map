import React from "react";

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      featuresHome: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-122.3321, 47.6062]
            },
            properties: {
              icon: "host-group"
            }
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-76.609383, 39.299236]
            },
            properties: {
              icon: "issue"
            }
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-117.071869, 32.774799]
            },
            properties: {
              icon: "challenge"
            }
          }
        ]
      }
    };
  }

  initializeMap() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxhbjA0MCIsImEiOiJjamFrNm81dWkyZzMzMnhsZTI3bjR3eDVoIn0.K3FKPy6S_PwzjDjb02aGHA";
    const style_url = "mapbox://styles/alan040/cjaqgutcnhdun2slmi3xbhgu1";

    const map = new mapboxgl.Map({
      container: "map",
      style: style_url
    });

    const addLayer = () => {
      map.addLayer(
        {
          id: "townhall-points",
          type: "symbol",
          source: {
            type: "geojson",
            data: this.state.featuresHome
          },
          layout: {
            "icon-image": "{icon}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "icon-ignore-placement": true,
            "icon-ignore-placement": true,
            "icon-offset": {
              base: 1,
              stops: [[0, [0, -15]], [10, [0, -10]], [12, [0, 0]]]
            }
          }
        },
        "district_interactive"
      );
    }

    // Set Mapbox map controls
    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    // map on 'load'
    map.on("load", function() {
      map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
      addLayer();
    });
  }

  componentDidMount() {
    this.initializeMap();
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

export default MapView;
