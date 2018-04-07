import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
/* eslint-disable */
require('style-loader!css-loader!antd/es/alert/style/index.css');
/* eslint-enable */

class WebGlError extends React.Component {
  render() {
    const { mapType } = this.props;
    return (
      <Alert
        message={`This map requires webGL to run and you do not currenlty have it enabled, but you can still search for ${mapType}s near you.`}
        type="warning"
        closable
        showIcon
        description={
          <span>It can be an issue with your browser or your graphics card, go to <a href="https://get.webgl.org/">Get WebGL </a>to learn more.</span>}
      />);
  }
}

WebGlError.propTypes = {
  mapType: PropTypes.string.isRequired,
};

export default WebGlError;
