var store = require('store')('questionstore');
var fs = require('fs');

//fs.readFile(__dirname + '/questions-all.json', function (err, code) {
//  if (err) {
//    console.log("error loading file" + err);
//  }
//  try {
//    var questions = JSON.parse(code);
//    for (var i in questions) {
//      store.add(questions[i], function(err) {
//        if (err) {
//          console.log(err);
//        }
//      });
//    }
//  }
//  catch (e) {
//    console.log("Error parsing file" + ": " + e);
//  }
//});


store.list(function(err, result) {
  if (err) {
    console.log(err);
  }
  console.log(result);
})