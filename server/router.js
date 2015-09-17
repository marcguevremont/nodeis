
var config        = require('../etc/config');
var express       = require('express')
var router        = express.Router()
var processer     = require('../lib/processer');
var initialize    = require('./initialize');
var utils         = require('../lib/utils');
//var Queue         = require('bull');

/**
* Parse incoming request and apply directive to do
* Get incoming request and return object option
* ex : http://example.com/unsecure/resize:200,200/corner
* ex: http://example.com/unsecure/rotate:green,-25/resize:250, 178/autoOrient


var imageQueue = Queue('image transcoding', 6379, '127.0.0.1');

imageQueue.process(function(job, done){

    // job.data contains the custom data passed when the job was created
    // job.jobId contains id of this job.
  
    // transcode video asynchronously and report progress
    //job.progress(42);
  
});

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

function checkSrc(req, res, next){
    var query = req.query;
    if (query.src)
     if (!query.src.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(.*)*\/?$/)){
        onepx_response(req, res);
     }
     else
        next();
}

function  onepx_response(req, res){
        setHeaderCacheControl(req,res);
    	res.writeHead(200, {'Content-Type': 'image/gif'}); 
		var PIXEL_B64  = "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
		res.end(new Buffer(PIXEL_B64, 'base64'), 'binary');
}

function createImageUrlfromRequest(req){
   
    
    var u = config.server.baseurl + '/image/'+ utils.generateKey(config.options.secret, req.query['src'], req.query['_opt']) + '/';
    
    u += "?src=" + req.query.src;
    
    if (req.query['_opt'])
        u += "&opt=" + req.query['_opt'];
    
    u += "&nocache=1";
    
    return u;
}

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

router.get('/image/:key', initialize, checkSrc,  function(req,res, next){
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

router.get('/onepx', function(req,res){
    
       onepx_response(req, res);
});

/*
router.get('/upload', function(req,res){
    res.writeHead(200, {'content-type': 'text/html'});
     res.end(
      '<form action="/image/jidjsdjasiudjasidjasiduad/?src='+encodeURIComponent('sadadasdsadadadadsadad/image')+'" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
});
*/

module.exports = router;