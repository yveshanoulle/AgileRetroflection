(function () {
  'use strict';

  angular.module('templates', [])
    .constant('templates', {buttontpl: '<a class="tab-item" ng-class="{active: showAuthors}" ui-sref="retro.authors">\n' +
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
        '  <h4>Please support us by:</h4>\n' +
        '  <ul style="font-size: 14px;">\n' +
        '    <li>Adding questions on the <a href="https://docs.google.com/spreadsheet/viewform?formkey=dFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE6MQ" target="_blank">google doc</a>.</li>\n' +
        '    <li>Contributing to the code on <a href="https://github.com/yveshanoulle/AgileRetroflection" target="_blank">github</a></li>\n' +
        '    <li>Correcting the spelling of the questions. Just leave us a note by clicking on this icon <a class="icon icon-edit" style="font-size: inherit;"></a> inside the app.</li>\n' +
        '  </ul>\n' +
        '  <p>Originally tweeted by <a href="http://twitter.com/retroflection">@Retroflection</a></p>\n' +
        '  <p>Site by <a href="http://www.twitter.com/leiderleider">@leiderleider</a></p>\n' +
        '  <p>Version: {{version}}</p>\n' +
        '  <p>We currently feature {{questions.length}} different questions by {{distinct_authors.length}} distinct authors.</p>\n' +
        '</div>',

      authortpl: '<ul class="table-view">\n' +
        '  <li ng-repeat="question in questions" class="table-view-cell">{{question.question}} <a style="display:inline;" ui-sref="retro.question({id:question.id})"><small>(#{{question.id}})</small></a> <correct-question question="question" class="btn icon icon-edit" style="padding:0px;"></correct-question></li>\n' +
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

      questionheadertpl: '<button class="btn btn-link btn-nav pull-left"><correct-question question="current"><span class="icon icon-edit"></span> Correct It</correct-question></button>\n' +
        '<button class="btn btn-link btn-nav pull-right"><mail-question question="current">Mail <span class="icon icon-compose"></span></mail-question></button>\n' +
        '<h1 class="title">Retroflection</h1>',

      questiontpl: '<h3 class="question">{{current.question}}</h3>' +
        '<p class="author"><twitter-link name="current.author"></twitter-link> (#{{current.id}} - {{current.date}})</p>'});
}());
