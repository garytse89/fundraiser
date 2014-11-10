'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', 'Socket', '$modal', '$location', function ($scope, $routeParams, API, Socket, $modal, $location) {

  	$scope.category = $routeParams.category
    
    $scope.rescue_total = 116645
    $scope.rehabilitation_total = 340280
    $scope.investment_total = 511850

    API.countDonations().$promise.then(function(donations) {
        $scope.accumulated = {
          Rescue: donations.Rescue.donation_total,
          Rehabilitation: donations.Rehabilitation.donation_total,
          Investment: donations.Investment.donation_total
        }
    })

    API.projects({ category: $scope.category }).$promise.then(function(projects) {
      $scope.projects = projects    

      angular.forEach(projects, function(project) {
        project.funded = project.limit == 0
        if (project.limit <= -1) project.unlimited = true
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
        $scope.current_category = category
        $scope.projects = projects
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

      var category = data.project_category

      $scope.accumulated[category] += data.amount

  		$scope.$apply(function() {
		    _($scope.projects).map(function(project) {
		    	if (project._id == data.project_id) {
            project.limit -= 1
		    	}
		    	return project
		    })
		  })
	  })

}]);
