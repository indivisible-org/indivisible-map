/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import {
  getVisbleEvents,
  getColorMap,
  getEvents,
} from '../state/events/selectors';
import { startSetEvents } from '../state/events/actions';

import {
  getDistance,
  getLocation,
  getRefCode,
  getFilterBy,
  getFilterValue,
} from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import SideBar from './SideBar';
import MapView from '../components/MapView';

class EventsDashboard extends React.Component {
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
      getInitialEvents,
    } = this.props;
    getInitialEvents()
      .then((returned) => {
        this.props.setInitialFilters(returned);
        this.setState({ init: false });
      });
  }

  render() {
    const {
      allEvents,
      distance,
      visibleEvents,
      center,
      colorMap,
      refcode,
      setLatLng,
      resetSearchByZip,
      filterBy,
      filterValue,
    } = this.props;
    if (this.state.init) {
      return null;
    }

    return (
      <Layout>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar
          colorMap={colorMap}
          items={visibleEvents}
          allItems={allEvents}
          refcode={refcode}
          type="events"
          resetSearchByZip={resetSearchByZip}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          collapsedText="Filters & Events"
        />

        <Layout>
          <MapView
            items={visibleEvents}
            center={center}
            colorMap={colorMap}
            type="events"
            filterByValue={{ [filterBy]: [filterValue] }}
            resetSearchByZip={resetSearchByZip}
            setLatLng={setLatLng}
            distance={distance}
          />
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  visibleEvents: getVisbleEvents(state),
  allEvents: getEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  refcode: getRefCode(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  distance: getDistance(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialEvents: () => dispatch(startSetEvents()),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
});

EventsDashboard.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setRefCode: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  getInitialEvents: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  resetSearchByZip: PropTypes.func.isRequired,
  filterBy: PropTypes.string,
  filterValue: PropTypes.arrayOf(PropTypes.string),
};

EventsDashboard.defaultProps = {
  center: null,
  refcode: '',
  filterBy: 'all',
  filterValue: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
