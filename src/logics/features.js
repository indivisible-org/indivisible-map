import moment from 'moment';

class Point {
  constructor(eventOrGroup) {
    this.type = 'Feature';
    this.geometry = {
      type: 'Point',
      coordinates: [eventOrGroup.longitude, eventOrGroup.latitude],
    };
    this.properties = {
      icon: eventOrGroup.icon || 'host-group',
      address: eventOrGroup.address1,
      startsAt: eventOrGroup.starts_at ? moment(eventOrGroup.starts_at).format('MMMM Do YYYY, h:mm a') : null,
      title: eventOrGroup.title,
      venue: eventOrGroup.venue || null,
    };
  }
}

export default Point;
