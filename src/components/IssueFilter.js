import React from 'react';
import PropTypes from 'prop-types';

import { Select } from 'antd';

const { Option } = Select;

require('style-loader!css-loader!antd/es/select/style/index.css');

class IssueFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  handleChange(value) {
    this.props.changedFilters(value);
    console.log(value);
  }

  renderOptions() {
    const { issues } = this.props;
    return issues.map((issue, i) => <Option key={issue}>{issue}</Option>);
  }

  render() {
    const {
      issues,
      selectedFilters,
    } = this.props;
    return (
      // <div id="events-list">
      //   {items.map(item => <TableCell key={item.id} item={item} />)}
      // </div>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={issues}
        onChange={this.handleChange}
      >
        {this.renderOptions()}
      </Select>
    );
  }
}

IssueFilter.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default IssueFilter;
