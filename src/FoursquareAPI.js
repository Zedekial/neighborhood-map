/* Create the Foursquare API component which will fetch and return data, this will be exported and accessed by other components */
let Client_ID = 'ZG1TWXPHE4V2ZEN0JK1GOGOA3NKLN2JQGPNJSN14AVYICL1X'
let Client_Secret = 'GGYHPT4BTUIBCWUZISGPS5JFAXUZHBYKTMVWK2AZAWPTAHCX'


export const FetchData = (AddLocationsToArray) => {
  fetch('https://api.foursquare.com/v2/venues/explore?ll=52.362884,4.863844&query=food&v=20180323&limit=10&intent=browse&radius=500&client_id=ZG1TWXPHE4V2ZEN0JK1GOGOA3NKLN2JQGPNJSN14AVYICL1X&client_secret=GGYHPT4BTUIBCWUZISGPS5JFAXUZHBYKTMVWK2AZAWPTAHCX')
    .then(res => res.json())
    .then(data => data.response.groups[0].items)
    .then((locations) => AddLocationsToArray(locations))
}






// const request = require('request')
//
// request({
//   url: 'https://api.foursquare.com/v2/venues/explore',
//   method: 'GET',
//   qs: {
//     client_id: Client_ID,
//     client_secret: Client_Secret,
//     ll: '52.362884, 4.863844',
//     query: 'food',
//     v: '20180323',
//     limit: 10,
//     redirect_uri: 'http://localhost:3000/',
//     intent: 'browse',
//     radius: 500,
//   }
// }, function(err, res, body) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(body);
//     body.map(body => console.log(body))
//   }
// })
