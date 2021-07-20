/*
 * Parking And Parking Main Server
 * 
 * @author : Bismay <bismay@smartinfologiks.com>
 * */

const config = require('./api/config');
const env = {};
/**
 * Loading all plugin packages required
 */
const restify = require('restify');
const restifyPlugins = require('restify-plugins');
const errors = require('restify-errors');
const bunyan = require('bunyan');

const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const autoIncrement = require('mongoose-plugin-autoinc');

const mysql = require('mysql');

const ioredis = require('ioredis');

global.fs = require('fs');
global.path = require('path');


global.moment = require('moment');
global._ = require('lodash');

/**
 * Create A Logger, may be we will remove this in future
 */
global.logger = bunyan.createLogger({
    name: config.name,
    streams: [{
        level: 'error',
        path: './logs/error.log' // log ERROR and above to a file
    }]
});

/**
 * Initialize Server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version,

    dtrace: false,
    log: logger,
    ignoreTrailingSlash: true
});
server.config = config;
server.env = env;

require('./api/misc')(server, restify);
require('./api/plugins')(server, restify);
require('./api/middleware')(server, restify);

require('./api/security')(server, restify);
require('./api/routes')(server, restify); // Load Basic System Routes

fs.readdirSync('./api/routes/').forEach(function(file) {
    if ((file.indexOf(".js") > 0 && (file.indexOf(".js") + 3 == file.length))) {
        filePath = path.resolve('./api/routes/' + file);
        require(filePath)(server, restify);
    }
    //   console.log("Loading Route : " + filePath);
});

/**
 * Start Server, Checks for availale PORTs
 * Then Connect to Mongo, MySQL, Redis
 */
server.listen(config.port, () => {

    //Setup REDIS
    server.redis = new ioredis(config.cache);

    //Setup MySQL
    server.mysql = mysql.createConnection(config.dbmysql);

    //Setup Mongoose->MongoDB
    mongoose.Promise = global.Promise;
    mongoose.connect(config.dbmongo.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    server.mongodb = mongoose.connection;

    server.mongodb.on('error', (err) => {
        console.error(err);
        process.exit(1);
    });

    server.mongodb.once('open', () => {
        //DB Setup Code
        server.use(function(req, res, next) {
            //             server.mysql.connect();

            //             server.mysql.query('SHOW TABLES', function (error, results, fields) {
            //                 if (error) throw error;
            //                 console.log(results,"MYSQL");
            //             });

            // server.mysql.end();

            next();
        });

        console.log(`${server.config.name} is listening on port http://${config.host}:${config.port}/`);
    });

    //console.log(`${server.config.name} is listening on port ${config.port}`);
});