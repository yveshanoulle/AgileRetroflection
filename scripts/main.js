var questions;

function start() {
  var completeStart = function () {
    authors(questions).forEach(function (author) {
      $('#authors').append(author.asListItem());
    });
    ui.setup();
  };

  $.ajax({
    url    : "questions.json",
    success: function (result) {
      questions = JSON.parse(result);
      localStorage.setItem("questions", JSON.stringify(questions));
      completeStart();
    },
    error  : function (result) {
      questions = JSON.parse(localStorage.getItem("questions"));
      completeStart();
    }
  });
}
