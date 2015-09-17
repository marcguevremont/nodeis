
/**
 * Module dependencies.
 */



var stream = require('stream');
var utils = require('./utils');
var util = require('util');
var config = require('../etc/config');

var default_options = config.options;
/**
 * Constructor.
 *
 * @param {String|Number} path - path to img source or ReadableStream or width of img to create
 * @param {Number} [height] - optional filename of ReadableStream or height of img to create
 * @param {String} [color] - optional hex background color of created img
 */
 
util.inherits(is, stream.PassThrough);

function is(options) {
    

    if (!(this instanceof is)){

      return utils.construct(is, arguments);
    }

  	var self = this;

  	stream.PassThrough.call(self);
    
    
    if (options)
      self.opts = utils.merge(default_options, options);
    else
      self.opts = default_options;
    
    
    try {
     self._engine = require('./engine/'+ self.opts.engine);
    }
    catch(e){
      console.log("Invalid engine name: "+e);
    }
   
  
   	// For piping
   	self.dest = null;

    self._source = self.opts.source || null;
    self._transformed = null;
    
    self.initStream();
   	
}


/*
* Initialize stream
*/
is.prototype.initStream = function(){
    var self = this;
    
    
    /*
    * If piped unpiped and process
    */
    self.on('pipe', function(source) {
      
      self._source = source
      
      self.preProcess();
     
    }); 
    
  
    /*
    * Call preProcess
    */
    if(self._source != null)
      self.preProcess();
    else
    {
      self._source = new stream.PassThrough()
    }
};

is.prototype._write = function(chunk, encoding, callback){
  callback();
}

/*
* Only send to process if source exist
*/
is.prototype.preProcess = function(){
    var self = this;
    
    if (!(self._source)) return;
     
    self.process(self._source);
};

/**
* Process image and pipe the result  and create event 'image' 
*
* @params {stream.PassThrough} source - incoming stream to be transformed
*/
is.prototype.process = function(source){
    var self = this;

  	var engine_ = new self._engine(source);
  	/**
  	 * Merge query to options
  	 */ 
  	var tocall = {};
  	
  	if (self.opts.query && self.opts.query.opt)
  	    tocall = utils.mergeRemove(self.opts,self.opts.query.opt);
  	
  	
  	for (var e in tocall){
    	if (typeof engine_[e] === 'function' ){
          engine_[e].apply(engine_, tocall[e]);
      }
      else
      {
          engine_['__callNative__'](e,tocall[e]);
      }
  	}
    
  	if (self.opts['quality'])
  	  engine_.quality(self.opts.quality)
  	
  	if (self.opts['setFormat'])
  		engine_.setFormat(self.opts.setFormat)

  	engine_.render(function(err, stdout, stderr){
  	    if (err){ self.emit('error', err);return}
  	    
  	    self._transformed = stdout;
        
	       if (self.dest){
          self.pipe(self.dest,self.dest_opts);
        }
	    	
	    self.emit('image', self._transformed);
	      
  	});
};

is.prototype.webp = function(source, done){
    var engine = new require('./engine/webp');

    if (self.opts['quality'])
       engine_.quality(self.opts.quality)

      engine_.render(function(err, stdout, stderr){

          done(stdout);
      }

}

/*
* Stream API implement pipe. If transformed stream exist we pipe it
* If it does not we keep the destination for later. This is because sometime 
* pipe is called before process and sometime after.
*/
is.prototype.pipe = function (dest, opts) {

    var self = this;
    
    if (self._transformed)
      self._transformed.pipe(dest, opts);
    else {
      self.dest = dest;
      self.dest_opts = opts;  
    }
    
    return dest;

};

	

module.exports = is;


