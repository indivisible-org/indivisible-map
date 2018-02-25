const groupsReducerDefaultState = {
  allGroups: [],
  selectedGroup: null,
};

const groupsReducer = (state = groupsReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_GROUPS':
      return {
        ...state,
        allGroups: [...state.allGroups, ...action.groups],
      };
    case 'SELECT_GROUP':
      return {
        ...state,
        selectedGroup: action.group,
      };
    default:
      return state;
  }
};

export default groupsReducer;
