import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getColorMap,
} from '../state/events/selectors';

import { getFilteredGroups } from '../state/groups/selectors';
import { startSetGroups } from '../state/groups/actions';

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

    if (location.search) {
      setRefCode(location.search);
    }
  }

  componentDidMount() {
    const {
      initalGroups,
    } = this.props;
    initalGroups()
      .then((returned) => {
        this.setState({ init: false });
      });
  }

  render() {
    const {
      groups,
      colorMap,
    } = this.props;

    if (this.state.init) {
      return null;
    }

    return (
      <div>
        <h2 className="dash-title">Group Dashboard</h2>
        <SideBar type="groups" items={groups} />
        <MapView type="groups" items={groups} colorMap={colorMap} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: getFilteredGroups(state),
  colorMap: getColorMap(state),
});

const mapDispatchToProps = dispatch => ({
  initalGroups: () => dispatch(startSetGroups()),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
});

GroupsDashboard.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsDashboard);
