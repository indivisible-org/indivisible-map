import moment from 'moment';

// Get visible expenses
const getVisibleEvents = (events, { text, sortBy }) => {
  return events.filter((event) => {
    const textMatch = event.title.toLowerCase().includes(text.toLowerCase());
    return textMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return a.starts_at < b.starts_at ? 1 : -1;
    }
  });
};

export default getVisibleEvents;