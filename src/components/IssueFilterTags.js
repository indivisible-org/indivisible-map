import React from 'react';
import { Tag } from 'antd';
import { find, without } from 'lodash';
import PropTypes from 'prop-types';

const { CheckableTag } = Tag;

/* eslint-disable */
require('style-loader!css-loader!antd/es/tag/style/index.css');
/* eslint-enable */


class FilterSelector extends React.Component {
  constructor(props) {
    super(props);
    const { issues } = this.props;
    const current = without(issues, 'Town Hall');

    this.state = {
      selectedTags: current,
    };
  }

  componentDidMount() {
    const { changedFilters } = this.props;
    changedFilters(this.state.selectedTags);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ selectedTags: newProps.selectedFilters });
  }

  handleChange(tag, checked) {
    const { changedFilters } = this.props;
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ?
      [...selectedTags, tag] :
      selectedTags.filter(t => t !== tag);
    this.setState(
      { selectedTags: nextSelectedTags },
      () => changedFilters(nextSelectedTags),
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
          const color = mapping ? mapping.icon : 'circle-15-gray';
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

FilterSelector.propTypes = {
  changedFilters: PropTypes.func.isRequired,
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  issues: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FilterSelector;
