'use strict';

angular.module('distApp')
  .controller('PledgeCtrl', ['$scope', '$routeParams', 'API', function($scope, $routeParams, API) {

  	$scope.fund = function() {
  		API.fund({ project_id: $routeParams.project_id })
  	}
}]);
