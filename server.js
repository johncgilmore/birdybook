var express = require('express');
var algolia = require ('algoliasearch')
var searchPso = require ('./pso');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var emoji = require('node-emoji');
var logQueries = require('./logQuery')
var logSchools = require ('./logSchoolsByZip');
var logSubjects = require ('./logSubjectsAndPublishers');
var pug = require('pug');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');
app.get("/", function(req, res) {
        console.log("GO!")

    res.render('index', {
      isbn: false,
      landing: true,
      delivery: delivery
    })

})
app.get("/research", function (req, res){
  var research = []
  console.log("request (P) to /research")
  research.push(emoji.random().emoji)
  research.push(emoji.random().emoji)
  console.log(research)
  res.send(research[0] + research[1])
});
var departmentHunt = function (error, body, response){
  var departments = []
  for (var dept in body[0]){
    console.log(dept.name)
  }
}
app.get("/books", function(req, res, next) {
  // figures out the book info
  if (delivery.query.publisher){
    console.log("publisher already found; no additional query needed. Pubbed by " + delivery.query.publisher)
  } else {
  console.log("route '/books' received a GET request. Now pinging Google Apis for book info." )
  if(!req.query.isbn) {
    req.query.isbn = 9780393937510
    req.query.zipcode = 112
  }
  console.log(req.query.isbn)
  logQueries(req); // simple airtable logger of the isbns and zipcodes being queried
  // set options for request function
  var options = {
  url: 'https://www.googleapis.com/books/v1/volumes?q=' + req.query.isbn, //+ '&key=' + process.env.GOOGLE_KEY,
  headers: {
    'referer': 'gomix.com'
  }
};   //TODO:
  /* Figure out if a nested callback as I've done here is a terrible or a good idea
  * This anonymous callback includes a nested request(options, callback) and a second callback function;
  * Top level callback returns google api's 'id' as var id for the book search, then alters the options;
  * the second request uses altered options to call the api for that book id, and passes a callback that
  * receives the book info (Publisher, subject) that will help me find the revevant contact rep
 */
  // anonymous callback function:
  function callback(error, res, body) {
    var body = JSON.parse(body)
    var first = body.items[0];
    var id = first.id
    console.log("first callback is executing; Google says the id for isbn " + req.query.isbn + " is " + id)
    options.url = 'https://www.googleapis.com/books/v1/volumes/' + id + '?key=' + process.env.GOOGLE_KEY,
    // nested request for google books api to call me again maybe, this time with all the data
    request(options, callback);
    // nested callback:
    function callback(error, res, body) {
      req.book = JSON.parse(body);
      console.log("nested callback from google api in progress; google says the book is published by " + req.book.volumeInfo.publisher);
      listSchools(req, res);
    }
  }
  // top level request for google api to call me maybe with book Id;
  request(options, callback);
  // then we should pass it to a middleware depending on which publisher it goes to. this is for pearson:
  }
    listSchools(req, res);
});
app.get("/check", function(req, response){
  var a = req.query;
  if (a.isbn !== ""){
    var isbn = a.isbn
    var options = {
      url: 'https://www.googleapis.com/books/v1/volumes?q=' + isbn, //+ '&key=' + process.env.GOOGLE_KEY,
      headers: {
        'referer': 'gomix.com'
      }
    }
    function callback(error, res, body) {
      console.log(error)
    var body = JSON.parse(body)
    if (body.items){
    var id = body.items[0].id
    console.log("checking google for isbn " + req.query.isbn + " and the id is " + id)
    options.url = 'https://www.googleapis.com/books/v1/volumes/' + id, // + '?key=' + process.env.GOOGLE_KEY
    // nested request for google books api to call me again maybe, this time with all the data
    request(options, callback);
    // nested callback:
    function callback(error, res, body) {
      req.book = JSON.parse(body);
      console.log("nested callback from google api in progress; google says the book is published by " + req.book.volumeInfo.publisher);

      delivery.query = req.book.volumeInfo
      delivery.isbn = delivery.query.industryIdentifiers[1].identifier
      console.log(delivery.isbn)
      delivery.subject = delivery.query.categories
      console.log(delivery.subject + " is the subject")
      if (/pearson/i.test(delivery.query.publisher)){
        searchPso('', 'attributes.id', 'PGM328461')

       // do something

      }
      response.send({delivery: delivery, landing: false});
    }
      } else {
        console.log(body)
        response.sendStatus(200)
      }

  }
    // top level request for google api to call me maybe with book Id;
    request(options, callback);
  }
});
var delivery = {
  headline: 'Request Desk Copies from Any Publisher'
}
var schoolsByPub = function(publisher){
  // call the proper publihser
  var key = {
    pearson: listSchools(),
    norton: function(){},
    cengage: function(){},
    mcgraw: function(){},
  }
  console.log("calling " + publisher + " to find some reps")
}
var listSchools = function(req, res) {

  //TODO: Scrape all zipcode and school data to my own database in case it disappears from pearson.
  console.log("querying a " + delivery.query.publisher + " endpoint to find school list by zipcode") // actually still querrying pearson this is a forward looking statement lol
  req.institutions = [];
  var psoEndpoint = 'https://instructors.pearsonhighered.com/api/institutions?country=US&postCode=' + req.query.zipcode.substring(0,3);
  request(psoEndpoint, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      delivery.schools = JSON.parse(body).institutions
      for (var i = 0; i < JSON.parse(body).institutions.length; i++) {
        // attach the list of institutions by zipcode to the req object

        req.institutions.push(JSON.parse(body).institutions[i]);
      }
      // and order those institutions such that the ones the profs are most likely to be from are at top.
      req.institutions.sort(function(a, b) {
        var textA = a.id.substring(3, 7).toUpperCase();
        var textB = b.id.substring(3, 7).toUpperCase();
        return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
      });
      logSchools(req); // logs schools to airtable, by zipcode
      console.log("rendering Page, within listSchools function");
    }
    else {
      console.log(err +" (this error means that the call to pearson's schools by zipcode api failed)");

    }
    res.render('index', {
        //book: req.book.volumeInfo,
        zipcode: req.query.zipcode,
        isbn: delivery.isbn,
        institutions: req.institutions,
      landing: false,
      });
  });


}
// ToDo: Don't call this same thing twice like I'm doing right now; note how the console logging happens twice; in the second instance, it renders the demo note.
app.get("/ids/:institutionId/isbns/:isbn/school/:school", function(req, res) {
  var data = {
    school: req.params.school,
    id: req.params.institutionId,
    endpoint: 'https://instructors.pearsonhighered.com/api/representatives?country=US&institutionId=' + req.params.institutionId,
    isbn: delivery.isbn
  }

  request(data.endpoint, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      data.contactInfo = JSON.parse(body).representatives[0]; // for now I'm just taking the first rep.
      var firstName = data.contactInfo.firstName[0] + data.contactInfo.firstName.slice(1).toLowerCase();
      var lastName = data.contactInfo.lastName[0] + data.contactInfo.lastName.slice(1).toLowerCase();
      data.contactInfo.firstName = firstName;
      data.contactInfo.lastName = lastName;
    }
    if (req.query.request){
      res.render('index', {
      notReady: true,
      contactInfo: data.contactInfo,
      email: data.contactInfo.contactEmail,
      isbn: delivery.isbn,
      institutions: req.params.institutionId,
      school: req.params.school,
      userEmail: req.query.email,
      userRequest: req.query.request,
      userName: data.name
      })
    }
    else {
      console.log(data)
      res.render('index', {
        contactInfo: data.contactInfo,
        session: req.params,
      });
    }
  });
});
//TODO make this copy and paste thing work
app.post('/note', function(request, response) {
  console.log(request.query.note);
});



// listen for requests :)
var listener = app.listen(8080, function() {
    console.log('Your app is listening on port ' + listener.address().port);
})
