import React from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import {
  Card,
  Typography,
} from 'antd';

import faFacebookSquare from '@fortawesome/fontawesome-free-brands/faFacebookSquare';
import faTwitterSquare from '@fortawesome/fontawesome-free-brands/faTwitterSquare';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faExternalLinkSquareAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkSquareAlt';
import { indivisibleUrl } from '../state/constants';

const { Paragraph } = Typography;
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
    return item.group_name;
  }

  static makeLocationInfo(item) {
    if (item.actionMeetingType === 'Tele-Town Hall') {
      if (item.phone) {
        return <li key={`${item.id}-phone`}>{item.phone}</li>;
      }
      if (item.linkToInfo) {
        return (
          <li key={`${item.id}-url`}>
            <a href={item.linkToInfo}>Link to connection info <FontAwesomeIcon icon={faExternalLinkSquareAlt} />
            </a>
          </li>);
      }
    }

    return <li>{item.address1}</li>;
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
      urlParams,
    } = this.props;
    const displayName = TableCell.makeDisplayName(item);
    const groupName = displayName ? (<h4 className="event-host semi-bold">Hosted by {displayName}</h4>) : '';
    const eventType = item.eventType ? (<li>{item.eventType}</li>) : '';
    const className = classNames('event-cell', iconName, {
      grassroots: item.issueFocus !== 'Town Hall' && item.issueFocus !== '2020 Candidate Event',
      'town-hall': item.issueFocus === 'Town Hall' || item.issueFocus === '2020 Candidate Event',
    });
    return (
      <Card
        className={className}
        key={`${item.id}`}
        title={
          <React.Fragment>
            <div className="issue-focus">{item.issueFocus}</div>
            <div className="title">{item.title}</div>
          </React.Fragment>
          }
        extra={[<a key={`${item.id}-rsvp`} className="rsvp-button" target="_blank" href={`${item.rsvpHref}?${urlParams}`}>rsvp</a>]}
      >
        {groupName}
        <ul>
          {eventType}
        </ul>
        <ul>
          <li className="semi-bold">{moment(item.starts_at).format('MMMM Do, YYYY')}</li>
          <li className="semi-bold">{moment(item.starts_at).format('h:mm A')}</li>
          {TableCell.makeLocationInfo(item)}

          <li>{item.city}</li>
          <li>{item.state}, {item.zip}</li>
          <li>

            <Paragraph ellipsis={{
              expandable: true,
              rows: 3,
              }}
            >
              {item.public_description}
            </Paragraph>
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
          acc.push(<li key={ele.url}>
            <a href={ele.url} target="_blank">
              <FontAwesomeIcon icon={faFacebookSquare} />
              <span className="connect-text">connect via facebook</span>
            </a>
          </li>);
        }
        if (ele.category === 'twitter') {
          acc.push(<li key={ele.url}>
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
      iconsSocial.push(<React.Fragment key={item.id}>
        <li>
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
      iconsSocial.push(<li key={item.url}>
        <a href={item.url} target="_blank">
          <FontAwesomeIcon icon={faExternalLinkSquareAlt} />
          <span className="connect-text">visit website</span>
        </a>
      </li>);
    }
    return (
      <div onMouseEnter={() => selectItem(item)} onMouseLeave={() => selectItem(null)}>
        <Card
          className="indivisible-card group-cell"
          key={item.id}
          title={<span className="title">{item.name}</span>}
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
  iconName: PropTypes.string,
  item: PropTypes.shape({}).isRequired,
  selectItem: PropTypes.func,
  type: PropTypes.string.isRequired,
  urlParams: PropTypes.string,
};

TableCell.defaultProps = {
  iconName: '',
  selectItem: () => {},
  urlParams: '',
};

export default TableCell;
