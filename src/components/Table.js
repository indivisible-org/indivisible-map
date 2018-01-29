import React from 'react';
import PropTypes from 'prop-types';

import TableCell from './TableCell';

class Table extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div id="events-list">
        {items.map(item => <TableCell key={item.id} item={item} />)}
      </div>
    );
  }
}

Table.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
