/* global questions, latestUpdate, replaceOrAddQuestions */

function start() {
  var completeStart = function () {
    authors(questions).forEach(function (author) {
      $('#authors').append(author.asListItem());
    });
    ui.setup();
  };

  var qs = JSON.parse(localStorage.getItem("questions"));
  if (qs) {
    questions.concat(qs);
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
