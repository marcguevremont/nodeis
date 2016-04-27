/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Sharp - Engine using the vips image library
 */
 
/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var sharp = require('sharp');

/**
 * Constructor
 * @param {stream} source - stream image
 */
function Sharp(source){

    var self = this;

    Engine.call(this);
    
    self._source = source;
    
    self._engine = sharp();
    
    self.support_webp = true;
    
}

util.inherits(Sharp, Engine);

/**
* resizeTo - Resize image
* @param {number} with 
* @param {number} height 
*/
Sharp.prototype.resizeTo = function(width, height){
    var w = parseInt(width) || null;
    var h = parseInt(height) || null;
     if (w == 0) w = null;
     if (h == 0) h = null;
    this._engine.withoutEnlargement();
    this._engine.max(w,h);
    this._engine.resize(w, h);
    
    return this;
}

Sharp.prototype.cropTo = function(width,height){
     var w = parseInt(width) || null;
     var h = parseInt(height) || null;
     if (w == 0) w = null;
     if (h == 0) h = null;
     this._engine.withoutEnlargement();
     this._engine.resize(w, h);
     this._engine.crop(sharp.gravity.north);
     return this;
}

/**
* quality 
* @param {number} pourcent 
*/
Sharp.prototype.quality = function(pourcent){
   
    this._engine.quality(pourcent);
    
    return this; 
}
/**
* setFormat
* @param {string} format 
*/
Sharp.prototype.setFormat = function(format){
    
    switch (format){
        case 'jpg' :
        case 'jpeg':
            this._engine.jpeg();
            break;
        case 'png':
            this._engine.png();
            break;
        case 'webp':
            this._engine.webp();
            break;
        case 'raw':
            this._engine.raw();
            break;
        default :
            break;
    }
    
    return this;
}
/**
* render
* @param {function} done 
*/
Sharp.prototype.render = function(done){
    var self = this;  
    
    self._source.pipe(self._engine);
    
    self._engine.on('error', function(err){
        done(err);
    });
    
    
    return done(null,self._engine);
  /*  
    self._engine.toBuffer(function(err, outputBuffer) {
        if (err) {
         return done(err);
        }
        
       // console.log("image:"+ outputBuffer)
        
        return(null, outputBuffer);
        // outputBuffer contains WebP image data of a 200 pixels wide and 300 pixels high
        // containing a scaled version, embedded on a transparent canvas, of input.gif
        
    });
  */
}

module.exports = Sharp;