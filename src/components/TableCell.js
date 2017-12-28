import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TableCell extends React.Component {

  render() {
    // get data depending on dataType (groups of events)
    // from redux store
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
          <li>Event Focus: {item.fields[0].value}</li>
        </ul>
      </div>
    );
  }
}

// will need to edit for agnostic
TableCell.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    address1: PropTypes.string,
    city: PropTypes.string,
    field: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default TableCell;
