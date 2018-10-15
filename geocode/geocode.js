const request = require("request");

const geocodeAddress = (address, callback) => {
  let encodedAddress = encodeURIComponent(address);
  request(
    {
      url: `http://www.mapquestapi.com/geocoding/v1/address?key=qJR3ayslEQIN1E0rpHyGu2LDPfgvxRWI&location=${encodedAddress}`,
      json: true
    },
    (error, response, body) => {
      if (error) {
        callback("Unable to connect to MapQuest servers.");
      } else if (body.results[0].locations[0].geocodeQualityCode === "A1XAX") {
        callback("Unable to find that address");
      } else if (body.info.statuscode === 0) {
        callback(undefined, {
          address: `${body.results[0].locations[0].adminArea5}, ${
            body.results[0].locations[0].adminArea3
          } ${body.results[0].locations[0].postalCode}`,
          latitude: `${body.results[0].locations[0].latLng.lat}`,
          longitude: `${body.results[0].locations[0].latLng.lng}`
        });
      }
    }
  );
};

module.exports = { geocodeAddress };
