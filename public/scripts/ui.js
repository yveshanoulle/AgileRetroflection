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
    bindEventsForPage();
    $('#about-page').bind('swipeup', function (event) {
      event.stopImmediatePropagation();
      $.mobile.changePage('', {transition: 'slideup'});
      return false;
    });
  };

  var bindEventsForPage = function () {
    $("#random").bind('pagebeforeshow', function () {
      show();
    });
    $("#random").bind('click', function (event) {
      event.stopImmediatePropagation();
      next();
      return false;
    });
    $("#random").bind('swipeleft', function (event) {
      event.stopImmediatePropagation();
      next();
      return false;
    });
    $("#random").bind('swiperight', function (event) {
      event.stopImmediatePropagation();
      back();
      return false;
    });
    $("#random").bind('swipedown', function (event) {
      event.stopImmediatePropagation();
      $.mobile.changePage('#about-page', {transition: 'slidedown'});
      return false;
    });
  };

  var back = function (pageNumber) {
    previousQuestion();
    show();
  };

  var next = function (pageNumber) {
//    nextQuestion();
//    show();
  };

}).apply(ui);
