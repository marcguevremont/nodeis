
/**
 * Module dependencies.
 */

var utils = require('./utils');
var config = require('../etc/config');

var default_options = config.options;
/**
 * Constructor.
 *
 * @param {String|Number} path - path to img source or ReadableStream or width of img to create
 * @param {Number} [height] - optional filename of ReadableStream or height of img to create
 * @param {String} [color] - optional hex background color of created img
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

Imager.prototype.getEngine = function(){
    return this._engine;
}

Imager.prototype.setEngine = function(type){
     this._engine = config.engines[type] || null;
}

/**
* Render image 
*
* @params {stream} source - incoming stream to be transformed
*/
Imager.prototype.render = function(source, done){
    var self = this;
    
  	var engine_ = new self._engine(source);
  	
  	/**
  	 * Merge query to options
  	 */ 
  	var tocall = {};
  	
  	if (self.opts.query && self.opts.query.opt) {
  	    tocall = utils.mergeRemove(self.opts,self.opts.query.opt);
  	}
  	else { // Default width | height
  	    
  	      tocall['resizeTo'] = [self.opts.width,self.opts.height];
  	}
  	
  	for (var e in tocall){
    	if (typeof engine_[e] === 'function' ){
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


