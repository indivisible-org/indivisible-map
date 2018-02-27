import React from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import {
  Button,
  List,
  Collapse,
  Icon,
} from 'antd';
import { firebaseUrl } from '../state/constants';

const { Panel } = Collapse;

/* eslint-disable */
require('style-loader!css-loader!antd/es/collapse/style/index.css');
require('style-loader!css-loader!antd/es/list/style/index.css');
require('style-loader!css-loader!antd/es/button/style/index.css');
/* eslint-enable */

// avatar={}

class TableCell extends React.Component {
  constructor(props) {
    super(props);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderGroupHeader = this.renderGroupHeader.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.handlePanelOpen = this.handlePanelOpen.bind(this);
  }

  getEmail(e) {
    e.preventDefault();
    const ele = e.target;
    const { id } = ele;
    const mailto = document.getElementById(`${id}-target`);
    superagent.get(`${firebaseUrl}/indivisible_group_emails/${id}.json`)
      .then((res) => {
        mailto.innerHTML = res.body;
        mailto.href = `mailto:${res.body}`;
      })
      .then(ele.classList.add('disabled'));
  }

  handlePanelOpen(e) {
    const ele = document.getElementById(e.target.id);
    if (ele.classList.contains('open')) {
      ele.classList.remove('open');
      ele.classList.add('closed');
    } else {
      ele.classList.remove('closed');
      ele.classList.add('open');
    }
  }

  renderHeader(item) {
    const { color, refcode } = this.props;
    const groupName = item.group_name ? (<li>Hosted by <strong>{item.group_name}</strong></li>) : '';
    const eventType = item.eventType ? (<li><strong>Event type:</strong> {item.eventType}</li>) : '';

    return (
      <List.Item
        key={item.id}
        className="event-cell"
        extra={[<a target="_blank" href={`${item.rsvpHref}${refcode}`}>rsvp</a>]}
      >
        {
          <ul>
            <li><strong>{moment(item.starts_at).format('MMMM Do, YYYY')}</strong></li>
            <li>{item.address1}</li>
            <li>{item.city}</li>
            <li>{item.state}, {item.zip}</li>
            {eventType}
            <li><strong>Event Focus:</strong> {item.issueFocus}</li>
            <li className="read-more closed" onClick={this.handlePanelOpen} id={item.id}>
              {item.public_description}
            </li>
          </ul>
        }
        <List.Item.Meta
          title={item.title}
          description={
            <ul>
              {groupName}
            </ul>
        }
        />
      </List.Item>
    );
  }

  renderGroupHeader(item) {
    let actions = [];
    if (item.socials) {
      actions = item.socials.reduce((acc, ele) => {
        if (ele.category === 'facebook') {
          acc.push(<a href={ele.url} target="_blank"><Icon type="facebook" /></a>);
        }
        if (ele.category === 'twitter') {
          acc.push(<a href={ele.url} target="_blank"><Icon type="twitter" /></a>);
        }
        return acc;
      }, []);
    } else if (item.email) {
      actions.push(<React.Fragment>
        <Button
          onClick={this.getEmail}
          type="primary"
          size="small"
          icon="mail"
          id={item.id}
          shape="circle"
        />
        <a id={`${item.id}-target`} />
                   </React.Fragment>);
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
              <li>{item.city} {item.state}, {item.zip}</li>
            </ul>
          }
        />
      </List.Item>
    );
  }

  renderEvents() {
    const { item } = this.props;
    return this.renderHeader(item);
  }

  renderGroups() {
    const { item, selectItem } = this.props;
    return (
      <div onMouseEnter={() => selectItem(item)} onMouseLeave={() => selectItem(null)}>
        <Panel
          header={this.renderGroupHeader(item)}
          key={item.name}
          showArrow={false}
        />
      </div>
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
  selectItem: PropTypes.func,
};

TableCell.defaultProps = {
  color: 'white',
  refcode: '',
  selectItem: () => {},
};

export default TableCell;
