var Airtable = require('airtable');
var config = require('./config/config')
var base = new Airtable({apiKey: config.AIRTABLE_KEY}).base('app1ebcQY1S6i2Y2Y');
var subjectsAndPublishers = function (book){
  var subjects = JSON.stringify(book.volumeInfo.categories);
  var data = {
 "isbn": book.volumeInfo.industryIdentifiers[1].identifier,
  "publishedDate": book.volumeInfo.publishedDate,
  "publisher": book.volumeInfo.publisher,
  "subjects": subjects,
  "googleId": book.id,
  "description": book.volumeInfo.description,
  "author": book.volumeInfo.authors[0],
  "imageUrl": book.volumeInfo.imageLinks.thumbnail,
  "title": book.volumeInfo.title
  }
  base('subPubs').create(data, function(err, record) {
    if (err) { console.error(err); return; }
    console.log(record)
    console.log(record);
});
}

module.exports = subjectsAndPublishers
