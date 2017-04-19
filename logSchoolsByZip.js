// this is just grabbing pearson data so I can eventually stop calling their database to find the arrangement of schools nationwide by zipcode.
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_LOG);
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
      return record 
    } 
  });
}
module.exports = schoolsByZip