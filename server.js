var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var get = require('request');
var airtableLog = require('./airtableLog');
var imprints = require('./imprints')
//var emoji = require('node-emoji');
//var stripe = require('./stripe');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'jade');

app.get("/", function(request, response) {
  response.render('index', {

    isbn: false
  });
});
var inMemory = {};
app.get("/isbn", function(request, response) {
  console.log(request.query)
  var query = request.query.query
  var options = { url: 'https://www.googleapis.com/books/v1/volumes?q=' + query, headers: {'referer': 'gomix.com'}}
  function callback(error, res, body) {
    if (error) {
      console.log(error); 
      response.sendStatus(500);
    } 
    else 
      var results = JSON.parse(body).totalItems
      if (results = 0){console.log("no results")}
       //grabs first google id, really imprecise search
      var googleId = JSON.parse(body).items[0].id;
      // then calls API with GoogleId from google books
    {
      options.url = 'https://www.googleapis.com/books/v1/volumes/' + googleId;
      get(options, callback);
      // nested callback:
      function callback(error, res, body) {
        if (error) {
          console.log(error)
          response.sendStatus(500)
        } 
        else {
       inMemory = JSON.parse(body);
          console.log("second call succeeded")
          console.log(inMemory.volumeInfo.imageLinks)
          inMemory.cover = inMemory.volumeInfo.imageLinks.medium || inMemory.volumeInfo.imageLinks.thumbnail || null          
          inMemory.isbn = inMemory.volumeInfo.industryIdentifiers[1].identifier || null
          inMemory.categories = inMemory.volumeInfo.categories || null
          airtableLog(inMemory);
          imprints(inMemory)
          response.send({
            delivery: inMemory,
            landing: false
          });
        }
      }
    }
  }
  // top level request for google api to call me maybe with book Id;
  get(options, callback);
});

app.get("/schools", function(request, response) {
 var institutions = [];
  console.log("yes I was called at /schools")
  var url = 'https://instructors.pearsonhighered.com/api/institutions?country=US&postCode=';
  get(url + request.query.zipcode.substring(0, 3), function(err, res, body) {
    for (var i = 0; i < JSON.parse(body).institutions.length; i++) {
        institutions.push(JSON.parse(body).institutions[i]);
    }
    // and order those institutions such that the ones the profs are most likely to be from are at top.
    institutions.sort(function(a, b) {
                    var textA = a.id.substring(3, 7).toUpperCase();
                    var textB = b.id.substring(3, 7).toUpperCase();
                    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                });
    var caseCorrect = function capitalizeFirstLetter(string) {
    var a = string.toLowerCase();
    return a.charAt(0).toUpperCase() + a.slice(1);
}
    inMemory.institutions = institutions;
    response.send({
      institutions: inMemory.institutions,
    });
  });
});

app.get("/ids/:institutionId/school/:school", function(request, response) {
  var school = request.params.school
  var schoolId = request.params.institutionId
      inMemory.instructor = {
        school: school,
        schoolId: schoolId
      }
  
  /* Let's get all the reps */
  
  /* first, we grab the departments */


  get('https://instructors.pearsonhighered.com/api/institutions/' + schoolId  + '/departments/', function(error, res, body) {
    if (!error && res.statusCode == 200) {
      var z = JSON.parse(body)
      for(var i = 0; i < 10; i++){
        console.log("this is the body: ", z)
/*
     var departmentId = JSON.parse(body).departments[i].id
     var departmentName = JSON.parse(body).departments[i].name
   console.log(getRep(schoolId, departmentId, departmentName))
*/
    }

      
    }
    else {
      inMemory.departments = "Error:" + error + res.statusCode
    }
    
  });
  
var getRep = function(schoolId, departmentId, departmentName){

  var endpoint = 'https://instructors.pearsonhighered.com/api/representatives?country=US&institutionId=' + schoolId + '&departmentId=' + departmentId;
   //uncomment the next line to see console log of like 10 different subject url calls
  // console.log("{" + departmentName + ": " +  endpoint + "}");
  
 var reps = []
var results = get(endpoint, function(error, res, body){

    reps.push("reps:", JSON.parse(body).representatives)

})

return reps
         };


  var endpoint = 'https://instructors.pearsonhighered.com/api/representatives?country=US&institutionId=' + schoolId 
  get(endpoint, function(error, res, body) {
        if (!error && res.statusCode == 200) {
          
        
            inMemory.publisherRep = JSON.parse(body).representatives[0]; // for now I'm just taking the first rep.
            var firstName = inMemory.publisherRep.firstName[0] + inMemory.publisherRep.firstName.slice(1).toLowerCase();
            var lastName = inMemory.publisherRep.lastName[0] + inMemory.publisherRep.lastName.slice(1).toLowerCase();
            inMemory.publisherRep.firstName = firstName;
            inMemory.publisherRep.lastName = lastName;
            inMemory.publisherRep.disciplineName = inMemory.publisherRep.disciplineName.toLowerCase();
        }
   console.log("logging inMemory", inMemory)
        if (request.query.request) {
 
            response.render('index',{
                notReady: true,
                contactInfo: inMemory.publisherRep,
                email: inMemory.publisherRep.contactEmail,
                isbn: inMemory.isbn,
                school: inMemory.school,
                delivery: inMemory
            })
        } else {
          console.log(inMemory.publisherRep)
            response.render('index',{

                contactInfo: inMemory.publisherRep,
                session: request.params,
                delivery: inMemory,
              isbn: inMemory.isbn
            });
        }
    });
   
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
})
