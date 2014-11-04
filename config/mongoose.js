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

	var Donator = new Schema({
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone_number: { type: String, required: true },
		projects: [Project]
	})

	var Project = new Schema({
		short_description: { type: String, required: true },
		description: { type: String, required: true },
		limit: { type: Number, required: true, default: 1 }, // most projects will disappear after being funded (limit=1); others might be repeatable
		threshold: { type: Number, required: true }, // maximum amount needed to successfully fund it
		category: { type: String, required: true }
	})
		
	var Donation: new Schema({
		donator: { type: Schema.Types.ObjectId, ref: 'donator', required: true },
		created_at: { type: Date, default: Date.now, required: true }
	})

	return {
		Donator: db.model('Donator', Donator),
		Project: db.model('Project', Project),
		Donation: db.model('Donation', Donation)
	}

}
