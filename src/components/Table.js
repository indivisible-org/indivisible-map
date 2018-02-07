import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import { find } from 'lodash';

import TableCell from './TableCell';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.getColor = this.getColor.bind(this);
  }
  getColor(issueFocus) {
    const { colorMap } = this.props;

    const colorObj = find(colorMap, { filter: issueFocus });
    let color = '';
    if (colorObj) {
      color = colorObj.color;
    }
    return color;
  }

  render() {
    const { items } = this.props;

    return (
      <List
        id="events-list"
        itemLayout="vertical"
        dataSource={items}
        renderItem={item =>
          (<TableCell
            key={item.id}
            item={item}
            color={this.getColor(item.issueFocus)}
          />)}
      />
    );
  }
}

Table.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
