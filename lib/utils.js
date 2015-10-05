/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 * 
 *
 * Utils - Helper functions
 */
 
/**
 * Module dependencies.
 */
var crypto = require('crypto');
var crc = require('crc');
var clone = require('clone');

exports.merge  = function(o1, o2) {
  if (o1 == null || o2 == null)
    return o1;
    
  // prevent adding shit to original object
  var o = exports.clone(o1)  ;
    

  for (var key in o2)
  	if (o2.hasOwnProperty(key))
      o[key] = o2[key];

  return o;
};

exports.clone = function(o){
  
  return clone(o);
};

exports.getFilenameBySrc = function(src, format, opt){
 var s = null;
  
  s = exports.md5(src);
  
  if (opt)
    s += '.' + exports.crc32(opt.join(''));
  
  return s + "." + format;
};

exports.mergeRemove = function(o1, o2){
  if (o1 == null || o2 == null)
    return o2;
  var o3 = {};
  for (var key in o2){
  	if (o1.hasOwnProperty(key)){
  	  if (o2[key] instanceof Array){
  	    if (o1[key] != o2[key][0])
          o1[key] = o2[key][0];
  	  }
  	}
  	else
  	{
  	  o3[key] = o2[key];
  	}
  }
  return o3;
};

exports.md5 = function(str){
    return crypto.createHash('md5').update(str).digest('hex');
};


exports.crc32 = function(str){
  return crc.crc32(str).toString(16);
};


exports.escape = function(arg) {
  return '"' + String(arg).trim().replace(/"/g, '\\"') + '"';
};

exports.randomKey = function(length) {
  var l = length || 128;
  
  return crypto.randomBytes(l).toString('base64');
  
};

exports.generateKey = function(secret, src, opt){
  
  if (!src) return null;
  
  var _src = src.trim();
  
  var _opt = opt || "";
  _opt = _opt.trim();
  
  return  exports.md5(secret + _src + _opt);

};

exports.unescape = function(arg) {
    return String(arg).trim().replace(/"/g, "");
};

exports.argsToArray = function (args) {
  var arr = [];

  for (var i = 0; i <= arguments.length; i++) {
    if ('undefined' != typeof arguments[i])
      arr.push(arguments[i]);
  }

  return arr;

};

/** 
 * Helper to parse parameter in the form of Css
 * Ex crop:12,23,43,54;color:yellow
 */

exports.parseParam = function(str){
    if (!str) return [];
    
   // var param_arr = [];
    var keys = str.split(';');
    var obj = {};
    
    for (var key in keys){
      var ks = keys[key].split(':');
      
      if (ks.length){
       
        var k = ks[0] || null;
        var v = ks[1] || null;
        if (k && v && (typeof v == "string"))
          obj[k] = v.split(',');
        else if (k)
          obj[k] = [];
          
      }
    }
    
    return obj;
};

/**
 * Get specific param by name
 */
 
exports.getParam = function(array, name){
    if (array instanceof Array){
      for (var a in array){
        if (array[a] instanceof Object)
          if (array[a][name])
            return array[a][name];
      }
    }
    return null;
}


// Helper to return constructor with unlimited arguments
exports.construct = function (constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;

    return new F(); 
};




exports._instance = {};