'use strict';

angular.module('distApp')
	.factory('Socket', ['socketFactory', function (socketFactory) {
		var socket = socketFactory()

		socket.forward('pledge::new')

		return socket
	}])
