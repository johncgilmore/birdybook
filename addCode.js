/*
when stuff is requested that i cant handle i want to log it tok airtable and build it out temporarily 
automaticlaly, then alert myself of what happened so i can push a real change to codebase.
*/

var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('app4qh7K361ORR4wu');

var addCode = function(data, response){
  base('imprints').select({
  filterByFormula: "imprintUnderscore = '" + data.imprintUnderscore + "'"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
  if (records.length > 0){
    records.forEach(function(record) {
   //   console.log(record);
      var short = record.fields.imprintShort
      var long = record.fields.imprintUnderscore
      data.pair = {
        short: short, long:long
      }
      return
    })
  } else {
     console.log("no records found, though we looked for " + data.imprintUnderscore + ". so we will add it."); 
    var newFields = {  

    "imprintUnderscore": data.imprintUnderscore, 
      "exampleIsbn": data.isbn
  }
  base('imprints').create(newFields, function(err, record) {
    if (err) { console.error(err); return; }
  //  console.log(record)  // will return full record found or created
    return record
});  
}}, function done(err) {
    if (err) { console.error(err); return; }
});
}

module.exports = addCode;
