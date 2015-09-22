/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Imager - Call engine to make transformation
 */
 
/**
 * Module dependencies.
 */

var utils = require('./utils');
var config = require('../etc/config');

var default_options = config.options;

/**
 * Constructor.
 *
 * @param {Object} options - Instance settings
 */
 
function Imager(options) {
    

  	var self = this;

    if (options)
      self.opts = utils.merge(default_options, options);
    else
      self.opts = default_options;
    
    
    self._engine = null;
    
    self.setEngine(self.opts.engine);
      
    self.support_webp =  false;
      
}

/**
 * Get engine
 * @return {string} engine
 */
Imager.prototype.getEngine = function(){
    return this._engine;
}

/**
 * Set engine
 * @params {string} type - engine.
 */
Imager.prototype.setEngine = function(type){
     this._engine = config.engines[type] || null;
}

/**
* Render image 
* @param {stream} source - Incoming stream of image to be transformed
* @return {function} done - error or stream of transformed image
*/
Imager.prototype.render = function(source, done){
    var self = this;
    
  	var engine_ = new self._engine(source);
  	
  	/**
  	 * Merge query to options
  	 * If not query options are passed, render default otions
  	 */ 
  	var tocall = {};
  	
  	if (self.opts.query && self.opts.query.opt) {
  	    tocall = utils.mergeRemove(self.opts,self.opts.query.opt);
  	}
  	else { // Default width | height
  	    
  	      tocall['resizeTo'] = [self.opts.width,self.opts.height];
  	}
  	
  //	Try to call  methods from the engine or call native function.
  	for (var e in tocall){
    	if (typeof engine_[e] === 'function'){
          engine_[e].apply(engine_, tocall[e]);
      }
      else
      {
          engine_['__callNative__'](e,tocall[e]);
      }
  	}
    
  	if (self.opts['quality'] && (typeof engine_['quality'] === 'function'))
  	  engine_.quality(self.opts.quality)
  	
  	if (self.opts['setFormat'] && (typeof engine_['setFormat'] === 'function')){
  	  
  		  engine_.setFormat(self.opts.setFormat)
  	}

  	engine_.render(function(err, stdout){
  	   
         return done(err, stdout);
  	});
};
/**
* Render webp
* Try to use current engine if it support webp or use the webp engine
* @param {stream} source - Incoming stream of image to be transformed
* @return {function} done - error or stream of transformed image
*/
Imager.prototype.webp = function(source, done){
  var self = this;
  
  var engine_ = new self._engine(source);
  	
  self._engine.support_webp = engine_.support_webp;
  
  if ((typeof engine_['setFormat'] === 'function') &&  engine_.support_webp){
    engine_.setFormat('webp')
  }
  else
  {
    self.setEngine('webp');
    engine_ = new self._engine(source);
  }
  
  engine_.render(function(err, stdout){
  	   
      return done(err, stdout);
  });
  	     
}



module.exports = Imager;


