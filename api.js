var _ = require('underscore')

module.exports = function(app) {

	/**
	 * return all categories
	 */
	app.get('/api/categories', function(req, res, next) {

		Models.Category.find({}).lean().exec().then(function(categories) {
			return res.send(200, categories)
		}, function(err) {
			return res.send(500, err)
		})
	})

	/**
	 * find all projects
	 * optionally pass in filter parameters like category_id, cost, country, limit
	 *
	 * @param category {String} [Optional]. the category name to filter by
	 * @param cost {Number} [Optional]. the cost to filter by
	 * @param country {String} [Optional].
	 * @param limit {Number} [Optional].
	 */
	app.get('/api/projects', function(req, res, next) {
		
		// remove null keys from query
		// an example query might be: { category: category_id }
		var query = {
			category: req.param('category'),
			cost: req.param('cost'),
			country: req.param('country'),
			limit: { $gt : 0 }
		}

		_(query).map(function(value, key, to_clean) { // filter null keys
			// || (_.isString(value) && _.trim(value).length === 0)
			if (_.isNull(value) || _.isUndefined(value)) {
			delete to_clean[key];
			}	
		});

		console.log(query)
		Models.Project.find(query).lean().exec().then(function(result) {
			return res.send(200, result)
		}, function(err) {
			return res.send(500, err)
		})
	})

	/**
	 * get single project by id
	 * @param project_id {ObjectId}. the project id
	 */
	app.get('/api/projects/:project_id', function(req, res, next) {
		
		Models.Project.findOne({ _id: req.param('project_id') }).lean().exec().then(function(project) {
			return res.send(200, project)
		}, function(err) {
			return res.send(500, err)
		})
	})

	/**
	 * fund a project
	 * if the donator is new, create a new donator object and add the project
	 * if the donator is not new, update the donator by adding the project to the set of projects
	 */
	app.post('/api/projects/:project_id/fund', function(req, res, next) {
		console.log('\nfunding api called\n')
		Models.Donator.findOneAndUpdate({
			name: req.param('name'),
			email: req.param('email'),
			phone_number: req.param('phone_number')
		}, {
			$addToSet: {
				projects: req.param('project_id')
			}
		}, { upsert: true }).lean().exec()
		.then(function(donator) {

			console.log('\ndonation created\n')

			return Models.Donation.create({
				donator: donator._id,
				amount: req.param('amount')
			})

		})
		.then(function(result) {

			Models.Project.findOneAndUpdate({ 
				_id: req.param('project_id') 
			}, { 
				$inc: { 
					limit: -1 
				} 
			}).lean().exec()
		})
	    .then(function(result) {
			return res.send(200, result)
		}, function(err) {
			console.log("ERR", err)
			return res.send(500, err)
		})
	})
}
