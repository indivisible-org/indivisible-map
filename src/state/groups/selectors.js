
// Get visible expenses
const getVisibleGroups = (groups, { text, sortBy }) =>
  groups.filter((group) => {
    if (sortBy === 'all') {
      return group;
    }
    if (sortBy === 'zip' || sortBy === 'district') {
      if (group[sortBy] === text) {
        return group;
      }
    } else {
      return group[sortBy].toLowerCase().includes(text.toLowerCase());
    }
  }).sort((a, b) => (a.starts_at < b.starts_at ? 1 : -1));

export default getVisibleGroups;
