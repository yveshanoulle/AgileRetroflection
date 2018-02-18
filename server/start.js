const app = require('./server');

const server = require('http').createServer(app);

const port = process.env.PORT || 5000;

  /* eslint no-console: 0 */
server.listen(port, () => console.log('Server running on port ' + port));

