
/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var sharp = require('sharp');


function Sharp(source){

    var self = this;

    Engine.call(this);
    
    self._source = source;
    
    self._engine = sharp();
    
    self.support_webp = true;
    
}

util.inherits(Sharp, Engine);


Sharp.prototype.resizeTo = function(width, height){
    var w = parseInt(width) || null;
    var h = parseInt(height) || null;
    this._engine.withoutEnlargement();
    this._engine.max(w,h);
    this._engine.resize(w, h);
}

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
}

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