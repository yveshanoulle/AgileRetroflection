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
  })

  .service('QuestionService', function ($http, questions) {
    var currentIndex = -1;
    var questionNumbers = [];

    function randomQuestion() {
      questionNumbers.push(Math.floor(Math.random() * questions.length));
      currentIndex++;
    }

    function currentQuestionNumber() {
      if (currentIndex === -1) { randomQuestion(); }
      return questionNumbers[Math.max(0, currentIndex)];
    }

    function current() {
      return questions[currentQuestionNumber()];
    }

    function previousQuestion() {
      if (currentIndex > 0) {
        questionNumbers.pop();
        currentIndex--;
      }
    }

    return {
      next: randomQuestion,
      previous: previousQuestion,
      current: current
    };

  });
