var ui = {};
(function () {

  this.setup = function () {
    bindEvents();
    show();
  };

  var show = function () {
    var current = currentQuestion();
    $('.question').html(current.question);
    $('.author').html(linkToTwitter(current.author) + ' (#' + current.id + ')');
    $('.emaillink').attr('href', createMailURL(current));
    $('.correctlink').attr('href', createCorrectionMailURL(current));
  };

  var bindEvents = function () {
    bindEventsForPage(1);
    bindEventsForPage(2);
    $('#about-page').bind('swipeup', function (event) {
      event.stopImmediatePropagation();
      $.mobile.changePage('', {transition: 'slideup'});
      return false;
    });
  };

  var bindEventsForPage = function (number) {
    $('#page' + number).bind('pagebeforeshow', function () {
      show(number);
    });
    $('#random' + number).bind('click', function (event) {
      event.stopImmediatePropagation();
      next(number);
      return false;
    });
    $('#page' + number).bind('swipeleft', function (event) {
      event.stopImmediatePropagation();
      next(number);
      return false;
    });
    $('#page' + number).bind('swiperight', function (event) {
      event.stopImmediatePropagation();
      back(number);
      return false;
    });
    $('#page' + number).bind('swipedown', function (event) {
      event.stopImmediatePropagation();
      $.mobile.changePage('#about-page', {transition: 'slidedown'});
      return false;
    });
  };

  var back = function (pageNumber) {
    previousQuestion();
    $.mobile.changePage(pageNumber === 1 ? '#page2' : '', {transition: 'slide', reverse: 'true'});
  };

  var next = function (pageNumber) {
    nextQuestion();
    $.mobile.changePage(pageNumber === 1 ? '#page2' : '', {transition: 'slide'});
  };

}).apply(ui);
