'use strict';

angular.module('distApp')
  .controller('MainCtrl', ['$scope', '$routeParams', 'API', 'Socket', function ($scope, $routeParams, API, Socket) {

  	$scope.category = $routeParams.category

    API.projects({ category: $scope.category }).$promise.then(function(projects) {
      $scope.projects = projects
      angular.forEach(projects, function(project) {
        if (project.limit <= 0 ) {
          project.funded = true
        }
        var numInWords = toWords(project.limit)
        numInWords = toTitleCase(numInWords)
        project.countRemaining = numInWords
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
          var numInWords = toWords(project.limit)
          numInWords = toTitleCase(numInWords)
          project.countRemaining = numInWords
        })
      })
   		$scope.current_category = category
   	}

  	Socket.on('project::funded', function(data) {
  		$scope.$apply(function() {
		    _($scope.projects).map(function(project) {
		    	if (project._id == data.project_id) {
            API.project({ project_id: project._id }).$promise.then(function(p) {
              if (p.limit <= 0) {
  		    		  project.funded = true // if project had 1 donation count remaining
              } else {
                project.funded = false
              }

              console.log('remaining limits = ', p.limit)
              console.log('project.funded = ', project.funded)
              var numInWords = toWords(p.limit)
              numInWords = toTitleCase(numInWords)
              project.countRemaining = numInWords
            })
		    	}
		    	return project
		    })
		  })
	  })

}]);

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
