import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventCell from './EventCell';

class EventsTable extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div id="events-list">
        {this.props.events.map((indivisibleEvent) => {
          return <EventCell key={indivisibleEvent.id} indivisibleEvent={indivisibleEvent} />;
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.eventState.events, // selectEvents(state.events, state.filters)
    featuresHome: state.eventState.featuresHome,
  };
};

// EventsTable.propTypes = {
//   events: PropTypes.arrayOf(PropTypes.shape({
//     address1: PropTypes.string,
//     city: PropTypes.string,
//     latitude: PropTypes.number,
//     longitude: PropTypes.number,
//   })).isRequired,
// };

// EventsTable.propTypes = {
  // events: PropTypes.arrayOf(PropTypes.object).isRequired,
  // featuresHome: PropTypes.shape({
  //   type: PropTypes.string,
  //   features: PropTypes.arrayOf(PropTypes.object),
  // }).isRequired,
// };


export default connect(mapStateToProps)(EventsTable);
