var axios = require('axios')
var qs = require('qs')
require('dotenv').config()


var data = qs.stringify({
  'authenticationToken': process.env.AUTHENTICATION_TOKEN,
  'startDay': '2022-09-01',
  'endDay': '2022-10-02',
  'startTimestampUnix': '1581033600000',
  'endTimestampUnix': '1581034080000',
  'dataSources': '',
  'valueTypes': '',
  'detailed': 'true' 
});

var config = {
    method: 'post',
    url: 'https://api.und-gesund.de/v5/dailyDynamicValues',
    headers: { 
      'AppAuthorization': process.env.APP_AUTHORIZATION, 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': process.env.AUTHORIZATION
    },
    data : data
  };

  axios(config)
    .then( response => {
        console.log(JSON.stringify(response.data))
        console.log(Date.now())
        console.log("******************")
    })
    .catch( error => {
        console.log(error)
    }) 