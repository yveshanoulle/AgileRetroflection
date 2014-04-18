"use strict";

var templates = {
  buttontpl: '<a class="tab-item" ng-class="{active: showAuthors}" ui-sref="retro.authors">\n' +
    '  <span class="icon icon-person"></span>\n' +
    '  <span class="tab-label">Authors</span>\n' +
    '</a>\n' +
    '<a class="tab-item" ng-class="{active: showQuestion}" ng-click="nextQuestion()" data-transition="fade">\n' +
    '  <span class="icon icon-refresh"></span>\n' +
    '  <span class="tab-label">Random</span>\n' +
    '</a>\n' +
    '<a class="tab-item" ng-class="{active: showAbout}" ui-sref="retro.about">\n' +
    '  <span class="icon icon-info"></span>\n' +
    '  <span class="tab-label">About</span>\n' +
    '</a>\n',

  abouttpl: '<div class="content-padded">\n' +
    '  <p>Please support us by:</p>\n' +
    '  <p>Adding questions on the <a href="https://docs.google.com/spreadsheet/viewform?formkey=dFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE6MQ" target="_blank">google doc</a>.</p>\n' +
    '  <p>Contributing to the code on <a href="https://github.com/yveshanoulle/AgileRetroflection" target="_blank">github</a></p>\n' +
    '  <p>Correcting the spelling of the questions. Just leave us a note by clicking on this icon <a class="icon icon-edit"></a> inside the app.</p>\n' +
    '  <p>Originally tweeted by <a href="http://twitter.com/retroflection">@Retroflection</a></p>\n' +
    '  <p>Site by <a href="http://www.twitter.com/leiderleider">@leiderleider</a></p>\n' +
    '  <p>Version: 2.2.2</p>\n' +
    '</div>',

  authortpl: '<ul class="table-view">\n' +
    '  <li ng-repeat="question in questions" class="table-view-cell">{{question.question}} <a class="btn icon icon-edit" href="{{createCorrectionMailURL(question)}}"></a></li>\n' +
    '</ul>\n',

  authorstpl: '<ul class="table-view">\n' +
    '  <li ng-repeat="author in authors" class="table-view-cell">\n' +
    '    <a class="navigate-right" ui-sref="retro.author({name:author.name})">\n' +
    '      <span class="badge">{{author.questions.length}}</span> {{author.name}}\n' +
    '    </a>\n' +
    '  </li>\n' +
    '</ul>\n',

  retrotpl: '<header ui-view="nav-bar" class="bar bar-nav"></header>\n' +
    '<div ui-view="content" class="content" ng-class="animationclass" ng-swipe-right="swiperight()" ng-swipe-left="swipeleft()"></div>\n' +
    '<nav ui-view="buttons" class="bar bar-tab"></nav>',

  questionheadertpl: '<button class="btn btn-link btn-nav pull-left"><a href="{{createCorrectionMailURL}}"><span class="icon icon-edit"></span> Correct It</a></button>\n' +
    '<button class="btn btn-link btn-nav pull-right"><a href="{{createMailURL}}">Mail <span class="icon icon-compose"></span></a></button>\n' +
    '<h1 class="title">Retroflection</h1>',

  questiontpl: '<h3 class="question">{{current.question}}</h3>' +
    '<p class="author"><a href="{{twitterlink(current.author)}}">{{current.author}}</a> (#{{current.id}})</p>'
};
