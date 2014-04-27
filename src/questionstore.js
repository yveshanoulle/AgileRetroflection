/*global localStorage */
(function () {
  "use strict";

  angular.module('questionstore', [])

    .factory('questionstore', ['$http', function ($http) {
      var store = $http.get('/questions.json').then(function (result) {
        localStorage.setItem("questions", JSON.stringify(result.data));
        return result.data;
      }, function () {
        return JSON.parse(localStorage.getItem("questions"));
      });

      return {
        questions: function () { return store; }
      };
    }]);
}());
