import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  List,
  Collapse,
  Avatar,
  Icon,
} from 'antd';

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
    this.renderGroupHeader = this.renderGroupHeader.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
  }

  renderHeader(item) {
    const { color, refcode } = this.props;
    const groupName = item.groupName ? `Group Name: ${item.groupName}` : '';
    const eventType = item.eventType ? `Event type: ${item.eventType}` : '';

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
              <li><strong>{moment(item.starts_at).format('MMMM Do, YYYY')}</strong></li>
              <li>{groupName}</li>
              <li>{eventType}</li>
              <li>{item.address1}</li>
              <li>{item.city}</li>
              <li>{item.state}, {item.zip}</li>
              <li>Event Focus: {item.issueFocus}</li>
            </ul>
      }
        />
      </List.Item>
    );
  }

  renderGroupHeader(item) {
    let actions;
    if (item.socials) {
      const socialIcons = item.socials.reduce((acc, ele) => {
        if (ele.category === 'facebook') {
          acc.push(<a href={ele.url} target="_blank"><Icon type="facebook" /></a>);
        }
        if (ele.category === 'twitter') {
          acc.push(<a href={ele.url} target="_blank"><Icon type="twitter" /></a>);
        }
        return acc;
      }, []);
      socialIcons.push(<a href="">email</a>);
      actions = socialIcons;
    } else {
      actions = [<a href="">email</a>];
    }
    return (
      <List.Item
        actions={actions}
        className="event-cell"
      >
        <List.Item.Meta

          title={item.name}
          description={
            <ul>
              <li>{item.city}</li>
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

  renderGroups() {
    const { item } = this.props;
    return (
      <Panel header={this.renderGroupHeader(item)} key={item.name} showArrow={false} />
    );
  }

  render() {
    const { type } = this.props;
    const renderMap = {
      events: this.renderEvents,
      groups: this.renderGroups,
    };
    return (
      <React.Fragment>
        {renderMap[type]()}
      </React.Fragment>
    );
  }
}

TableCell.propTypes = {
  item: PropTypes.shape({}).isRequired,
  color: PropTypes.string,
  refcode: PropTypes.string,
  type: PropTypes.string.isRequired,
};

TableCell.defaultProps = {
  color: 'white',
  refcode: '',
};

export default TableCell;
