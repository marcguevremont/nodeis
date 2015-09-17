
/**
 * Module dependencies.
 */

var stream = require('stream');
var utils = require('./utils');
var util = require('util');
var FileStore = require('./transport/file');
var HttpStore = require('./transport/http');

module.exports = function(is){

  var proto = is.prototype;

/**
 * Constructor.
 *
 * @param {Object} options - option for catch
 * @return (Event) catched | not_cached on read and catch on write
 */
  function catcher(options) {
  
    if (!(this instanceof catcher))
      return new catcher(options);

    var self = this;
    
     // Options set in config file
    if (options)
      self.opts = utils.merge(self._is.opts, options);
    else
      self.opts = self._is.opts;
      
    // Get the query object from instance if not set or null
    self.opts.query = self.opts.query || self._is.opts.query || null;

    self._is.emit('catcher');

    stream.Writable.call(self)
  };

  util.inherits(catcher, stream.Writable);



  /*
  *Stream API implement pipe. 
  *If it does not we keep the destination for later. This is because sometime 
  *pipe is called before and sometime after.
  */

  catcher.prototype.get = function(key){
      
  }

  catcher.prototype.set = function(key, value, ttl){

  }

  catcher.prototype.delete = function(key){

  }


  catcher.prototype.pipe = function (dest, opts) {

    var self = this;
    
    if (self._source)
      self._source.pipe(dest, opts);
    else {
      self.dest = dest;
      self.dest_opts = opts;  
    }
    
    return dest;
    
  };

  proto.catcher = catcher;
  return catcher;
};


