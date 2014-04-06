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
    return '<a class="ui-btn ui-icon-comment ui-corner-all ui-btn-icon-notext mailbutton" href="' + url + '"></a>';
  }

  if (typeof(this.asListItem) === 'undefined') {
    Author.prototype.asListItem = function () {
      var ul = '<ul data-role="listview" data-shadow="false" data-inset="false" data-corners="false">';
      for (var questionIndex in this.questions) {
        var question = this.questions[questionIndex];
        ul += '<li>';
        ul += '<p class="question-in-list">';
        ul += question.question;
        ul += createCorrection(question) + '</p></li>';
      }
      ul += '</ul>';
      return '<div data-role="collapsible" data-iconpos="right"  data-shadow="false" data-corners="false">' + '<h3>' + this.name + '<span class="ui-li-count">' + this.questions.length + '</span></h3>' + ul + '</div>';
    };
  }

}
