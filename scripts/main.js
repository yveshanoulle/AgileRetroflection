function start() {
  var completeStart = function () {
    authors(questions).forEach(function (author) {
      $('#authors').append(author.asListItem());
    });
    ui.setup();
  };

  questions = JSON.parse(localStorage.getItem("questions"));
  if (!questions) {
    questions = [];
  }
  $.ajax({
    url: "questions.json/" + latestUpdate(),
    success: function (result) {
      replaceOrAddQuestions(JSON.parse(result));
      localStorage.setItem("questions", JSON.stringify(questions));
      completeStart();
    },
    error: function (result, textStatus, error) {
      completeStart();
    }
  });
}
