module.exports = function(database_name) {

	var mongoURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/';

	var mongoose = require('mongoose'),
    fs = require('fs');

    console.log('Connecting to ' + mongoURI + database_name)
	db = mongoose.createConnection(mongoURI + database_name);

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
		short_description: { type: String, required: true },
		description: { type: String, required: true },
		limit: { type: Number, required: true, default: 1 }, // most projects will disappear after being funded (limit=1); others might be repeatable
		threshold: { type: Number, required: true }, // maximum amount needed to successfully fund it
		category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
	}, { collection: 'projects' }).index({ name: 1 }, { unique: true, sparse: true })

	var Donator = new Schema({
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true },
		phone_number: { type: String, required: true },
		projects: [Project]
	}, { collection: 'donators' })

	var Donation = new Schema({
		donator: { type: Schema.Types.ObjectId, ref: 'Donator', required: true },
		created_at: { type: Date, default: Date.now, required: true },
		amount: { type: Number, required: true }
	}, { collection: 'donations'})

	return {
		Donator: db.model('Donator', Donator),
		Project: db.model('Project', Project),
		Donation: db.model('Donation', Donation),
		Category: db.model('Category', Category)
	}

}
