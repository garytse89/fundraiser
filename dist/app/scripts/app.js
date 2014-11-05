'use strict';

angular.module('distApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/projects/:project_id', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .when('/pledge', {
        templateUrl: 'views/pledge.html',
        controller: 'PledgeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
