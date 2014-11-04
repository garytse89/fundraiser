'use strict';

angular.module('distApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.loadProjects = function() {
    	$http.get('/projects').
	    	success(function(data, status, headers, config) {
	    		$scope.projects = data;
	    	}).
	    	error(function(err, status, headers, config) {
	    		console.log(err)
	    	});
    };

    $scope.loadProjects();
});
