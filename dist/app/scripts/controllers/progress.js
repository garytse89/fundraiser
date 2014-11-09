'use strict';

angular.module('distApp')
  .controller('progress', ['$scope', 'API', 'Socket', function ($scope, API, Socket) {

    $scope.donation_target = 550000 
    /*API.donationTarget().$promise.then(function(donation_target) {
      $scope.donation_target = donation_target.target
    })*/

  	API.countDonations().$promise.then(function(total) {
      var total = total.donation_total
      $scope.donation_amount = total
    })

    Socket.on('project::funded', function(data) {
      $scope.donation_amount += data.amount
	  })

    $scope.calculatePercentage = function(value, max) {
      return (value/max)*100
    }

}]);
