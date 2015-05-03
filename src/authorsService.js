/*eslint no-unused-vars: 0 */

'use strict';
var _ = require('lodash');

module.exports = function (questions) {
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
    distinct: function () {
      return _(internal).pluck('name').map(function (each) {
        return each.match(/@(\w+)/g);
      }).flatten().unique().value();
    }
  };
};

