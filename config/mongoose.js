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
		category: { type: String, required: true },
		country: { type: String, required: true },
		cost: { type: Number, required: true },
		short_description: { type: String, required: true },
		description: { type: String, required: true },
		limit: { type: Number, required: true, default: 1 } // most projects will disappear after being funded (limit=1); others might be repeatable
	}, { collection: 'projects' }).index({ name: 1 }, { unique: true, sparse: true })

	var Donator = new Schema({
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true },
		phone_number: { type: String, required: true },
		projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
	}, { collection: 'donators' })

	var Donation = new Schema({
		donator: { type: Schema.Types.ObjectId, ref: 'Donator', required: true },
		created_at: { type: Date, default: Date.now },
		amount: { type: Number, required: true }
	}, { collection: 'donations'})

	return {
		Donator: db.model('Donator', Donator),
		Project: db.model('Project', Project),
		Donation: db.model('Donation', Donation),
		Category: db.model('Category', Category)
	}

}
