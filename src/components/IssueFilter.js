import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { Select } from 'antd';

const { Option } = Select;
/* eslint import/no-webpack-loader-syntax: [0] */
/* eslint import/no-extraneous-dependencies: [0] */
/* eslint import/no-unresolved: [0] */
require('style-loader!css-loader!antd/es/select/style/index.css');

class IssueFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  handleChange(value) {
    this.props.changedFilters(value);
  }

  renderOptions() {
    const {
      issues,
      colorMap,
    } = this.props;
    return issues.map((issue) => {
      const mapping = find(colorMap, { filter: issue });
      const iconClass = mapping ? mapping.icon : '';

      return (
        <Option
          className={iconClass}
          labelInValue="true"
          key={issue}
          title={iconClass}
          value={issue}
        >{issue}
        </Option>);
    });
  }

  render() {
    const {
      issues,
    } = this.props;
    return (
      <div>
        <p>Filter by issue</p>
        <Select
          className="filter-drop-down"
          mode="tags"
          size="small"
          style={{ width: '100%' }}
          placeholder="Please select"
          defaultValue={issues}
          onChange={this.handleChange}
        >
          {this.renderOptions()}
        </Select>
      </div>
    );
  }
}

IssueFilter.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.object).isRequired,
  issues: PropTypes.arrayOf(PropTypes.string).isRequired,
  changedFilters: PropTypes.func.isRequired,
};

export default IssueFilter;
