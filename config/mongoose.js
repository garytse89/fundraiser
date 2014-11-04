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
		name: String,
		projects: [Project]
	})

	var Project = new Schema({
		short_description: String,
		description: String
	})
		
	var Donation: new Schema({

	})

	return {
		Donator: db.model('Donator', Donator),
		Project: db.model('Project', Project),
		Donation: db.model('Donation', Donation)
	}

}
