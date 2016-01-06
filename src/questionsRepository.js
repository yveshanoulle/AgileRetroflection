// do not convert to import until node.js fully supports modules

var _ = require('lodash');

function authornameToArray(name) { return name.match(/@(\w+)/g) || []; }

function authorsService(questions) {
  var internal = [];

  function addAuthor(author) {
    internal.push({name: author, questions: []});
  }

  function getAuthorNamed(name) {
    return _.find(internal, {name: name});
  }

  _.each(questions, function (question) {
    var name = question.author;
    if (!getAuthorNamed(name)) {
      addAuthor(name);
    }
    getAuthorNamed(name).questions.push(question);
  });

  internal.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  return {
    all: internal,
    distinctCount: function () {
      return _(internal).pluck('name').map(authornameToArray).flatten().unique().value().length;
    },
    authorNamed: getAuthorNamed
  };
}


function questionsStore(questionstring) {
  var
    questionjson = JSON.parse(questionstring),
    authors = authorsService(questionjson);

  _.each(questionjson, function (each) { each.authornameToArray = authornameToArray; });

  function next() { return Math.floor(Math.random() * questionjson.length); }

  function questionFor(idString) {
    var id = idString || next().toString();
    return _.find(questionjson, {'id': id}) || {author: '', id: '', date: ''};
  }

  return {
    next: next,
    all: questionjson,
    authors: authors,
    authorNamed: authors.authorNamed,
    questionFor: questionFor,
    authornameToArray: authornameToArray
  };
}


module.exports = questionsStore;
