import RTM from 'satori-rtm-sdk';
import _ from 'lodash';
import { 
  SATORI_MSG,
  SATORI_WEB_SOCKETS_URL, 
  SATORI_APP_KEY,
  SATORI_RTM_API
} from '../constants.js';


class SantoriService {
  constructor() {
    this.client = new RTM(SATORI_WEB_SOCKETS_URL, SATORI_APP_KEY);
    this.messages = {};
    this.filterId = null;
  }

  initializeWebSockets(options = {}) {
    const _this = this;
    const { channel, mode, filter } = options;

    if (_.isObject(this.client) === false) {
      console.log('Satori Service not yet initialized');
      return;
    }
    this.client.on('enter-connected', function() {
      console.log('Connected to Satori RTM');
    });
    this.subscription = this.client.subscribe(channel, mode, filter);

    this.subscription.on(SATORI_RTM_API, function(pdu) {
      pdu.body.messages.forEach(function(msg) {
        const item = _.get(msg, 'entity[0]'),
          id = _.get(item, 'id'),
          lat = _.get(item, 'vehicle.position.latitude'),
          lng = _.get(item, 'vehicle.position.longitude'),
          routeId = _.get(item, 'vehicle.trip.route_id'),
          vehicleLabel = _.get(item, 'vehicle.vehicle.label'),
          hasValidData = item &&
            _.isString(id) &&
            _.isNumber(lat) &&
            _.isNumber(lng) &&
            _.isString(routeId) &&
            _.isString(vehicleLabel);
        if (hasValidData) {
          _this.messages[item.id] = { id, lat, lng, routeId, vehicleLabel };
        }
      });
      if (_.size(_this.messages)) {
        const msgsArray = _.map(_this.messages, function(item) { 
          return {
            id: item.id, 
            lat: item.lat, 
            lng: item.lng,
            routeId: item.routeId,
            vehicleLabel: item.vehicleLabel
          }
        });
        document.dispatchEvent(new CustomEvent(SATORI_MSG, {detail: _this.filterMessages(msgsArray)}));
      }
    });
    this.client.start();
  }

  setFilterMessageById(options) {
    const id = _.get(options, 'detail.id');
    const service = _.get(options, 'detail.service');
    service.filterId = id;
    service.filterMessages.call(service, service.messages, true);
  }

  filterMessages(data, isFilterNow) {
    const id = this.filterId;
    let result = data;
    if (_.isString(id)) {
      result = _.filter(data, function(item) {
        if (id === item.routeId) {
          return item;
        }
      });
    }
    if (isFilterNow) {  // TODO: working to make filter work instantly
      this.messages = result;
      return;
    }
    return result;
  }
}

export default SantoriService;
