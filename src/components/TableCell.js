import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { List, Collapse } from 'antd';

const { Panel } = Collapse;
require('style-loader!css-loader!antd/es/collapse/style/index.css');
require('style-loader!css-loader!antd/es/list/style/index.css');


class TableCell extends React.Component {
  renderHeader(item) {
    return (
      <List.Item actions={[<a>more</a>, <a href={item.rsvpHref}>rsvp</a>]} className="event-cell">

        <List.Item.Meta
          title={item.title}
          description={<ul>
            <li>Time: {moment(item.starts_at).format('MMMM Do, YYYY')}</li>
            <li>Address: {item.address1}</li>
            <li>{item.city}</li>
            <li>Event Focus: {item.issueFocus}</li>
          </ul>}
        />
      </List.Item>

    );
  }

  render() {
    const { item } = this.props;
    return (
      <Collapse bordered={false} showArrow={false} >
        <Panel header={this.renderHeader(item)} key={item.title} showArrow={false}>

          <li>Event Description:
            <p>{item.public_description}</p>
          </li>
        </Panel>
      </Collapse>
    );
  }
}

TableCell.propTypes = {
  item: PropTypes.shape({}).isRequired,
};

export default TableCell;
