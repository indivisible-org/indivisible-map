import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class EventCell extends React.Component {

  render() {
    // get data depending on dataType (groups of events)
    // from redux store
    const { indivisibleEvent } = this.props;
    return (
      <div className="event-cell">
        <h3>
          {indivisibleEvent.title}
        </h3>
        <ul>
          <li>Time: {moment(indivisibleEvent.starts_at).format('MMMM Do, YYYY')}</li>
          <li>City: {indivisibleEvent.city}</li>
          <li>Address: {indivisibleEvent.address1}</li>
          <li>Event Focus: {indivisibleEvent.fields[0].value}</li>
        </ul>
      </div>
    );
  }
}

EventCell.propTypes = {
  indivisibleEvent: PropTypes.shape({
    id: PropTypes.number,
    address1: PropTypes.string,
    city: PropTypes.string,
    field: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default EventCell;
