'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', 'Socket', function ($scope, $routeParams, API, Socket) {

  	var category = $routeParams.category

   	$scope.projects = API.projects({ category: category })
   	$scope.categories = API.categories()

  	Socket.on('project::funded', function(data) {
  		$scope.$apply(function() {
		    _($scope.projects).map(function(project) {
		    	if (project._id == data.project_id) {
		    		project.funded = true
		    	}
		    	return project
		    })
		})
	  })

}]);
