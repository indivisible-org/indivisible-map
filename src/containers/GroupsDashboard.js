import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getColorMap } from '../state/events/selectors';

import {
  getVisbleGroups,
  getGroups,
  getSelectedGroup,
} from '../state/groups/selectors';
import { startSetGroups, selectGroup } from '../state/groups/actions';

import {
  getLocation,
  getDistance,
  getFilterBy,
  getFilterValue,
} from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import GroupMapView from '../components/GroupMap';

import SideBar from './SideBar';
import SearchBar from './SearchBar';

class GroupsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
    };
  }

  componentWillMount() {
    const {
      setRefCode,
    } = this.props;

    if (document.location.search) {
      setRefCode(document.location.search);
    }
  }

  componentDidMount() {
    const {
      getInitalGroups,
    } = this.props;
    getInitalGroups()
      .then(() => {
        this.setState({ init: false });
      });
  }

  render() {
    const {
      allGroups,
      distance,
      groups,
      selectedGroup,
      selectItem,
      colorMap,
      center,
      filterBy,
      filterValue,
      resetSelections,
      setLatLng,
      searchByQueryString,
    } = this.props;
    if (this.state.init) {
      return null;
    }

    const containerClass = classNames({
      'groups-container': true,
      'main-container': true,
      'full-width': ((!center.LAT) && (filterBy === 'all')),
    });
    return (
      <div className={containerClass}>
        <SearchBar items={groups} type="groups" />
        <SideBar
          type="groups"
          items={groups}
          allItems={allGroups}
          resetHandler={resetSelections}
          selectItem={selectItem}
        />
        <GroupMapView
          center={center}
          type="groups"
          items={groups}
          colorMap={colorMap}
          filterByValue={{ [filterBy]: [filterValue] }}
          resetSelections={resetSelections}
          setLatLng={setLatLng}
          distance={distance}
          selectedItem={selectedGroup}
          searchByQueryString={searchByQueryString}
        />
        <div className="footer" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allGroups: getGroups(state),
  groups: getVisbleGroups(state),
  colorMap: getColorMap(state),
  center: getLocation(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  distance: getDistance(state),
  selectedGroup: getSelectedGroup(state),
});

const mapDispatchToProps = dispatch => ({
  getInitalGroups: () => dispatch(startSetGroups()),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  selectItem: val => dispatch(selectGroup(val)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
});

GroupsDashboard.propTypes = {
  allGroups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  center: PropTypes.shape({}).isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.number.isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  filterBy: PropTypes.string.isRequired,
  filterValue: PropTypes.string.isRequired,
  setRefCode: PropTypes.func.isRequired,
  getInitalGroups: PropTypes.func.isRequired,
  resetSelections: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsDashboard);
