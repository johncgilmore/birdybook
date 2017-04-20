// this is just grabbing pearson data so I can eventually stop calling their database to find the arrangement of schools nationwide by zipcode.
var Airtable = require('airtable');
var config = require('./config/config')
var base = new Airtable({apiKey: config.AIRTABLE_KEY}).base('app1ebcQY1S6i2Y2Y');
var schoolsByZip = function (req){
  var data = {
    "zipcode": req.query.zipcode,
    "notes": "notes if any",
    "schools": JSON.stringify(req.institutions)
  }
  base('schoolsByZip').create(data, function(err, record) {
    if (err) {
      console.error(err)
    }
    else {
      console.log(record)
      return record
    }
  });
}
module.exports = schoolsByZip
