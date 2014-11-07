'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', 'Socket', function ($scope, $routeParams, API, Socket) {

  	$scope.category = $routeParams.category

    API.projects({ category: $scope.category }).$promise.then(function(projects) {
      $scope.projects = projects
      angular.forEach(projects, function(project) {
        if (project.limit <= 0 ) project.funded = true
      })
    })

   	$scope.current_category = $scope.category
   	$scope.project_count = {}

   	API.categories().$promise.then(function(categories) {
   		$scope.categories = categories

   		$scope.project_count.all = API.countProjects()
   		angular.forEach(categories, function(category) {
   			$scope.project_count[category.name] = API.countProjects({ category: category.name })
   		})
   	})

   	$scope.switchCategory = function(category) {
   		API.projects({ category: category }).$promise.then(function(projects) {
        $scope.projects = projects
        angular.forEach(projects, function(project) {
          if (project.limit <= 0 ) project.funded = true
        })
      })
   		$scope.current_category = category
   	}

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
