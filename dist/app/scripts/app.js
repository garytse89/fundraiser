'use strict';

angular.module('distApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider      
      .when('/projects', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/projects/:project_id', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .when('/projects/:project_id/pledge', {
        templateUrl: 'views/pledge.html',
        controller: 'PledgeCtrl'
      })
      .when('/confirmation', {
        templateUrl: 'views/confirmation.html',
        controller: 'ConfirmationCtrl'
      })
      .when('/thankyou', {
        templateUrl: 'views/thankyou.html',
        controller: 'ThankyouCtrl'
      })
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
