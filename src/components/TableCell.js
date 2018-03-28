import React from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import {
  Card,
} from 'antd';
import { indivisibleUrl } from '../state/constants';

/* eslint-disable */
require('style-loader!css-loader!antd/es/card/style/index.css');
/* eslint-enable */

class TableCell extends React.Component {
  constructor(props) {
    super(props);
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
    superagent.get(`${indivisibleUrl}/indivisible_group_emails/${id}.json`)
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

  renderEvents() {
    const { item, color, refcode } = this.props;
    const groupName = item.group_name ? (<h4 className="event-host semi-bold">Hosted by {item.group_name}</h4>) : '';
    const eventType = item.eventType ? (<li>Event type: {item.eventType}</li>) : '';
    return (
      <Card
        className={`event-cell ${item.issueFocus.toLowerCase().replace(/\W/g, '-')}`}
        title={item.title}
        extra={[<a className="rsvp-button" target="_blank" href={`${item.rsvpHref}${refcode}`}>rsvp</a>]}
      >
        {groupName}
        <ul>
          {eventType}
          <li>Event Focus: {item.issueFocus}</li>
        </ul>
        <ul>
          <li className="semi-bold">{moment(item.starts_at).format('MMMM Do, YYYY')}</li>
          <li className="semi-bold">{moment(item.starts_at).format('h:mm A')}</li>
          <li>{item.address1}</li>
          <li>{item.city}</li>
          <li>{item.state}, {item.zip}</li>
          <li className="read-more closed" onClick={this.handlePanelOpen} id={item.id}>
            {item.public_description}
          </li>
        </ul>
      </Card>);
  }

  renderGroups() {
    const { item, selectItem } = this.props;
    let iconsSocial;
    if (item.socials) {
      iconsSocial = item.socials.reduce((acc, ele) => {
        if (ele.category === 'facebook') {
          acc.push(<li key={ele.url}>
            <a href={ele.url} target="_blank">
              <div className="facebook-icon">
                <span className="connect-text">connect via facebook</span>
              </div>
            </a>
                   </li>);
        }
        if (ele.category === 'twitter') {
          acc.push(<li key={ele.url}>
            <a href={ele.url} target="_blank">
              <div className="twitter-icon">
                <span className="connect-text">connect via twitter</span>
              </div>
            </a>
                   </li>);
        }
        return acc;
      }, []);
    }
    return (
      <div onMouseEnter={() => selectItem(item)} onMouseLeave={() => selectItem(null)}>
        <Card
          className="indivisible-card group-cell"
          title={item.name}
        >
          <ul>
            <li id="group-location">{item.city} {item.state}, {item.zip}</li>
          </ul>
          <ul>
            {iconsSocial}
          </ul>
        </Card>
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
