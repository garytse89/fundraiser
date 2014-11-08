'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', 'Socket', '$modal', function ($scope, $routeParams, API, Socket, $modal) {

  	$scope.category = $routeParams.category

    API.projects({ category: $scope.category }).$promise.then(function(projects) {
      $scope.projects = projects
      angular.forEach(projects, function(project) {
        
        project.funded = project.limit <= 0

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
          
          project.funded = project.limit <= 0

        })
      })
   		$scope.current_category = category
   	}

    $scope.openProjectModal = function(project) {
      var modalInstance = $modal.open({
        templateUrl: 'views/modal.html',
        controller: 'PledgeModalCtrl',
        resolve: {
          project: function() {
            return project
          }
        }
      })
    }

  	Socket.on('project::funded', function(data) {
  		$scope.$apply(function() {
		    _($scope.projects).map(function(project) {
		    	if (project._id == data.project_id) {
            API.project({ project_id: project._id }).$promise.then(function(p) {
              
              project.funded = p.limit <= 0

            })
		    	}
		    	return project
		    })
		  })
	  })

}]);
