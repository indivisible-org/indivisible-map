/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getVisbleEvents,
  getColorMap,
} from '../state/events/selectors';
import { startSetEvents } from '../state/events/actions';

import {
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
      visibleEvents,
      center,
      colorMap,
      refcode,
      resetSearchByZip,
      filterBy,
      filterValue,
    } = this.props;
    if (this.state.init) {
      return null;
    }

    return (
      <div>
        <h2 className="dash-title">Event Dashboard</h2>
        <SideBar
          colorMap={colorMap}
          items={visibleEvents}
          refcode={refcode}
          type="events"
          resetSearchByZip={resetSearchByZip}
        />
        <MapView
          items={visibleEvents}
          center={center}
          colorMap={colorMap}
          type="events"
          filterByValue={{ [filterBy]: [filterValue] }}
          resetSearchByZip={resetSearchByZip}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  visibleEvents: getVisbleEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  refcode: getRefCode(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialEvents: () => dispatch(startSetEvents()),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
});

EventsDashboard.propTypes = {
  center: PropTypes.shape({ LAT: PropTypes.string, LNG: PropTypes.string, ZIP: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setRefCode: PropTypes.func.isRequired,
  getInitialEvents: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  resetSearchByZip: PropTypes.func.isRequired,
};

EventsDashboard.defaultProps = {
  center: null,
  refcode: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
