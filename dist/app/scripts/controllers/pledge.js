'use strict';

angular.module('distApp')
  .controller('PledgeCtrl', ['$scope', '$routeParams', 'API', '$location', function($scope, $routeParams, API, $location) {

  	$scope.fund = function() {
  		API.fund({ 
  			name: [$scope.first_name, $scope.lastname].join(' '),
  			email: $scope.email,
  			amount: $scope.amount,
  			project_id: $routeParams.project_id 
  		}).$promise.then(function() {
  			// show indication that pledge worked
  			// then redirect back to project page
  			$location.path('/#/projects/' + $routeParams.project_id)
  		}, function(err) {
  			// show indication that pledge failed
  		})
  	}

}]);
