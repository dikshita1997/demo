const packageConfig = require('../package.json');

module.exports = {
	name: packageConfig.title,
	version: packageConfig.version,
	packageid: packageConfig.name,
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 9999,
	base_url: process.env.BASE_URL || 'http://localhost:9999',
	debug: true,
	welcome: "Welcome to eStore API Server",
	allow_home_info: false,

	LOGGER: [
        	{
			type: 'rotating-file',
			period: '1d',                       // daily rotation
			count: 3,                           // keep 3 back copies
			level: 'error',                     // log level
			path: './logs/logs.log'             // log ERROR and above to a file
		},
		{
			level: 'error',                     //log level
			stream: process.stdout              // log INFO and above to stdout
		}
	],

	noauth: [
		"/auth",
		"/auth/register",
		"/auth/forgotpwd",
		"/auth/resetpwd",
		"/ping",
		"/test",
		"/"
	],
	jwt: {
		secret: "Zv7QAeJWhWz6j2kA"
	},
	mail:{
		host: 'email-smtp.us-east-1.amazonaws.com',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
		    user: "smtp-userid", // generated ses user
		    pass: "smtp-pwd" // generated ses password
		}
	},


	dbmongo: {
		uri: 'mongodb://127.0.0.1:27017/silkapi'
	},
	dbmysql: {
		host: '127.0.0.1',
		port: 3306,
		user: 'test',
		password: 'test',
		database: 'testdb',
		insecureAuth : true
  	},
	cache : {
		host: '127.0.0.1',   // Redis host
		port: 6379,          // Redis port
		family: 4,           // 4 (IPv4) or 6 (IPv6)
		//password: 'auth',
		db: 0
	}
};