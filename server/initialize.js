/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 *
 *
 *  Middleware to initialise options with query parameter
 * 
 */
 
 /**
 * Module dependencies.
 */
var utils = require('../lib/utils') ;
var config = require('../etc/config');

module.exports = function(req, res, next){
  
  var query = req.query;
  
  /**
   * Check security 
   */
  if (config.options.secure) {
     
     var challenge_key = utils.generateKey(config.options.secret, query["src"], query['opt']);
    
     
     if (req.params['key'] !== challenge_key)   {
          res.writeHead(404, {'content-type': 'text/html'});
          // console.log(challenge_key)
          res.end();
          return ;
     }
  }
  
  
  // Transform string in object   
  query['_opt'] =  query['opt'];
  query['opt'] = utils.parseParam(query["opt"]);
  
  /**
   * Check webp 
   */
  var webp = false;

  if (config.options.webp == true){
      
      webp = (req.headers.accept.indexOf('webp') != -1);
      query['opt']['webp'] = [webp];
  }
  
  req.webp = webp;
  
  next();
}