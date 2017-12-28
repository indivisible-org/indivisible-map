import moment from 'moment';

// Get visible expenses
const getVisibleGroups = (groups, { text, sortBy }) => {
  return groups.filter((group) => {
    const textMatch = group.title.toLowerCase().includes(text.toLowerCase());
    return textMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return a.starts_at < b.starts_at ? 1 : -1;
    }
  });
};

export default getVisibleGroups;