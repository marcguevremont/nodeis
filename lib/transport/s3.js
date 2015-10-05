/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 *
 *
 *  S3 - S3 transport Implement get, set, delete
 * 
 */

/**
 * Module dependencies.
 */

var utils = require('../utils');
var AWS = require('aws-sdk'); 

var default_options = {
    "bucket"  : "", 
    "aws_key" : "",
    "aws_secret":"",
}

/**
 * Constructor.
 * @param {Object} options - Instance settings
 */
function S3(options){

    var self = this;
    
     if (options)
        self.opts = utils.merge(default_options, options);
    else
        self.opts = default_options;
        
     AWS.config.update({accessKeyId: self.opts.aws_key , secretAccessKey:  self.opts.aws_secret});  
}

/**
* Return read stream
* @param {string} filename 
* @param {function} done 
*/
S3.prototype.get = function(filename, done){
    var self = this;
   
        var s3 = new AWS.S3();
        var params = {Bucket: self.opts.bucket, Key: filename};
        
    try {
        var file = s3.getObject(params).createReadStream();
        
        file.once('readable', function(res){
             done(null, file);
        });
        
        file.on('error', function(err){
            done(err,null)
        });
    }
    catch(e){
        done(e);
    }
    
    return self;
 
};
/**
 * Determine content type from setFormat
 * @param {string} filename 
 */ 
S3.prototype.contentType = function(filename){
    
    if (filename.indexOf('.jpg') != -1)
        return 'image/jpeg'
    if (filename.indexOf('.gif') != -1)
         return 'image/gif'
    if (filename.indexOf('.png') != -1)
        return 'image/png'
    if (filename.indexOf('.jpeg') != -1)
        return 'image/jpeg'
    if (filename.indexOf('.webp') != -1)
        return 'image/webp'
}

/**
* Return write stream
* @param {string} filename 
* @param {stream} stream 
* @param {function} done - return function when everything is done
*/  
S3.prototype.set = function(filename, stream, done){
    var self = this;
    var s3 = new AWS.S3();
    var params = {Bucket: self.opts.bucket, Key: filename, Body: stream, ContentType: self.contentType};
    
    try {
         
         s3.upload(params).send(function(err, data) {
            if (err)
              return done(err);
        });
    }
    catch(e){
        done(e);
    }
        
    return self;
};

/**
* Delete
* @param {string} filename 
* @param {function} done - return function when everything is done
*/ 
S3.prototype.delete = function(filename, done){
    var self = this;
    
    var s3 = new AWS.S3();
    var params = {Bucket: self.opts.bucket, Key: filename};
    try {
        s3.deleteObject(params, function(err, data) {
          if (err)
              return done(err);
        });
    }
    catch(e){
        done(e);
    }
    
    return self;
};


module.exports = S3;