'use strict';

angular.module('distApp')
  .controller('header', ['$scope', 'API', '$modal', function ($scope, API, $modal) {

    $scope.openDonateModal = function() {
	    var modalInstance = $modal.open({
	        templateUrl: 'views/rtstmodal.html',
	        controller: 'RTSTDonateModalCtrl'
	      })
    }

}]);
