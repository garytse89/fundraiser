'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', 'Socket', '$modal', '$location', function ($scope, $routeParams, API, Socket, $modal, $location) {

  	$scope.category = $routeParams.category

    API.projects({ category: $scope.category }).$promise.then(function(projects) {
      $scope.projects = projects    

      angular.forEach(projects, function(project) {
        project.funded = project.limit == 0
        if (project.limit <= -1) project.unlimited = true
      })     

      $scope.calculateTotals(projects)
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

    $scope.calculateTotals = function(projects) {

      // pre-calculated totals
      $scope.total_rescue = 116645
      $scope.total_rehabilitation = 340280
      $scope.total_investment = 511850

      // calculate total so far 
      var sum_rescue = 0
      var sum_rehabilitation = 0
      var sum_investment = 0

      angular.forEach(projects, function(project) {  
        if (project.limit > 0) { // don't bother adding in the unlimited projects
          if (project.category === "Rescue") {
            sum_rescue += project.cost * project.limit
          } else if (project.category === "Rehabilitation") {
            sum_rehabilitation += project.cost * project.limit
          } else {
            sum_investment += project.cost * project.limit
          }
        }
      })

      $scope.current_rescue = $scope.total_rescue - sum_rescue
      $scope.current_rehabilitation = $scope.total_rehabilitation - sum_rehabilitation
      $scope.current_investment = $scope.total_investment - sum_investment
    }

   	$scope.switchCategory = function(category) {
   		API.projects({ category: category }).$promise.then(function(projects) {
        $scope.current_category = category
        $scope.projects = projects

        $scope.calculateTotals(projects)
      })
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
      console.log(data)

      API.projects().$promise.then(function(projects) {
        $scope.projects = projects   
        $scope.calculateTotals(projects)
      })

  		$scope.$apply(function() {
		    _($scope.projects).map(function(project) {
		    	if (project._id == data.project_id) {
            console.log(project)
            project.limit -= 1
		    	}
		    	return project
		    })
		  })
	  })

}]);
