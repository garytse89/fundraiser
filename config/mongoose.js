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

return {
	Donator: db.model('donator', new Schema({

	})),
	Project: db.model('project', new Schema({

	})),
	Donation: db.model('donation', new Schema({

	}))
}

}
