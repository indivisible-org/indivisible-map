import React from 'react';
import PropTypes from 'prop-types';
import { List, Spin } from 'antd';
import { find } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

import TableCell from './TableCell';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.getColor = this.getColor.bind(this);
    this.getIconName = this.getIconName.bind(this);
    this.handleInfiniteOnLoad = this.handleInfiniteOnLoad.bind(this);
    this.state = {
      data: [],
      loading: false,
      hasMore: true,
    };
  }

  getColor(issueFocus) {
    const { colorMap } = this.props;
    const colorObj = find(colorMap, { filterBy: issueFocus });
    if (colorObj) {
      return colorObj.color;
    }
    return '';
  }

  getIconName(issueFocus) {
    const { colorMap } = this.props;
    const colorObj = find(colorMap, { filterBy: issueFocus });
    if (colorObj) {
      return colorObj.icon;
    }
    return '';
  }

  handleInfiniteOnLoad() {
    const {
      items,
    } = this.props;
    let {
      data,
    } = this.state;
    this.setState({
      loading: true,
    });
    if (data.length === items.length) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    const end = data.length + 50 >= items.length ? items.length : data.length + 50;
    data = [...data, ...items.slice(data.length, end)];
    console.log(data.length);
    this.setState({
      data,
      loading: false,
    });
  }

  render() {
    const {
      items,
      urlParams,
      shouldRender,
      type,
      error,
      selectItem,
      searchType,
    } = this.props;
    console.log('got to table render', items.length);
    if (error) {
      return (
        <div id="error-message">
          <p className="no-results">Sorry, something went wrong. {error}</p>
        </div>
      );
    }

    if (!shouldRender) {
      return (
        <div id="groups-list">
          <p>Search for groups near you</p>
        </div>
      );
    }
    if (items.length === 0 && type === 'events') {
      let response;
      if (searchType === 'district') {
        response = 'There are no events being held by representatives of that district, but there may be other types nearby';
      } else {
        response = (<React.Fragment>Looks like there are no events near you right now. You can create your own <a href="https://act.indivisible.org/event/local-actions/create/?source=eventmap">here</a></React.Fragment>);
      }
      return (
        <div id="events-list">
          <p className="no-results">{response}
          </p>
        </div>
      );
    }

    console.log('infiniate scroll');
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.handleInfiniteOnLoad}
        hasMore={!this.state.loading && this.state.hasMore}
        useWindow={false}
      >
        <List
          id={`${type}-list`}
          itemLayout="vertical"
          dataSource={this.state.data}
          renderItem={item =>
            (
              <List.Item key={item.id}>
                <TableCell
                  key={`${item.id}-cell`}
                  item={item}
                  urlParams={urlParams}
                  type={type}
                  color={this.getColor(item.issueFocus)}
                  iconName={this.getIconName(item.issueFocus)}
                  selectItem={selectItem}
                />
              </List.Item>
            )}
        >
          {this.state.loading && this.state.hasMore && (
          <div className="demo-loading-container">
            <Spin />
          </div>
            )}
        </List>
      </InfiniteScroll>
    );
  }
}

Table.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.object),
  error: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectItem: PropTypes.func,
  shouldRender: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  urlParams: PropTypes.string,
};

Table.defaultProps = {
  colorMap: [],
  error: '',
  selectItem: () => {},
  urlParams: '',
};

export default Table;
