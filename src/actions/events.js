import getData from '../logics/getData';
import Point from '../logics/features';

export const setEvents = events => ({
  type: 'SET_EVENTS',
  events,
});

export const setFeaturesHome = featuresHome => ({
  type: 'SET_FEATURES_HOME',
  featuresHome,
});

// BAD TWO URL CALLS FOR THINGS THAT WILL BE CALLED TOGETHER
// CAN I MAKE TWO DISPATCH CALLS IN ONE FUNCTINO?

export const startSetEvents = () => {
  console.log('startSetEvents called');
  return (dispatch) => {
    const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
    getData(url).then((result) => {
      const response = JSON.parse(result.text);
      console.log(response);
      const events = Object.keys(response).map(id => response[id]);
  
      // this.setState({ featuresHome });
      // this.setState({ events });
  
      // map.getSource('event-points').setData(featuresHome);
      dispatch(setEvents({ events }));
      // dispatch(setFeaturesHome({ featuresHome }));
      // dispatch to set featuresHome
      // need to access map to setData on map
      // or handle setData method inside of component
    });
  }
};

export const startSetFeaturesHome = () => {
  return (dispatch) => {
    const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
    getData(url).then((result) => {
      const response = JSON.parse(result.text);
      console.log(response);
      const events = Object.keys(response).map(id => response[id]);
      const featuresHome = {
        type: 'FeatureCollection',
        features: [],
      };
  
      featuresHome.features = events.map((indEvent) => {
        const newFeature = new Point(indEvent);
        return newFeature;
      });

      dispatch(setFeaturesHome({ featuresHome }));
    });
  };
};

// getEvents(map) {
//   const url = 'https://townhallproject-86312.firebaseio.com/indivisible_public_events.json';
//   getData(url).then((result) => {
//     const response = JSON.parse(result.text);
//     console.log(response);
//     const events = Object.keys(response).map(id => response[id]);
//     const featuresHome = {
//       type: 'FeatureCollection',
//       features: [],
//     };

//     featuresHome.features = events.map((indEvent) => {
//       const newFeature = new Point(indEvent);
//       return newFeature;
//     });

//     this.setState({ featuresHome });
//     this.setState({ events });

//     map.getSource('event-points').setData(featuresHome);
//   });
// }