import React, { Component, PropTypes } from 'react';
import './MapMarker.css';


class MapMarker extends Component {
  render() {
    const { text } = this.props;
    return (
      <div className="Map-Marker">
        <div className="Map-Marker-Shape">
          { text || 'none' }
        </div>
      </div>
    );
  }
}

MapMarker.propTypes = {
  text: PropTypes.string.isRequired
};

export default MapMarker;
