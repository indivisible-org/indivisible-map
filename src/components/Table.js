import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import TableCell from './TableCell';

class Table extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div id="events-list">
        {items.map((item) => {
          return <TableCell key={item.id} item={item} />;
        })}
      </div>
    );
  }
}

export default Table;
