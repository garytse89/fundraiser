module.exports = function(database_name) {

	var mongoURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/' + database_name;

	var mongoose = require('mongoose'),
    fs = require('fs');

    console.log('Connecting to ' + mongoURI)
	db = mongoose.createConnection(mongoURI);

	mongoose.set('debug', true)

	db.on('error', function(err) {
		console.log("ERROR")
		console.log(err)
	})
	var Schema = mongoose.Schema;

	var Category = new Schema({
		name: { type: String, required: true, unique: true },
		description: { type: String }
	}, { collection: 'categories' })

	var Project = new Schema({
		name: { type: String },
		special: { type: Boolean },
		category: { type: String, required: true },
		country: { type: String, required: true },
		cost: { type: Number, required: true },
		short_description: { type: String, required: true },
		description: { type: String, required: true },
		limit: { type: Number, required: true, default: 1, min: 0 }, // most projects will disappear after being funded (limit=1); others might be repeatable
		repeated: { type: Boolean }
	}, { collection: 'projects' }).index({ name: 1 }, { unique: true, sparse: true })

	var Donation = new Schema({
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone_number: { type: String, required: true },
		amount: { type: Number, required: true },
		project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
		created_at: { type: Date, default: Date.now }
	}, { collection: 'donations' }).index({ project_id: 1, name: 1 }, { unique: true })

	var Contact = new Schema({
		properties: Schema.Types.Mixed
	}, { collection: 'contacts'})

	return {
		Project: db.model('Project', Project),
		Donation: db.model('Donation', Donation),
		Category: db.model('Category', Category),
		Contact: db.model('Contact', Contact)
	}

}
