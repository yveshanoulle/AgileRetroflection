var retroflection = {};
(function () {
  var currentIndex = -1;
  var questionNumbers = [];
  randomQuestion();

  function randomQuestion() {
    questionNumbers.push(Math.floor(Math.random() * questions.length));
    currentIndex++;
  }

  function currentQuestionNumber() {
    return questionNumbers[Math.max(0, currentIndex)];
  }

  this.currentQuestion = function () {
    return questions[currentQuestionNumber()];
  }

  this.nextQuestion = function () {
    randomQuestion();
  }

  this.previousQuestion = function () {
    if (currentIndex > 0) {
      questionNumbers.pop();
      currentIndex--;
    }
  }

}).apply(retroflection)

var display = {};
(function () {
  var linkToTwitter = function (name) {
    if (name.charAt(0) == '@') {
      return '<a href=\'http://twitter.com/' + name.substr(1) + '\'>' + name + '</a>';
    }
    return name;
  }

  this.show = function () {
    var current = retroflection.currentQuestion();
    $('.question').html(current.question);
    $('.author').html(linkToTwitter(current.author) + ' (#' + current.id + ')');
    $('.emaillink').attr('href', createMailURL(current));
    $('.correctlink').attr('href', createCorrectionMailURL(current));
  }

  this.bindEvents = function () {
    bindButtonsNumbered(1);
    bindButtonsNumbered(2);
    bindGesturesForPage(1);
    bindGesturesForPage(2);
    $('#about-page').bind('swipeup', function (event) {
      event.stopImmediatePropagation();
      $.mobile.changePage('', {transition: 'slideup'});
      return false;
    });

  }

  var bindButtonsNumbered = function (number) {
    $('#page' + number).bind('pagebeforeshow', function () {
      display.show(number);
    });
    $('#random' + number).bind('click', function (event) {
      event.stopImmediatePropagation();
      next(number);
      return false;
    });
  }

  function back(pageNumber) {
    retroflection.previousQuestion();
    $.mobile.changePage(pageNumber === 1 ? '#page2' : '', {transition: 'slide', reverse: 'true'});
  }

  function next(pageNumber) {
    retroflection.nextQuestion();
    $.mobile.changePage(pageNumber === 1 ? '#page2' : '', {transition: 'slide'});
  }

  function about() {
    $.mobile.changePage('#about-page', {transition: 'slidedown'});
  }

  var bindGesturesForPage = function (pageNumber) {
    $('#page' + pageNumber).bind('swipeleft', function (event) {
      event.stopImmediatePropagation();
      next(pageNumber);
      return false;
    });
    $('#page' + pageNumber).bind('swiperight', function (event) {
      event.stopImmediatePropagation();
      back(pageNumber);
      return false;
    });
    $('#page' + pageNumber).bind('swipedown', function (event) {
      event.stopImmediatePropagation();
      about();
      return false;
    });
  }

}).apply(display)

function start() {
  display.show();
  display.bindEvents();
  var map = authors(questions);
  for (index in map) {
    var author = map[index];
    $('#authors').append(author.asListItem());
  }
}