'use strict';

angular.module('distApp')
  .controller('PledgeCtrl', ['$scope', '$routeParams', 'API', '$location', function($scope, $routeParams, API, $location) {

  	var project_id = $routeParams.project_id;
  	// amount field is enabled by default
  	$scope.amountDisabled = false;

  	API.project({ project_id: project_id }).$promise.then(function(project) {
  		if (project.cost < 40000) {
  			$scope.amount = 40000
  			$scope.amountDisabled = true
  		}
  	})

  	$scope.fund = function() {
  		API.fund({ 
  			name: [$scope.first_name, $scope.lastname].join(' '),
  			email: $scope.email,
  			amount: $scope.amount,
  			project_id: project_id 
  		}).$promise.then(function() {
  			// show indication that pledge worked
  			// then redirect back to project page
  			$location.path('/#/projects/' + project_id)
  		}, function(err) {
  			// show indication that pledge failed
  		})
  	}

}]);
