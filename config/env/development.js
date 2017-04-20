var envFile = __dirname + '/.env.json';
var jsonfile = require('jsonfile');

var envVars = jsonfile.readFileSync(envFile);
module.exports = {
    AIRTABLE_KEY: envVars['airtable_key']
};
