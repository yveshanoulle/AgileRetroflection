/* global angular */
"use strict";

angular.module('questionstore', [])

  .factory('questionstore', ['$http', function ($http) {
    var store = $http.get('/questions.json')
      .success(function (result) {
        localStorage.setItem("questions", JSON.stringify(result));
        return result;
      })
      .error(function (data) {
        return JSON.parse(localStorage.getItem("questions"));
      });

    return {
      questions: function () { return store; }
    };
  }]);
