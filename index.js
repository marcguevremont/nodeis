
/**
 * Module dependencies.
 */
var EventEmitter = require('events').EventEmitter;
var utils = require('./lib/utils');
var util = require('util');
var config = require('./etc/config');

util.inherits(is, EventEmitter);

var default_options = config.options;

/**
 * Constructor.
 *
 * @param {String|Number} path - path to img source or ReadableStream or width of img to create
 * @param {Number} [height] - optional filename of ReadableStream or height of img to create
 * @param {String} [color] - optional hex background color of created img
 */

function is (options) {
  
  if (this instanceof is) {
      
    var self = this;

    EventEmitter.call(this);


    if (options)
      self.opts = utils.merge(default_options, options);
    else
      self.opts = default_options;

    //Inject this instance to sub object
    //var plugins = plugins;

    
    /*
    * Inject this to plugins
    */
     for (var p in plugins){
        if (plugins[p].prototype)
            plugins[p].prototype._is = self;
     }
  }
  else {
    throw new Error("Please use new contructor with is");
  }
  
};

var plugins = [];

var plug = function(plugin){
  if (typeof plugin === "function"){
    var p = plugin(is);
    if (p) plugins.push(p);
  }
  else
    throw new Error("Plugin must be a function");
};

/**
 * Augment the prototype with plugins
 */
for (var p in config.plugins)
  plug(config.plugins[p]);

/**
 * Expose.
 */
module.exports = exports = is;
module.exports.utils = utils;
module.exports.plug = plug;


