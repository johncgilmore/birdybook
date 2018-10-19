var request = require('request');
var addCode = require('./addCode');
var knownImprint = require('./knownImprint.js')







var imprints = function (data){
  data.imprintUnknown=false
  data.imprintShort=data.volumeInfo.publisher.split(' ')[0].toLowerCase()
  data.imprintUnderscore=data.volumeInfo.publisher.replace(/[\,\ \-\/\+\~\#\*\%\[\]\{\}\=\"\'\?\:\,\(\)]/g, '_').toLowerCase()
  var unknown = function(content){
  console.log("the unknown function has been called")
    // Make sure this makes sense.
  addCode(content, function(error, response){
  console.log("here is the response:", response)
  })
};
  if(!knownImprint[data.imprintUnderscore]){
    console.log('!knownImprint for', data.imprintUnderscore)
    
   data.imprintUnknown = true;
   unknown(data, function(error, response){
     console.log(response)
     console.log('response from the unknown')
   })
  } 
  
else {
knownImprint[data.imprintUnderscore].publisher(data)
 
}
}

module.exports = imprints
