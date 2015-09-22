/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Gm - Engine using the graphick magic image library
 */


/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var gm  = require('gm');

/**
 * Constructor
 * @param {stream} source - stream image
 */
function Gm(source){

    Engine.call(this);
    
    this._source = source;
    
    this._engine = gm(source);
    
}

util.inherits(Gm, Engine);

/**
* resizeTo - Resize 
* @param {number} with 
* @param {number} height 
*/
Gm.prototype.resizeTo = function(width, height){
    
     if (!width || !height)  return this;
   
     this._engine.noProfile();
    
     this._engine.thumbnail(width +'>',height + '>');
    
    return this;
}
/**
* cropTo - Crop image
* @param {number} with 
* @param {number} height 
*/
Gm.prototype.cropTo = function(width, height){
   
     if (!width || !height)  return this;
   
    this._engine.noProfile();
    this._engine.gravity('center');
    this._engine.extent(width, height + '>');
    this._engine.thumbnail(width, height + '>');
    
    return this;
}
/**
* quality 
* @param {number} pourcent 
*/
Gm.prototype.quality = function(pourcent){
   
    this._engine.quality(pourcent);
    
    return this; 
}
/**
* setFormat
* @param {string} format 
*/
Gm.prototype.setFormat = function(format){
    
    this._engine.setFormat(format);
    return this; 
} 
/**
* render
* @param {function} done 
*/
Gm.prototype.render = function(done){
   var self = this;
   self._engine.stream(function (err, stdout, stderr) {
       
        done(err, stdout, stderr);
    });
}



module.exports = Gm;