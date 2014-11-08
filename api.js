var _ = require('underscore'),
	q = require('q'),
	RelateIQ = require('relateiq');

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
	 * count the projects in the category
	 * if no category is supplied, count all projects
	 */
	app.get('/api/projects/count', function(req, res, next) {
		var category = req.param('category')
		var query = category ? {
			category: req.param('category')
		} : {}

		Models.Project.count(query).lean().exec().then(function(count) {
			return res.send(200, { count: count })
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
			country: req.param('country')
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

	app.get('/api/relateIQContacts', function(req, res, next) {
		// contact relate iq API and return contacts
		// needs to be done this way so we dont expost our API key and secret
		
		//var relateiq = new RelateIQ(process.env.RELATEIQ_API_KEY, process.env.RELATEIQ_SECRET)
		var relateiq = new RelateIQ("545aec86e4b02111b81aa7ec", "pDJu1CBFnBP4jwhZ81nK8q43cai")

		var getContact = function(contact_id) {
			var defer = q.defer()
			console.log('Getting contact...')
			relateiq.getContact(contact_id, function(err, contact) {
				if(err) console.log(err)
				defer.resolve(contact)					
			})
			return defer.promise
		}

		relateiq.getListItems("5412b6a5e4b050d28eb4aa4f", function(err, list_items) {
			console.log("Got %d list items (relationships)", list_items.length)			
			var promises = []
			list_items.forEach(function(list_item) {				
				promises.push(getContact(list_item.contactIds[0]))
			})
			q.all(promises).then(function(result) {
				return res.send(200, result)
			}, function(err) {
				return res.send(200,err)
			})
		})		
	})

	/**
	 * aggregate the total donation amount
	 */
	app.get('/api/donations/countTotal', function(req, res, next) {
		Models.Donation.aggregate(
			{ $group: {
				_id: null,
				donation_total: { $sum: '$amount' }
			} },
			{ $project: {
				_id: 0,
				donation_total: '$donation_total'
			} }
		).exec().then(function(aggregate) {
			return res.send(200, aggregate[0])
		}, function(err) {
			console.log(err.stack)
			return res.send(500, { error: err })
		})
	})

}
