const { fetchMyIP } = require("./iss");
const { fetchCoordsByIP } = require("./iss");


fetchMyIP((error, ip) => {
  if (error) {
    console.log(error);
  } else {
    fetchCoordsByIP(ip,(error,cordinates) => {
      if (error) {
        console.log(error);
      } else {
        console.log(cordinates);
      }
    });
  }
});

