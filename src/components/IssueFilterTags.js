import React from 'react';
import { Tag } from 'antd';
import { find, without } from 'lodash';
import PropTypes from 'prop-types';

const { CheckableTag } = Tag;

/* eslint-disable */
require('style-loader!css-loader!antd/es/tag/style/index.css');
/* eslint-enable */


class IssueFilterTags extends React.Component {
  constructor(props) {
    super(props);
    const { selectedFilters } = this.props;
    this.state = {
      selectedTags: selectedFilters,
    };
  }

  componentDidMount() {
    const { onFilterChanged } = this.props;
    onFilterChanged(this.state.selectedTags);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ selectedTags: newProps.selectedFilters });
  }

  handleChange(tag, checked) {
    const { onFilterChanged } = this.props;
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ?
      [...selectedTags, tag] :
      selectedTags.filter(t => t !== tag);
    this.setState(
      { selectedTags: nextSelectedTags },
      () => onFilterChanged(nextSelectedTags),
    );
  }

  render() {
    const { selectedTags } = this.state;
    const { issues, colorMap } = this.props;

    return (
      <div>
        <h6 style={{ display: 'inline', marginRight: 8 }}>Filter by issue:</h6>
        {issues.map((tag) => {
          const mapping = find(colorMap, { filterBy: tag });
          const color = mapping ? mapping.icon.toLowerCase() : 'circle-15-gray';
          return (
            <CheckableTag
              key={tag}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={checked => this.handleChange(tag, checked)}
              className={color}
            >
              {tag}
            </CheckableTag>
        );
      })}

      </div>
    );
  }
}

IssueFilterTags.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  issues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IssueFilterTags;
