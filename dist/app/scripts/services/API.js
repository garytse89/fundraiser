'use strict';

angular.module('distApp')
	.factory('API', ['$resource', function ($resource) {
		var baseUrl = '/api/projects'
		return $resource(baseUrl, null, {
			categories: {
				method: 'GET',
				url: '/api/categories',
				isArray: true
			},
			projects: {
				method: 'GET',
				url: baseUrl,
				params: {
					category_id: '@category_id'
				},
				isArray: true
			},
			project: {
				method: 'GET',
				url: baseUrl + '/:project_id'
			},
			fund: {
				method: 'POST',
				url: baseUrl + '/:project_id/fund'
			}
		})
	}])