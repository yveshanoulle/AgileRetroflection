var should = chai.should();
var questions = [
  {"question": "Q1","author": "@deborahh","id": "976","_id": "515445d0ad390ec17100046a"},
  {"question": "Q2","author": "@mfloryan","id": "977","_id": "515445d0ad390ec17100046b"},
  {"question": "Q3","author": "@yveshanoulle","id": "978","_id": "515445d0ad390ec17100046c"},
  {"question": "Q4","author": "@philagile","id": "979","_id": "515445d0ad390ec17100046d"},
  {"question": "Q5","author": "@didierkoc","id": "98","_id": "515445d0ad390ec17100046e"},
  {"question": "Q6","author": "@yveshanoulle","id": "980","_id": "515445d0ad390ec17100046f"},
  {"question": "Q7","author": "@vinylbaustein","id": "981","_id": "515445d0ad390ec171000470"},
  {"question": "Q8","author": "@k_ravlani","id": "982","_id": "515445d0ad390ec171000471"},
  {"question": "Q9","author": "@yveshanoulle","id": "983","_id": "515445d0ad390ec171000472"},
  {"question": "Q10","author": "@yveshanoulle","id": "984","_id": "515445d0ad390ec171000473"},
  {"question": "Q11 with \"escapes\"","author": "@yveshanoulle","id": "985","_id": "515445d0ad390ec171000474"},
  {"question": "Q12","author": "@vinylbaustein","id": "986","_id": "515445d0ad390ec171000475"},
  {"question": "Q13","author": "@didierkoc","id": "987","_id": "515445d0ad390ec171000476"},
  {"question": "Q14","author": "@vinylbaustein","id": "988","_id": "515445d0ad390ec171000477"},
  {"question": "Q15","author": "@k_ravlani","id": "989","_id": "515445d0ad390ec171000478"}
];

describe('Author Yves', function () {
  var authorName = '@yveshanoulle';
  var author = new Author(authorName);

  beforeEach(function(){
    author = new Author(authorName);
    for (var i in questions) {
      if (questions[i].author === authorName) {
        author.addQuestion(questions[i]);
      }
    };
  });

  it('has 5 questions', function () {
    author.questions.length.should.equal(5);
  });

  it('displays correctly', function () {
    var asListItem = author.asListItem();
    asListItem.should.contain('<ul data-role=\'listview\'>');
    asListItem.should.contain('<h3>' + author.name);
    asListItem.should.contain('<li><small>');
  });
});

describe('authors function', function () {
  var result;
  beforeEach(function() {
    result = authors(questions);
  })

  it('parses the questions to 7 authors', function() {
    result.length.should.equal(7);
    for (var i in result) {
      result[i].should.be.instanceOf(Author);
    }
  });

  it('contains Yves with 5 questions', function() {
    for (var i in result) {
      if (result[i].name === '@yveshanoulle') {
        result[i].questions.length.should.equal(5);
      }
    }
  });

  it('sorts the authors by name', function() {
    var lastName = "";
    for (var i in result) {
      var currentName = result[i].name;
      lastName.localeCompare(currentName).should.be.below(0);
      lastName = currentName;
    }
  });
});
