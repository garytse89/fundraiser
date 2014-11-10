var q = require('q'),
	API = require('./api');

module.exports = function(io) {

	// authorize websocket channel
	io.on('connection', function(socket) {
		
		/**
		 * fund a project
		 * if the donator is new, create a new donator object and add the project
		 * if the donator is not new, update the donator by adding the project to the set of projects
		 */
		socket.on('project::fund', function(data, fn) {
			console.log('>> creating donation...')
			console.log(data)
			Models.Donation.create({
				name: data.name,
				email: data.email,
				phone_number: data.phone_number,
				address: data.address,
				amount: data.amount,
				project_id: data.project_id
			}).then(function(donator) {
				// broadcast event to project channel (goes to everybody)
				io.emit('project::funded', { project_id: data.project_id, project_category: data.project_category, amount: data.amount });
				// broadcast event to main channel for progress bar (broadcast to everybody including current user)
				io.emit('pledge::new', { project_id: data.project_id, project_category: data.project_category, amount: data.amount })

				return Models.Project.findOneAndUpdate({ 
						_id: data.project_id
					}, { 
						$inc: { 
							limit: -1 
						} 
					}).lean().exec()

			}).then(function() {
				fn(null)
			}, function(err) {
				console.log(err.stack)
				fn({ error: err })
			})
		})

	})
}