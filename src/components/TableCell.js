import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { List, Collapse, Avatar } from 'antd';

const { Panel } = Collapse;

/* eslint-disable */
require('style-loader!css-loader!antd/es/collapse/style/index.css');
require('style-loader!css-loader!antd/es/list/style/index.css');
/* eslint-enable */

// avatar={}

class TableCell extends React.Component {
  constructor(props) {
    super(props);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
  }

  renderHeader(item) {
    const { color, refcode } = this.props;
    return (
      <List.Item
        actions={[<a>more</a>, <a href={`${item.rsvpHref}${refcode}`}>rsvp</a>]}
        className="event-cell"
        extra={<Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="large" >U</Avatar>}
      >

        <List.Item.Meta

          title={item.title}
          description={
            <ul>
              <li>{moment(item.starts_at).format('MMMM Do, YYYY')}</li>
              <li>{item.address1}</li>
              <li>{item.city}</li>
              <li>Event Focus: {item.issueFocus}</li>
            </ul>
        }
        />
      </List.Item>

    );
  }

  renderEvents() {
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

  render() {
    const { item } = this.props;
    return (
      <React.Fragment>
        {this.renderEvents()}
      </React.Fragment>
    );
  }
}

TableCell.propTypes = {
  item: PropTypes.shape({}).isRequired,
  color: PropTypes.string,
  refcode: PropTypes.string,
};

TableCell.defaultProps = {
  color: 'white',
  refcode: '',
};

export default TableCell;
