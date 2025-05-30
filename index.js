const { fetchMyIP, fetchISSFlyOverTimes, fetchCoordsByIP } = require("./iss");

fetchMyIP((error, ip) => {
  if (error) {
    console.log(error);
  } else {
    fetchCoordsByIP(ip,(error,cordinates) => {
      if (error) {
        console.log(error);
      } else {
        fetchISSFlyOverTimes(cordinates,(error,flyOverTimes) => {
          if (error) {
            console.log(error);
          } else {
            console.log(flyOverTimes);
          }
        });
      }
    });
  }
});

