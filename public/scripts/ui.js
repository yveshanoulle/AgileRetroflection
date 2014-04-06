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
    $("#question-page").bind('pagebeforeshow', function () {
      show();
    });
    $('#random').bind('click', function (event) {
      event.stopImmediatePropagation();
      next();
      return false;
    });
    $("#question-page").bind('swipeleft', function (event) {
      event.stopImmediatePropagation();
      next();
      return false;
    });
    $("#question-page").bind('swiperight', function (event) {
      event.stopImmediatePropagation();
      back();
      return false;
    });
    $("#question-page").bind('swipedown', function (event) {
      event.stopImmediatePropagation();
      $.mobile.changePage('#about-page', {transition: 'slidedown'});
      return false;
    });
    $('#about-page').bind('swipeup', function (event) {
      event.stopImmediatePropagation();
      $.mobile.changePage('', {transition: 'slideup'});
      return false;
    });
  };

  var back = function (page) {
    $("body").pagecontainer("change", $("#question-page"), {transition: "slide", reverse: "true", allowSamePageTransition: "true"});
    previousQuestion();
  };

  var next = function (page) {
    $("body").pagecontainer("change", $("#question-page"), {transition: "slide", allowSamePageTransition: "true"});
    nextQuestion();
  };

}).apply(ui);
