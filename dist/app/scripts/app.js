'use strict';

angular.module('distApp', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.bootstrap',
  'ui.bootstrap.typeahead',
  'btford.socket-io'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
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
      .when('/progress', {
        templateUrl: 'views/progress.html',
        controller: 'progress'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
