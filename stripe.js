/* a test strip setup; I know I've had this functional but currently I think the app doesn't call it at all. Works fine without this file 
*/


// your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_QNwrKPVRicxkspjv7K6ta9R5");


var customer = stripe.customers.create({
  email: "jenny.rosen@example.com",
}, function(err, customer) {
  // asynchronously called
  console.log(customer)
});

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_QNwrKPVRicxkspjv7K6ta9R5");

var scrip = function(){stripe.subscriptions.create({
  customer: customer.id,
  plan: "basic-monthly",
}, function(err, subscription) {
  // asynchronously called
});
                      }
/*
module.exports = customer

module.exports = scrip

*/
