var should = chai.should();

describe('author Yves', function () {
  var authorName = '@yveshanoulle';
  var author = new Author(authorName);

  beforeEach(function () {
    author = new Author(authorName);
    for (var i in test_questions) {
      if (test_questions[i].author === authorName) {
        author.addQuestion(test_questions[i]);
      }
    }
  });

  it('has 5 test_questions', function () {
    author.questions.length.should.equal(5);
  });

  it('displays correctly', function () {
    var asListItem = author.asListItem();
    asListItem.should.contain('<ul data-role="listview"');
    asListItem.should.contain('<h3>' + author.name);
    asListItem.should.contain('<li>');
  });
});

describe('authors function', function () {
  var result;
  beforeEach(function () {
    result = authors(test_questions);
  })

  it('parses the test_questions to 7 authors', function () {
    result.length.should.equal(7);
    for (var i in result) {
      result[i].should.be.instanceOf(Author);
    }
  });

  it('contains Yves with 5 test_questions', function () {
    for (var i in result) {
      if (result[i].name === '@yveshanoulle') {
        result[i].questions.length.should.equal(5);
      }
    }
  });

  it('sorts the authors by name', function () {
    var lastName = "";
    for (var i in result) {
      var currentName = result[i].name;
      lastName.localeCompare(currentName).should.be.below(0);
      lastName = currentName;
    }
  });
});
