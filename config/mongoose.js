module.exports = function(database_name) {

var mongoURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/';

var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    fs = require('fs');

    console.log('Connecting to ' + mongoURI + database_name)
	db = mongoose.createConnection(mongoURI + database_name);

	mongoose.set('debug', process.env.MONGOOSE_DEBUG || false)

db.on('error', function(err) {
	console.log("ERROR")
	console.log(err)
})
var Schema = mongoose.Schema;

var donater = new Schema({

})

var project = new Schema({

})

var donation = new Schema({
	
})

return {
	level: db.model('level', level),
	category: db.model('category', category),
	subscription_plan: db.model('subscription_plan', subscription_plan),
	user: db.model('user', user),
	tutor: db.model('tutor', tutor),
	client: db.model('client', client),
	endorsement: db.model('endorsement', endorsement),
	network: db.model('network', network),
	follower: db.model('follower', follower),
	access_token: db.model('access_token', access_token),
	event: db.model('event', event),
	imported_event: db.model('imported_event', imported_event),
	tutor_session: db.model('tutor_session', tutor_session),
	group_session: db.model('group_session', group_session),
	event_template: db.model('event_template', event_template),
	rating: db.model('rating', rating),
	view: db.model('view', view),
	pending_payment: db.model('pending_payment', pending_payment),
	in_transit_payment: db.model('in_transit_payment', in_transit_payment),
	phone_verification_keys: db.model('phone_verification_keys', phone_verification_keys),
	linked_paypal_account: db.model('linked_paypal_account', linked_paypal_account),
	payment_credits: db.model('payment_credits', payment_credits),
	payment_credits_config: db.model('payment_credits_config', payment_credits_config),
	transaction: db.model('transaction', transaction),
	post: db.model('post', post),
	comment: db.model('comment', comment),
	activity: db.model('activity', activity),
	notification: db.model('notification', notification),
	conversation: db.model('conversation', conversation),
	message: db.model('message', message),
	user_permission: db.model('user_permission', user_permission),
	role_permission: db.model('role_permission', role_permission),
	object_permission: db.model('object_permission', object_permission),
	promotion: db.model('promotion', promotion), 
	local_promotion: db.model('local_promotion', local_promotion),
	facebook_promotion: db.model('facebook_promotion', facebook_promotion),
	channel: db.model('channel', channel),
	advertisement: db.model('advertisement', advertisement),
	conversions: db.model('conversions', conversions),
	subscription: db.model('subscription', subscription),
	google_auth: db.model('google_auth', google_auth)
}

}
