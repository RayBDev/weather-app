const yargs = require("yargs");
const axios = require("axios");

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: "address",
      describe: "Address to fetch weather for",
      string: true
    }
  })
  .help()
  .alias("help", "h").argv;

const encodedAddress = encodeURIComponent(argv.address);
const geocodeURL = `http://www.mapquestapi.com/geocoding/v1/address?key=qJR3ayslEQIN1E0rpHyGu2LDPfgvxRWI&location=${encodedAddress}`;

axios
  .get(geocodeURL)
  .then(response => {
    if (response.data.status === "ZERO_RESULTS") {
      throw new Error("Unable to find that address");
    }

    const lat = response.data.results[0].locations[0].latLng.lat;
    const lng = response.data.results[0].locations[0].latLng.lng;
    const weatherURL = `https://api.darksky.net/forecast/46ef3ed674bd392562db3b39ea2f4b4a/${lat},${lng}`;

    console.log(
      `${response.data.results[0].locations[0].adminArea5}, ${
        response.data.results[0].locations[0].adminArea3
      } ${response.data.results[0].locations[0].postalCode}`
    );
    return axios.get(weatherURL);
  })
  .then(response => {
    const temperature = response.data.currently.temperature;
    const apparentTemperature = response.data.currently.apparentTemperature;
    console.log(
      `It's currently ${temperature}. It feels like ${apparentTemperature}.`
    );
  })
  .catch(err => {
    if (err.code === "ENOTFOUND") {
      console.log("Unable to connect to API servers.");
    } else {
      console.log(err.message);
    }
  });
