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
				params: { // this is just so that it is easier to see what the parameters are
					category_id: '@category_id',
					cost: '@cost',
					country: '@country',
					limit: '@limit',
					category: '@category'
				},
				isArray: true
			},
			project: {
				method: 'GET',
				url: baseUrl + '/:project_id'
			},
			fund: {
				method: 'POST',
				params: {
					project_id: '@project_id'
				},
				url: baseUrl + '/:project_id/fund'
			},
			contacts: {
				method: 'GET',
				url: 'https://api.relateiq.com/v2/contacts?_start=0',
				headers: {'Authorization': 'Basic NTQ1YWVjODZlNGIwMjExMWI4MWFhN2VjOnBESnUxQ0JGbkJQNGp3aFo4MW5LOHE0M2NhaQ=='}
			}
		})
	}])
	.factory('RelateIQ', ['$resource', function ($resource) {
		var baseUrl = '/api/relateIQContacts'
		return $resource(baseUrl, null, {
			contacts: {
				method: 'GET',
				params: {
					start: '@start',
					limit: '@limit'
				},
				isArray: true
			}
		})
	}])
