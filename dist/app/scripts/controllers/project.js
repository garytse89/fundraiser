'use strict';

angular.module('distApp')
  .controller('ProjectCtrl', ['$scope', '$routeParams', 'API', 'Socket', function($scope, $routeParams, API, Socket) {

    var project_id = $routeParams.project_id;
    // amount field is enabled by default
    $scope.amountDisabled = false;


  API.project({ project_id: project_id }).$promise.then(function(project) {
    $scope.project = project

	if (project.limit == 0) {
		$scope.alreadyFunded = true
	  }

	console.log($scope.amountDisabled)
  })

  Socket.on('project::funded', function(data) {
    if (data.project_id == project_id) {
      $scope.alreadyFunded = true
    }
  })

}]);


