/*!
 * nodeis
 * https://github.com/marcguevremont/nodeis
 *
 * Copyright 2015 Marc Guevremont
 * Released under the MIT license
 *
 *
 *  Router - Handle all requests an process it
 * 
 */
 
/**
 * Module dependencies.
 */ 
var config        = require('../etc/config');
var express       = require('express')
var router        = express.Router()
var processer     = require('../lib/processer');
var initialize    = require('./initialize');
var utils         = require('../lib/utils');

/**
 * setHeaderCacheControl
 * Set cache control in header
 * @param {Object} req 
 * @param {Object} res 
 */
function setHeaderCacheControl(req, res){
    
     if (req.query['nocache']){
      res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
     }
     else if (!res.getHeader('Cache-Control') || !res.getHeader('Expires')) {
         res.setHeader('Cache-Control', 'max-age=' + config.options.max_age);
         res.setHeader("Expires", new Date(Date.now() + (config.options.max_age * 1000)).toUTCString());  // in ms.
     }
}

/**
 * checkSrc
 * Validate url
 * @param {Object} req 
 * @param {Object} res 
 */
function checkSrc(req, res, next){
    var query = req.query;
    if (query.src)
     if (!query.src.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(.*)*\/?$/)){
        onepx_response(req, res);
     }
     else
        next();
}

/**
 * Return one pixel image
 * @param {Object} req 
 * @param {Object} res 
 */
function  onepx_response(req, res){
        setHeaderCacheControl(req,res);
    	res.writeHead(200, {'Content-Type': 'image/gif'}); 
		var PIXEL_B64  = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
		res.end(new Buffer(PIXEL_B64, 'base64'), 'binary');
}

/**
 * Return the image url from an uploaded image
 * @param {Object} req 
 */
function createImageUrlfromRequest(req){
   
    var u = config.server.baseurl + '/image/'+ utils.generateKey(config.options.secret, req.query['src'], req.query['_opt']) + '/';
    
    u += "?src=" + req.query.src;
    
    if (req.query['_opt'])
        u += "&opt=" + req.query['_opt'];
    
    u += "&nocache=1";
    
    return u;
}

/**
 * Upload image handler
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
router.post('/image/:key', initialize, function(req,res, next){
     req._method_ = 'image';
     
     new processer(req, res, function(err,img){
         if (err) return next(err);
         
         if (req.query['json'] == 1){
             
            var onEnd = function(){
                
                var imgUrl = createImageUrlfromRequest(req);
                
                res.status(200).jsonp({"files": [
                {
                    "name" : req.query['src'],
                    "url"  : imgUrl,
                    "deleteUrl" : imgUrl,
                    "deleteType": "DELETE"
                }
                ]});
            }
           
           
            img.on('end', function(){
                onEnd();
            });
            
            img.on('finish',function(){
                onEnd();
            });
         }
         else
         {
          // show the image
          setHeaderCacheControl(req,res);
          img.pipe(res);
         }
     });
      
});

/**
 * Get image handler
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
router.get('/image/:key', initialize, checkSrc,  function(req, res, next){
     req._method_ = 'image';
     
     new processer(req, res, function(err,img){
         if (err) return next(err);
         
         // Show the image
        
        setHeaderCacheControl(req,res);
         
         if (req.format)
            res.writeHead(200, {'Content-Type': 'image/'+ req.format });
            
         img.pipe(res);
      });
});

router.delete('/image/:key', initialize, function(req,res){

});
/**
 * Fetch image handler
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
router.get('/fetch/:key', initialize, checkSrc, function(req, res, next){

  req._method_ = 'fetch';
  
  new processer(req, res, function(err, img){
      
        if (err){
         // done(err);
          return next(err);
        } 
        //show the image
       
        
         // Show the image
        
        setHeaderCacheControl(req,res);
         
         if (req.format)
            res.writeHead(200, {'Content-Type': 'image/'+ req.format });
            
        img.pipe(res);
        
    });


});

/**
 * Create a snapshot of a website
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} next
 *
**/
router.get('/webshot/:key',initialize, checkSrc, function(req,res, next){
     
     req._method_ = 'webshot';
     
     new processer(req, res, function(err, img){
      
        if (err){
         // done(err);
          return next(err);
        } 
        
        
         // Show the image
        
        setHeaderCacheControl(req,res);
         
         if (req.format)
            res.writeHead(200, {'Content-Type': 'image/'+ req.format });
            
        img.pipe(res);
        
    });
     
     
});

/**
 * One pixel handler
 * @param {Object} req 
 * @param {Object} res 
 */
router.get('/onepx', function(req,res){
    
       onepx_response(req, res);
});


module.exports = router;