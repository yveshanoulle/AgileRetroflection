function createCorrectionMailURL(question) {
  var result = 'mailto:retroflections@hanoulle.be';
  result += '?subject=Retroflection corrected question&body=';
  result += escape('I have a proposal on improving the spelling of retroflection question ' +
    question.id + ': \n' + '"' + question.question + '" by ' + question.author);
  result += encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
    'This retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org');
  return result;
}

function createMailURL(question) {
  var result = 'mailto:?subject=Retroflection Question ' + question.id + '&body=';
  result += escape('"' + question.question + '"' + ' by ' + question.author);
  result += encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org');
  return result;
}

function linkToTwitter(name) {
  return (name.charAt(0) === '@') ? "http://twitter.com/" + name.substr(1) : name;
}

function Author(name) {
  this.name = name;
  this.questions = [];

  if (typeof(this.addQuestion) === 'undefined') {
    Author.prototype.addQuestion = function (question) {
      this.questions.push(question);
    };
  }

  function createCorrection(question) {
    var url = createCorrectionMailURL(question);
    return '<a data-role=\'button\' data-icon=\'edit\' data-iconpos=\'notext\' class=\'mailbutton\' href=\'' + url + '\'></a>';
  }

}

function authors(questions) {
  var internal = [];

  function addAuthor(author) {
    internal.push(author);
  }

  function containsAuthorNamed(name) {
    return getAuthorNamed(name) !== null;
  }

  function getAuthorNamed(name) {
    for (var i in internal) {
      if (internal[i].name === name) {
        return internal[i];
      }
    }
    return null;
  }

  function sort() {
    internal.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  for (var i in questions) {
    var question = questions[i];
    var name = question.author;
    if (!containsAuthorNamed(name)) {
      addAuthor(new Author(name));
    }
    getAuthorNamed(name).addQuestion(question);
  }
  sort();
  return internal;
}
