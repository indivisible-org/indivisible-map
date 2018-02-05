import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';

import TableCell from './TableCell';

class Table extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <List
        id="events-list"
        itemLayout="vertical"
        dataSource={items}
        renderItem={item => <TableCell key={item.id} item={item} />}
      />
    );
  }
}

Table.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
