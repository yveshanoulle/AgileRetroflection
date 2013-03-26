var
  store = require('store')('questionstore'),
  connectRoute = require('connect-route'),
  connect = require('connect'),
  app = connect(),
  quest = [];

  store.list(function (err, result) {
    if (err) {
      console.log(err);
    }
    quest = result;
  });

app.use(connectRoute(function (router) {
  router.get('questions.json', function (req, res, next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('questions = ' + JSON.stringify(quest));
  });

}));
app.use(connect.static(__dirname));

app.listen(process.env.PORT || 5000);
