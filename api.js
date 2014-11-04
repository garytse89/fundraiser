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
	 * @param category_id {ObjectId} [Optional]. the category id to filter by
	 * @param cost {Number} [Optional]. the cost to filter by
	 * @param country {String} [Optional].
	 * @param limit {Number} [Optional].
	 */
	app.get('/api/projects', function(req, res, next) {
		
		// remove null keys from query
		// an example query might be: { category: category_id }
		var query = _({
			category: req.param('category_id'),
			cost: req.param('cost'),
			country: req.param('country'),
			limit: req.param('limit')
		}).map(function(value, key, to_clean) { // filter null keys
			// || (_.isString(value) && _.trim(value).length === 0)
			if (_.isNull(value) || _.isUndefined(value)) {
			delete to_clean[key];
			}	
		});

		Models.Project.find(query).populate('category').lean().exec().then(function(result) {
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
		
		Models.Project.findOne({ _id: req.param('project_id') }).populate('category').lean().exec().then(function(project) {
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

		Models.Donator.findOneAndUpdate({
			name: req.param('name'),
			email: req.param('email'),
			phone_number: req.param('phone_number')
		}, {
			$addToSet: {
				projects: req.param('project_id')
			}
		}, { upsert: true }).lean().exec().then(function(donator) {

			return Models.Donation.create({
				donator: donator._id,
				amount: req.param('amount')
			})

		}).then(function(result) {
			return res.send(200, result)
		}, function(err) {
			return res.send(500, err)
		})
	})

}
