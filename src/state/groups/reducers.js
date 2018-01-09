const groupsReducerDefaultState = {
  entities: [],
};

const groupsReducer = (state = groupsReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_GROUPS':
      return {
        ...state,
        groups: action.groups,
      };
    case 'SET_FEATURES_HOME_GROUP':
      return {
        ...state,
        featuresHome: action.featuresHome,
      };
    default:
      return state;
  }
}

export default groupsReducer;
