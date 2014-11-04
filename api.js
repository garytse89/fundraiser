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
	 * find projects by category_id
	 * if no category id is given, return all projects
	 */
	app.get('/api/projects', function(req, res, next) {
		
		// remove null keys from query
		// an example query might be: { category: category_id }
		var query = _(req.query).map(function(value, key, to_clean) {
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
		}, { upsert: true }).exec().then(function(donator) {

			return Models.Donation.create({
				donator: donator.toObject()._id,
				amount: req.param('amount')
			})

		}).then(function(result) {
			return res.send(200, result)
		}, function(err) {
			return res.send(500, err)
		})
	})

}
