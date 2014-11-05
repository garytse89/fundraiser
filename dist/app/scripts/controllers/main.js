'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', function ($scope, $routeParams, API) {

   $scope.projects = API.projects({ category: $routeParams.project_category})
   $scope.categories = API.categories()

}]);
