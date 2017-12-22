import React, { Component, PropTypes } from 'react';
import GoogleMapReact from 'google-map-react';
import _ from 'lodash';

import MapMarker from '../MapMarker/MapMarker.js';
import { GOOGLE_MAPS_API_KEY } from '../../../core/constants.js';


class GoogleMap extends Component {
  render() {
    const { center, zoom, data } = this.props;
    const markers = data.map(function(item) {
      return (
        <MapMarker
          lat={item.lat}
          lng={item.lng}
          text={item.id}
          key={item.id}
        />
      )
    });
    return (
      <div style={{ height: '800px', width: '1200px', float: 'right' }}>  {/* Note: This inline style is needed for map to be displayed */}
        <GoogleMapReact
          center={center}
          defaultZoom={zoom}
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
        >
          {markers}
        </GoogleMapReact>
      </div>
    );
  }
}

GoogleMap.propTypes = {
  center: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired
};

export default GoogleMap;
