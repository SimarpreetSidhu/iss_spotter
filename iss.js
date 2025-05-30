const needle = require("needle");
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  needle.get(`https://api.ipify.org?format=json`,(error, response, body) => {
    if (error) {
      callback(error,null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg),null);
      return;
    }
    const ip = body.ip;
    callback(null, ip);
  });

};

const fetchCoordsByIP = function(ip,callback) {
  // use requeste to fetch cordinates for given ip
  needle.get(`http://ipwho.is/${ip}`,(error, response,body) => {
   
    if (error) {
      callback(error,null);
      return;
    }

    if (body.success === false) {
      const msg = `Invalid ip : ${ip}`;
      callback(Error(msg),null);
    }

    const cordinates = {
      latitude : body.latitude,
      longitude : body.longitude
    };

    callback(null,cordinates);

  });

};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  needle.get(url,(error, response, body) => {
    if (error) {
      callback(error,null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS FlyOver times. Response: ${body}`;
      callback(Error(msg),null);
      return;
    }

    const flyOverTimes = body.response;
    callback(null,flyOverTimes);
    
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error,ip) => {
    if (error) {
      callback(error,null);
      return;
    } else {
      fetchCoordsByIP(ip,(error,cordinates) => {
        if (error) {
          callback(error,null);
          return;
        } else {
          fetchISSFlyOverTimes(cordinates,(error,flyOverTimes) => {
            if (error) {
              callback(error,null);
              return;
            } else {
              callback(null,flyOverTimes);
            }
          });
        }
      });
    }
  });
};
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };