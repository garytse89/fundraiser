'use strict';

angular.module('distApp')
	.factory('API', ['$resource', function ($resource) {

		return $resource(baseUrl, null, {

		})
	}])