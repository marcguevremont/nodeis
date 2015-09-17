
/**
 * Module dependencies.
 */
var stream  = require('stream');
var utils   = require('./utils');
var util    = require('util');
var FileStore = require('./transport/file');

module.exports = function(is){

  var proto = is.prototype;

/**
 * Constructor.
 *
 * @param {Source | String} [source] - optional stream to be written or method to call
 * @param {String} method - method to call for storing the input | stream
 */
  function storer(source, method) {
  
    if (!(this instanceof storer)){
      //return new storer(options);
      return utils.construct(storer,arguments);
    }

  	var self = this;

  	stream.Writable.call(self)

    
    //Get option from is instance
    
   	self._source = null;
    self._method = null;
    self._args = [];

    //For piping
    self.dest = null;

   /*
    * Source is optional
    * Source can be a stream
    * Source can be an option object
    * Else it's a method
    */
    var m = method
    var options = null;
    
    
    if (source && (source instanceof stream.Stream))
      self._source = source;
    else if (source && (typeof source === "object"))
    {
      options = source;
      self.opts = utils.merge(self._is.opts, options);
      self._source = self.opts.source || null;
      self._method  = options.method || null;
      self._args = options.args || [];
    }
    else
      m = source;
    
    if (!options)
      self.opts = self._is.opts;

    // Get the query object from instance if not set or null
    self.opts.query = self.opts.query || self._is.opts.query || null;


   /*
    * Check if method exist and if it's a function
    * Keep all arguments except the first || second
    */
    if (m && (typeof self[m] === 'function' ))
    {
        self._method = m;
        
        var skip_args = (self._source == null)?1:2;
        self._args = Array.prototype.slice.call(arguments, skip_args);
    }
    else if (m)
    {
        //Method exist but it is not a function
        self._is.emit("error", new Error('Unknow method in storer'));
    }
    else
    {
      //Called without method
    }

    self.initStream();
   	
  };

  util.inherits(storer, stream.Writable);
  //util.inherits(storer, stream.Stream);

 /*
  *Initialize stream
  */
  storer.prototype.initStream = function(){
    var self = this;
    
   /*
    *If piped unpiped and process
    */
    self.on('pipe',function(source) {
      
      self._source = new stream.PassThrough();
        
      source.unpipe(this);
        
      source.pipe(self._source);
       
      self.preStore();
    }); 

   /*
    *If source exist call preStore directly
    */
    self.preStore();
  };

 

  /*
  * Call the right method passed in the constructor
  */
  storer.prototype.preStore = function(){
    var self = this;
    if (!(self._source)) return;
    if (!(self._method)) return;
      
    self[self._method].apply(self, self._args);
  };

  /*
  * Called after store for piping and emit store
  */
  storer.prototype.postStore = function(){
    var self = this;
    if (self.dest){
        self.pipe(self.dest,self.dest_opts);
    }
        
    self._is.emit('store', self._source);
  };

  
  /*
  *Stream API implement pipe. 
  *If it does not we keep the destination for later. This is because sometime 
  *pipe is called before and sometime after.
  */
  storer.prototype.pipe = function (dest, opts) {

    var self = this;
    
    if (self._source)
      self._source.pipe(dest, opts);
    else {
      self.dest = dest;
      self.dest_opts = opts;  
    }
    
    return dest;
    
  };

  /*
  * Write in file 
  * Emit end & store
  */
  storer.prototype.file = function(path_to_src){
    var self = this;
    var store = new FileStore().set(path_to_src);

    store.on('open', function (source) {
      // This just pipes the read stream to the response object (which goes to the client)
      
       self._source.pipe(source);
       
      //Call emit and pipe out
      self.postStore(); 
      
    });  
    
    store.on('error',function(err){
        self._is.emit('error', err);
    });
    

    store.on('end', function () {
      self._is.emit('end');
    });
    
    
  };

 

  proto.storer = storer;
  return storer;

};


