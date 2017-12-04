class Point {
  constructor(eventOrGroup) {
    this.type = 'Feature';
    this.geometry = {
      type: 'Point',
      coordinates: [eventOrGroup.longitude, eventOrGroup.latitude],
    };
    this.properties = {
      // TODO: make conditionals
      icon: 'host-group',
    };
  }
}

export default Point;
