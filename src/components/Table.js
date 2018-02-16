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
      shouldRender,
      type,
    } = this.props;
    if (!shouldRender) {
      return (
        <div id="groups-list">
          <p>Search for groups near you</p>
        </div>
      );
    }
    if (items.length === 0 && type === 'events') {
      return (
        <div id="events-list">
          <p>Looks like there are no events near you right now. You can create your own
            <a href="http://act.indivisible.org/event/local-actions/create/" target="_blank"> here.</a>
          </p>
        </div>
      );
    }
    return (
      <List
        id={`${type}-list`}
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
  colorMap: PropTypes.arrayOf(PropTypes.object),
  type: PropTypes.string.isRequired,
};

Table.defaultProps = {
  refcode: '',
  colorMap: [],
};

export default Table;
