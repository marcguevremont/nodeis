/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Webp - Engine using the webp image library. Used when native libary not support webp
 */

/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var CWebp = require('cwebp').CWebp;


/**
 * Constructor
 * @param {stream} source - stream image
 */
function Webp(source){

    Engine.call(this);
    
    this._source = source;
    
    this._engine = new CWebp(source);
    
    this.support_webp = true;
}

util.inherits(Webp, Engine);
/**
* resizeTo - Resize image
* @param {number} with 
* @param {number} height 
*/
Webp.prototype.resizeTo = function(width, height){
    return this;
} 
/**
* quality 
* @param {number} pourcent 
*/
Webp.prototype.quality = function(pourcent){
	       
   this._engine.quality(pourcent);

   return this;
}
/**
* setFormat
* @param {string} format 
*/
Webp.prototype.setFormat = function(){
    return this;
}
/**
* render
* @param {function} done 
*/
Webp.prototype.render = function(done){

    var stream  =  this._engine.stream();
    
    done(null, stream);
}

module.exports = Webp;