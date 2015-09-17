/**
 * Module dependencies.
 */
var Engine = require('./engine');
var util = require('util');
var CWebp = require('cwebp').CWebp;

function Webp(source){

    Engine.call(this);
    
    this._source = source;
    
    this._engine = new CWebp(source);
    
    this.support_webp = true;
}

util.inherits(Webp, Engine);

Webp.prototype.quality = function(pourcent){
	       
   this._engine.quality(pourcent);

   return this;
}

Webp.prototype.render = function(done){

    var stream  =  this._engine.stream();
    
    done(null, stream);
}

module.exports = Webp;