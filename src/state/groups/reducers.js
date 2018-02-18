const groupsReducerDefaultState = {
  allGroups: [],
};

const groupsReducer = (state = groupsReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_GROUPS':
      console.log(state.allGroups.length, action.groups.length);
      return {
        ...state,
        allGroups: [...state.allGroups, ...action.groups],
      };
    default:
      return state;
  }
};

export default groupsReducer;
