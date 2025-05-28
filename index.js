const { fetchMyIP } = require("./iss");

fetchMyIP((error, ip) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`The ip adress is ${ip}`);
  }
});

