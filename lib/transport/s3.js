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
* Return write stream
*/ 
S3.prototype.set = function(filename, stream, done){
    var self = this;
    
    var s3 = new AWS.S3();
    var params = {Bucket: self.opts.bucket, Key: filename, Body: stream};
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
* Async delete file
*/ 

S3.prototype.delete = function(filename, done){
    var self = this;
    
    return self;
};


module.exports = S3;