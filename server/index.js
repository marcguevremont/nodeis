/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 *
 *
 *  Server entry point
 * 
 */

/**
 * Module dependencies.
 */
var config = require("../etc/config");
var express = require('express');
var route = require('./router');
var path = require('path')

var app = express();


/**
 * middleware
 * Set allow origin anywhere for ajax connection
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next
 */
 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(function(req, res, next){
    if (req.url === '/favicon.ico') {
        res.writeHead (200, {'Content-Type': 'image/x-icon'});
        res.end('stupid favicon...');   
    }
    else
        next();
});

//app.use('/image', express.static(path.join(__dirname, 'tmp')));

// Bind route object
app.use('/', route);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.log(req.path)
        console.log(err.stack);
        
        res.writeHead(res.status, {'content-type': 'text/plain'});
        res.end(err +  "\nCode:"+ err.status)
       // throw new Error(err);
       
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);   
    res.writeHead(res.status, {'content-type': 'text/plain'});
    res.end("")

    //log insstead Error: "+err +  "Message: " + err.message + "\n
});


module.exports = app;