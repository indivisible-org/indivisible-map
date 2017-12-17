import React from 'react';
import PropTypes from 'prop-types';
import EventCell from './EventCell';

class EventsTable extends React.Component {
  render() {
    let { events } = this.props;
    return (
      <div id="events-list">
        {events.map((indivisibleEvent) => {
          return <EventCell key={indivisibleEvent.id} indivisibleEvent={indivisibleEvent} />;
        })}
      </div>
    );
  }
}

EventsTable.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EventsTable;
