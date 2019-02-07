import moment from 'moment';

class Point {
  constructor(eventOrGroup) {
    this.type = 'Feature';
    this.geometry = {
      coordinates: [Number(eventOrGroup.longitude), Number(eventOrGroup.latitude)],
      type: 'Point',
    };
    this.properties = {
      address: eventOrGroup.address1 || eventOrGroup.city,
      district: eventOrGroup.title.split('-'),
      icon: eventOrGroup.icon || 'other-icon',
      id: eventOrGroup.id || null,
      rsvpHref: eventOrGroup.rsvpHref || null,
      socials: eventOrGroup.socials || [],
      startsAt: eventOrGroup.starts_at ? moment(eventOrGroup.starts_at).format('MMMM Do YYYY, h:mm a') : '',
      state: eventOrGroup.state || null,
      title: eventOrGroup.title || eventOrGroup.name,
      url: eventOrGroup.url || null,
      venue: eventOrGroup.venue || '',
    };
  }
}

export default Point;
