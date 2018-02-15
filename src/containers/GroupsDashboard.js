import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getColorMap,

} from '../state/events/selectors';

import {
  getFilteredGroups,
  getGroups,
} from '../state/groups/selectors';
import { startSetGroups } from '../state/groups/actions';
import * as selectionActions from '../state/selections/actions';

import MapView from '../components/MapView';

import SideBar from './SideBar';

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
      groups,
      colorMap,
    } = this.props;

    if (this.state.init) {
      return null;
    }

    return (
      <div>
        <h2 className="dash-title">Group Dashboard</h2>
        <SideBar type="groups" items={groups} allItems={allGroups} />
        <MapView type="groups" items={groups} colorMap={colorMap} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allGroups: getGroups(state),
  groups: getFilteredGroups(state),
  colorMap: getColorMap(state),
});

const mapDispatchToProps = dispatch => ({
  getInitalGroups: () => dispatch(startSetGroups()),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
});

GroupsDashboard.propTypes = {
  allGroups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setRefCode: PropTypes.func.isRequired,
  getInitalGroups: PropTypes.func.isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsDashboard);
