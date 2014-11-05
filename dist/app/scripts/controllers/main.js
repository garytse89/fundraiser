'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', function ($scope, $routeParams, API) {

  	var category = $routeParams.category

   	$scope.projects = API.projects({ category: category })
   	$scope.categories = API.categories()

}]);
