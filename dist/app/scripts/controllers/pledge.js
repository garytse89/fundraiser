'use strict';

angular.module('distApp')
  .controller('PledgeCtrl', ['$scope', '$routeParams', 'API', '$location', function($scope, $routeParams, API, $location) {

  	var project_id = $routeParams.project_id;
  	// amount field is enabled by default
  	$scope.amountDisabled = false;

  	API.project({ project_id: project_id }).$promise.then(function(project) {
  		$scope.amount = project.cost // the user won't be able to set the pledge amount
      // and it will default to the cost of the project if under 40k
      if (project.cost < 40000) {
  			$scope.amountDisabled = true
  		}
      console.log($scope.amountDisabled)
  	})

  	$scope.fund = function() {
  		API.fund({ 
  			name: [$scope.first_name, $scope.last_name].join(' '),
  			email: $scope.email,
  			amount: $scope.amount,
        phone_number: $scope.phone_number,
  			project_id: project_id 
  		}).$promise.then(function() {
  		  $location.path('/confirmation')
  		}, function(err) {
        console.log("***ERROR***")
        console.log('ERR', err)
  			// show indication that pledge failed
  		})
  	}

}]);
