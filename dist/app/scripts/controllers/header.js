'use strict';

angular.module('distApp')
  .controller('header', ['$scope', 'API', 'Socket', function ($scope, API, Socket) {

    $scope.donation_target = 500000;

  	API.countDonations().$promise.then(function(total) {
      $scope.donation_amount = total.donation_total
    })

    Socket.on('project::funded', function(data) {
      $scope.donation_amount += data.amount
	  })

}]);
