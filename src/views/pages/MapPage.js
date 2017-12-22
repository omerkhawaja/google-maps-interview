import React, { Component } from 'react';
import RTM from 'satori-rtm-sdk';
import _ from 'lodash';

import { 
  SATORI_MSG, 
  SATORI_FILTER_MSG, 
  TRIMET_SQL_FILTER, 
  TRIMET_DEFAULT_CENTER 
} from '../../core/constants.js';
import SantoriService from '../../core/api/SatoriService.js';
import DataTable from '../components/DataTable/DataTable.js';
import GoogleMap from '../components/GoogleMap/GoogleMap.js';

/**
 * TODOs:
 * 1. Currenlty, filtering only works by clicking table row's. Need to work on map marker click handler.
 * 2. Filtering only updates on the next subscription cycle, this would be easier with redux.
 */

class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.santoriService = null;
    this.handleSatoriMessages = this.handleSatoriMessages.bind(this);
    this.formatTableData = this.formatTableData.bind(this);
  }

  componentWillMount() {
    this.initializeMapAndEvents();
  }

  componentDidMount() {
    this.initializeMapWebSockets();
  }

  componentWillUnmount() {
    this.cleanUpListeners();
  }

  initializeMapAndEvents() {
    this.santoriService = new SantoriService();  
    document.addEventListener(SATORI_MSG, this.handleSatoriMessages);
    document.addEventListener(SATORI_FILTER_MSG, this.santoriService.setFilterMessageById);
  }

  initializeMapWebSockets() {
    this.santoriService.initializeWebSockets({
      channel: 'transportation',
      mode: RTM.SubscriptionMode.SIMPLE,
      filter: {filter: TRIMET_SQL_FILTER}
    });
  }

  cleanUpListeners() {
    document.removeEventListener(SATORI_MSG, this.handleSatoriMessages);
    document.removeEventListener(SATORI_FILTER_MSG, this.handleSatoriMessages);
  }

  handleRowClickFromProp(id) {
    if (_.isString(id)) {
      document.dispatchEvent(new CustomEvent(SATORI_FILTER_MSG, {detail: {id, service: this.santoriService}}));
    }
  }

  handleSatoriMessages({ detail }) {
    if (_.isArray(detail) && _.size(detail)) {
      this.setState({ data: detail });
    }
  }

  formatTableData() {
    const { data } = this.state;
    if (_.size(data) === 0) {
      return [];
    }
    const results = [];    
    const routesByIdAndCount = _.groupBy(data, 'routeId');
    for (let key in routesByIdAndCount) {
      const vehicleLabel = routesByIdAndCount[key][0].vehicleLabel || null;
      const count = routesByIdAndCount[key].length;
      const id = routesByIdAndCount[key][0].routeId;
      results.push([vehicleLabel, count, {id}]);
    }
    return results;
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <div className='left'>
          <DataTable 
            headers={['Route', 'Buses on Route']}
            data={this.formatTableData()} 
            handleRowClickFromProp={this.handleRowClickFromProp.bind(this)}
          />
        </div>
        <GoogleMap 
          center={TRIMET_DEFAULT_CENTER}
          zoom={12}
          data={data}
        />
      </div>
    );
  }
}

export default MapPage;
