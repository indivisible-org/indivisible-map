import moment from 'moment';

// Get visible expenses
const getVisibleGroups = (groups, { text, sortBy }) => {
  return groups.filter((group) => {
    if (sortBy === 'all') {
      return group;
    }
    if (sortBy === 'zip' || sortBy === 'district') { // check if number
      console.log('zip or district with val: ', sortBy);
      if (group[sortBy] === text) {
        return group;
      }
    } else {
      console.log('string value type')
      return group[sortBy].toLowerCase().includes(text.toLowerCase()); // var inste of title
    }
  }).sort((a, b) => {
    return a.starts_at < b.starts_at ? 1 : -1;
  });
};

export default getVisibleGroups;
