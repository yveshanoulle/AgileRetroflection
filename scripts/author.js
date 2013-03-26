function Author(name) {
  this.name = name;
  this.questions = [];

  if (typeof(this.addQuestion) == 'undefined') //guarantees one time prototyping
  {
    Author.prototype.addQuestion = function (question) {
      this.questions.push(question);
    };
  }

  function createCorrection(question) {
    var url = createCorrectionMailURL(question);
    return '<a data-role=\'button\' data-icon=\'edit\' data-iconpos=\'notext\' class=\'mailbutton\' href=\'' + url + '\'></a>';
  }

  if (typeof(this.asListItem) == 'undefined') //guarantees one time prototyping
  {
    Author.prototype.asListItem = function () {
      var ul = '<ul data-role=\'listview\'>';
      for (questionIndex in this.questions) {
        var question = this.questions[questionIndex];
        ul += '<li><small>' + question.question + '</small>' +
          '<p class=\'ui-li-aside\'>' +
          createCorrection(question) + '</p>' +
          '</li>';
      }
      ul += '</ul>';
      return '<div data-role=\'collapsible\'><h3>' + this.name + '  (' + this.questions.length + ')</h3>' + ul + '</div>';
    };
  }

}


