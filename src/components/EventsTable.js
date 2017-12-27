import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventCell from './EventCell';

class EventsTable extends React.Component {
  render() {
    console.log(this.state);
    return (
      <div id="events-list">
        {events.map((indivisibleEvent) => {
          return <EventCell key={indivisibleEvent.id} indivisibleEvent={indivisibleEvent} />;
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.events, // selectEvents(state.events, state.filters)
  };
};

// EventsTable.propTypes = {
//   events: PropTypes.arrayOf(PropTypes.object).isRequired,
// };


export default connect(mapStateToProps)(EventsTable);
