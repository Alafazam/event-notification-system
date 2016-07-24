var config = {};

config.session = {
	secret: process.env.SESSION_SECRET || 'boogieboogieboogie',
	resave: true,
	saveUninitialized: true,
	cookie: {
    	rolling: true,
    	maxAge: 60*60*1000
  	}
}

config.server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
config.server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
config.mongoDB_url = process.env.MONGO_DB_URL||"mongodb://localhost:27017/social_cops";

module.exports = config;