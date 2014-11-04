'use strict';

/**
 * @ngdoc function
 * @name htmlApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the htmlApp
 */
angular.module('htmlApp')
  .controller('MainCtrl', function ($scope, mainService) {
    $scope.projects = [
      'Rescue',
      'Operations',
      'Communications'
    ];
  });
