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
			Models.Donator.findOneAndUpdate({
				name: data.name,
				email: data.email,
				phone_number: data.phone_number,
				address: data.address
			}, {
				$addToSet: {
					projects: data.project_id
				}
			}, { upsert: true }).lean().exec()
			.then(function(donator) {

				// broadcast event to project channel (goes to everybody except the current user)
				io.emit('project::funded', { project_id: data.project_id, amount: data.amount });
				// broadcast event to main channel for progress bar (broadcast to everybody including current user)
				io.emit('pledge::new', { project_id: data.project_id, amount: data.amount })

				return q.all([
					Models.Donation.create({
						donator: donator._id,
						amount: data.amount
					}),
					Models.Project.findOneAndUpdate({ 
						_id: data.project_id
					}, { 
						$inc: { 
							limit: -1 
						} 
					}).lean().exec()
				])
			}).then(function() {
				fn(null)
			}, function(err) {
				fn({ error: err })
			})
		})

	})
}