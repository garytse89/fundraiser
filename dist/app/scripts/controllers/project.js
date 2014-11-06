'use strict';

// autocomplete

$("#firstName").autocomplete({
	source: ["Lucy"]
});

angular.module('distApp')
  .controller('ProjectCtrl', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

  	var project_id = $routeParams.project_id;
  	// amount field is enabled by default
  	$scope.amountDisabled = false;

	API.project({ project_id: project_id }).$promise.then(function(project) {
		$scope.project = project

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
  			address: $scope.address,
        	phone_number: $scope.phone_number,
  			project_id: project_id 
  		}).$promise.then(function() {
  			$scope.showSuccessLabel = true
  			$scope.showErrorLabel = false
  		}, function(err) {
  			$scope.showSuccessLabel = false
  			$scope.showErrorLabel = true
        console.log("***ERROR***")
        console.log('ERR', err)
  			// show indication that pledge failed
  		})
  	}

}]);


