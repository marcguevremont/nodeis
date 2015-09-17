
/**
 * Module dependencies.
 */
 
var stream = require('stream');
var utils = require('./utils');
var FileStore = require('./transport/file');
var HttpStore = require('./transport/http');


/**
 * Constructor.
 *
 * @param {String} method - method to call for reading input stream ex : url | file 
 */
 
module.exports = function(is){

  var proto = is.prototype;
 
  function reader(method) {
   

    if (!(this instanceof reader)) {
      // console.log(this)
      // return new reader(arguments);
      return utils.construct(reader,arguments);      
    }
    
    
    var self = this;

    // If method is object than it is an option arr
    var options = (typeof method === "object")?method:null;
    
    if (options)
      self.opts = utils.merge(self._is.opts, options);
    else
      self.opts = self._is.opts;

    // Get the query object from instance if not set or null is unset
    self.opts.query = self.opts.query || self._is.opts.query || null;

    // for piping
    self.dest = null;
    self._source = null;
   
    if (method && (typeof self[method] === 'function' )){
           // All argument except the first
          var args = Array.prototype.slice.call(arguments, 1);
          // console.log(JSON.stringify(arguments))
           self[method].apply(self, args);
    }
    else if (typeof method === "object"){
        if (self.opts.args){
          if (typeof self[self.opts.method] === 'function')
            self[self.opts.method].apply(self,self.opts.args);
          else
            self._is.emit("error", new Error('Unknow method in reader'));
        }

    }
    else if (typeof method === "string")
    {
       self._is.emit("error", new Error('Unknow method in reader'));
    }
    else
    {
        // Called without method || option
    }
  }

  /**
   * Register stream when available
   */ 

  reader.prototype.registerStream = function(source){
    var self = this;
      if (source instanceof stream.Stream){
        self._source = source;

        self._source.on('error',function(err){
            // Most likely file don't exist or is too large
            
            self._is.emit('error', err);
        });

        // Call piping is destination and emit event read
        if (self.dest)
          self.pipe(self.dest,self.dest_opts);

        self._is.emit('read', self._source);  
      }
  };

 /**
  * Read form file
  */
  reader.prototype.file = function(path_to_src){
    var self = this;
    var store = new FileStore().get(path_to_src);

    store.on('open', function (source) {
      // This just pipes the read stream to the response object (which goes to the client)
      self.registerStream(source); 
    });  
    
    store.on("error", function(error){
      self._is.emit('error', error);
    })
    
  };

  /*
  *Read url and register a stream
  */
  reader.prototype.url = function url(url){
    
    var self = this;
    
    var store = new HttpStore({"req_timeout":self.opts.req_timeout,"req_max_size" : self.opts.req_max_size}).get(url);
    
    store.on('open', function(source){
     
        self.registerStream(source);
    }); 


    store.on('error', function(err){
        self._is.emit('error', err);
    });
  };

  
  // Stream API
  reader.prototype.pipe = function (dest, opts) {
   
    if (this._source)
        this._source.pipe(dest, opts);
    else
    {
        this.dest = dest;
        this.dest_opts = opts;  
    }

    return dest;
    
  };

  proto.reader = reader;
  return reader;

};


