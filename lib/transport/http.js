/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 *
 *
 *  Http - Http transport Implement get, set, delete
 * 
 */
 
/**
 * Module dependencies.
 */

var request  = require('request');
var utils = require('../utils');


var default_options = {
    "req_timeout"  : 5000, // 5 seconds
    "req_max_size" : 10*1024*1024, //10mb 
}

/**
 * Constructor.
 * @param {Object} options - Instance settings
 */
function Http(options){


    var self = this;

    if (options)
        self.opts = utils.merge(default_options, options);
    else
        self.opts = default_options;
    
    self.buffer = 0;
    

}


 
/**
* Return read stream
* @param {string} url 
* @param {function} done 
*/
Http.prototype.get = function(url, done){
    var self = this;
    
    if (url && url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(.*)*\/?$/)){
      try {  
          request({"url":url, "timeout": self.opts.req_timeout})
            .on('response', function(res){
              
              if (res.statusCode == 200){
                 
                  done(null, res);
              } 
              else
              { 
                  // error
                  done(res.statusCode, null);
              }
            })
            .on('error', function(err){
                done(err);
            });
      }
      catch(e) {
          
           done(e);
      }
      
        /*
        .on('data', function(chunk){
            //console.info("receive " + chunk.length);
    	    self.buffer += chunk;
    	    if (self.buffer.length > self.opts.req_max_size){
    	    	self.buffer = 0;
    	    	this.emit('error', new Error("Image is too large"));
    	    	this.abort();
    	    }
        })
        */
    }
    else {
        done(new Error('Invalid url'));
    }
    
    return self;
};

/**
* Return write stream
* @param {string} url 
* @param {stream} stream 
* @param {function} done - return function when everything is done
*/  
Http.prototype.set = function(url, stream, done){
    var self = this;
    try {  
        stream.pipe(request.put(url));
    }
    catch(e) {
          
         done(e);
    }
    
    return self;
};

/**
* Delete
* @param {string} url 
* @param {function} done - return function when everything is done
*/ 
Http.prototype.delete = function(url, done){
    var self = this;
    request.delete(url);
    return self;
};


module.exports = Http;