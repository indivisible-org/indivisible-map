import React from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import faFacebookSquare from '@fortawesome/fontawesome-free-brands/faFacebookSquare';
import faTwitterSquare from '@fortawesome/fontawesome-free-brands/faTwitterSquare';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faExternalLinkSquareAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkSquareAlt';
import { Card } from 'antd';
import { indivisibleUrl } from '../state/constants';

/* eslint-disable */
require('style-loader!css-loader!antd/es/card/style/index.css');
require('style-loader!css-loader!antd/es/button/style/index.css');
/* eslint-enable */

class TableCell extends React.Component {
  static getEmail(e) {
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

  static handlePanelOpen(e) {
    const ele = document.getElementById(e.target.id);
    if (ele.classList.contains('open')) {
      ele.classList.remove('open');
      ele.classList.add('closed');
    } else {
      ele.classList.remove('closed');
      ele.classList.add('open');
    }
  }

  static makeDisplayName(item) {
    if (item.campaignNo === '19') {
      if (item.actionGroupName &&
        item.actionHostName &&
        item.actionGroupName === item.actionHostName) {
        return item.actionGroupName;
      } else if (item.actionGroupName && item.actionHostName) {
        return `${item.actionGroupName} and ${item.actionHostName}`;
      } else if (item.actionGroupName) {
        return item.actionGroupName;
      } else if (item.actionHostName) {
        return item.actionHostName;
      }
    }
    return item.group_name;
  }

  constructor(props) {
    super(props);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderEvents = this.renderEvents.bind(this);
  }

  renderEvents() {
    const {
      iconName,
      item,
      refcode,
    } = this.props;
    const displayName = TableCell.makeDisplayName(item);
    const groupName = displayName ? (<h4 className="event-host semi-bold">Hosted by {displayName}</h4>) : '';
    const eventType = item.eventType ? (<li>Event Type: {item.eventType}</li>) : '';
    return (
      <Card
        className={`event-cell ${iconName} ${item.issueFocus.toLowerCase().replace(/\W/g, '-')}`}
        key={`${item.id}`}
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
          <li className="read-more closed" onClick={TableCell.handlePanelOpen} id={item.id}>
            {item.public_description}
          </li>
        </ul>
      </Card>);
  }

  renderGroups() {
    const { item, selectItem } = this.props;
    let iconsSocial = [];
    if (item.socials) {
      iconsSocial = item.socials.reduce((acc, ele) => {
        if (ele.category === 'facebook') {
          acc.push(
            <li key={ele.url}>
              <a href={ele.url} target="_blank">
                <FontAwesomeIcon icon={faFacebookSquare} />
                <span className="connect-text">connect via facebook</span>
              </a>
            </li>);
        }
        if (ele.category === 'twitter') {
          acc.push(
            <li key={ele.url}>
              <a href={ele.url} target="_blank">
                <FontAwesomeIcon icon={faTwitterSquare} />
                <span className="connect-text">connect via twitter</span>
              </a>
            </li>);
        }
        return acc;
      }, []);
    }
    if (item.email) {
      iconsSocial.push(
        <React.Fragment>
          <li key={item.id} >
            <a onClick={TableCell.getEmail} id={item.id}>
              <FontAwesomeIcon
                icon={faEnvelope}
              />
              <span id={item.id} className="connect-text">connect via email</span>
            </a>
          </li>
          <li>
            <a className="email-link" id={`${item.id}-target`} href="" />
          </li>
        </React.Fragment>);
    }
    if (item.url) {
      iconsSocial.push(
        <li key={item.url}>
          <a href={item.url} target="_blank">
            <FontAwesomeIcon icon={faExternalLinkSquareAlt} />
            <span className="connect-text">visit website</span>
          </a>
        </li>)
    }
    return (
      <div onMouseEnter={() => selectItem(item)} onMouseLeave={() => selectItem(null)}>
        <Card
          className="indivisible-card group-cell"
          key={item.id}
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
    const renderMapping = {
      events: this.renderEvents,
      groups: this.renderGroups,
    };
    return (
      <React.Fragment>
        {renderMapping[type]()}
      </React.Fragment>
    );
  }
}

TableCell.propTypes = {
  color: PropTypes.string,
  iconName: PropTypes.string,
  item: PropTypes.shape({}).isRequired,
  refcode: PropTypes.string,
  selectItem: PropTypes.func,
  type: PropTypes.string.isRequired,
};

TableCell.defaultProps = {
  color: '',
  iconName: '',
  refcode: '',
  selectItem: () => {},
};

export default TableCell;
