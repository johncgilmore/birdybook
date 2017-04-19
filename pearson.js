var findAllReps = function (req){
 var zipcode = req.query.zipcode 
 var notes = "notes"
 var endpoint = req.endpoint
 
 function request(error, endpoint, response){
    if (error) { 
      console.error(error)
    }
    else {
      console.log(response.body)
    } 
   }
}
module.exports = findAllReps