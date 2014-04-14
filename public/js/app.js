/* global _, angular, questions */
"use strict";

angular.module('app', [])
  .value('questions', [])

  .service('AuthorsService', function () {
    this.authors = [];
  })
  
  .controller('QuestionController', function ($scope, $timeout, QuestionService) {
    $scope.nextQuestion = function () {
      QuestionService.next();
      $scope.current = QuestionService.current();
    };
  });
