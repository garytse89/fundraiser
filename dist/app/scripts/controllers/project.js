'use strict';

angular.module('distApp')
  .controller('ProjectCtrl', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

  	$scope.project = API.project({ project_id: $routeParams.project_id })

}]);
