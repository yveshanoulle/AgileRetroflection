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
