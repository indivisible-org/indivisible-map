import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TableCell extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <div className="event-cell">
        <h3>
          {item.title}
        </h3>
        <ul>
          <li>Time: {moment(item.starts_at).format('MMMM Do, YYYY')}</li>
          <li>City: {item.city}</li>
          <li>Address: {item.address1}</li>
          <li>Event Focus: {item.issueFocus}</li>
          <li>Event Description:
            <p>{item.public_description}</p>
          </li>
          <li><a className="rsvp-button" href={item.rsvpHref}>RSVP</a></li>
        </ul>
      </div>
    );
  }
}

TableCell.propTypes = {
  item: PropTypes.shape({}).isRequired,
};

export default TableCell;
