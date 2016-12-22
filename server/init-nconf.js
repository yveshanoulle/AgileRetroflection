const nconf = require('nconf');
nconf.argv();
nconf.env();
nconf.file('ggogle', {file: 'config/emailAndKey.json'});
nconf.file('twitter', {file: 'config/twitterAuth.json'});

module.exports = nconf;
