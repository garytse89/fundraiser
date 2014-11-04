module.exports = function(app) {
	

	app.get('/projects', function(req, res, next) {

		Models.Project.find( function(err, result) {
			if(err) {
				return res.send(404, err)
			}
			return res.send(200, result)
		})
	})

	app.post('/fundProject', function(req, res, next) {
		// add a new donator then add a new donation
		console.log(req.body)

		var donator = {
			name: req.body.name,
			email: req.body.email,
			phone_number: req.body.phone_number
		}

		Models.Donator.create(donator, function(err, result) {
			if(err) {
				return res.send(404, err)
			}

			var donation = {
				amount: req.body.amount,
				created_at: new Date(),
				donator: result._id
			}

			Models.Donation.create(donation, function(err, result) {
				if(err) return res.send(404, err)
				return res.send(200, result)
			})
		})
	})

}
