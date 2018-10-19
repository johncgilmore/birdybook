/*
Log to airtable, first time it sees an isbn (as provided by the google books API, 
not the query from the professor), it logs it, and the next time it retrieves it 
to confirm we have it. This keeps airtable Logs unique and also tracks the names of
publishers, etc. 

NOTE: If the lookup via google books is returning the wrong thing based on their
search, this will not be helpful as it's logging the google books return.
*/

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('app4qh7K361ORR4wu');

var checkForIsbn = function(delivery){

//console.log(delivery)
  base('main').select({
  filterByFormula: "isbn = '" + delivery.isbn + "'"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records returned from search.
  if (records.length > 0){
    records.forEach(function(record) {
      console.log('Airtable log already contains ISBN; here is the direct URL: <a href="https://airtable.com/shraceQmFc9IovbkR/tbl3g6vRtMvEaMX8m/viwK8eTEnAez5Mtg5/' + record.id + '">' + delivery.isbn + '</a>');
    }); 
  } else {
    console.log("no records found, so will attempt to log it");
    var data = {  
  "isbn": delivery.isbn,
  "publishedDate": delivery.volumeInfo.publishedDate,
  "publisher": delivery.volumeInfo.publisher,
  "subjects":  JSON.stringify(delivery.categories),
  "description": delivery.volumeInfo.description,
  "author": JSON.stringify(delivery.volumeInfo.authors),
  "title": delivery.volumeInfo.title
  }
    base('main').create(data, function(err, record) {
      if (!err){console.log("record succesfully written: ", record.id)}
      if (err) {console.error(err); return; }
    

   // console.log(record)  // will return full record found or created
});  
}}, function done(err) {
    if (err) { console.error(err); return; }
});
}

module.exports = checkForIsbn
