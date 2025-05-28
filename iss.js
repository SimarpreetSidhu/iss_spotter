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
module.exports = { fetchMyIP, fetchCoordsByIP };