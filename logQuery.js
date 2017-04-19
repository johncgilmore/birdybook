var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyMj8bOmPNfNlgVL'}).base('app1ebcQY1S6i2Y2Y');
var logger = function (request){
  var data = {
  "email": request.query.email,
  "isbn": request.query.isbn,
  "zipcode": request.query.zipcode
  }
  base('simpleLog').create(data, function(err, record) {
    if (err) {
      console.error(err)
    }
    else {
      return record
    }

  });
}
module.exports = logger
