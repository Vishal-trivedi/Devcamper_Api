const NodeGeocoder = require('node-geocoder')


 
var options = {
  provider: 'mapquest',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: ' ULD4HUYhdkG6L5CoOb0pP5O1MrYTBDun', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
 
var geocoder = NodeGeocoder(options);
 
module.exports = geocoder