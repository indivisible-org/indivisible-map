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
    if (colorObj) {
      return colorObj.color;
    }
    return '';
  }

  render() {
    const {
      items,
      refcode,
      type,
    } = this.props;
    return (
      <List
        id="events-list"
        itemLayout="vertical"
        dataSource={items}
        renderItem={item =>
          (<TableCell
            key={item.id}
            item={item}
            refcode={refcode}
            type={type}
            color={this.getColor(item.issueFocus)}
          />)}
      />
    );
  }
}

Table.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  refcode: PropTypes.string,
  colorMap: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Table.defaultProps = {
  refcode: '',
};

export default Table;
