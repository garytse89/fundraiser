'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', 'API', function ($scope, API) {
   
   $scope.projects = API.projects()
   $scope.categories = API.categories()

}]);
