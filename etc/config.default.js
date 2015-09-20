

var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')



var config = {
	
	server : {
		port 	: process.env.IS_HTTP_PORT,
		baseurl : process.env.IS_HOST +":"+process.env.IS_HTTP_PORT
	},
	
   /**
	* Enable plugins
	*/
	engines : {
		//"gm" 	 : require("../lib/engine/gm"),
		//"webp"   : require("../lib/engine/webp"),
		//"opencv" : require("../lib/engine/opencv"),
		"sharp"	 : require("../lib/engine/sharp")
	},
	transports : {
		"file" : require("../lib/transport/file"),
		"http" : require("../lib/transport/http"),
		"s3"   : require("../lib/transport/s3")
	},
	options : {
		
		secure : false ,  // true, false	
		
		secret : "your secret key", // secret key
		
	
		/**
		 * Http reader settings
		 */ 
		req_timeout  : 20000,
		
		req_max_size : 10*1024*1024, //15mb

		max_age     : 3600 * 24, //one day
		
		/**
		 * Imager settings
		 */ 
		 
		engine	  : 'sharp',  //valid engine
		
		width     : 2000,  // max width
		
		height    : 2000,  // max height
		
		webp      : true,  // If header accept webp true | false 
		
		quality   : '80',  // 100 best
		
		setFormat : 'jpg', // convert all image to jpg by default gif | png | jpg
		
		face	  : false, //face recognition *not implemented 
		
		
		/**
		 * Store settings
		 */
		save 	   : true, //Per request: save file or just apply change and return it 
		
		saveUpload : false, //Auto save upload image on post 
	
		store      : {
		
			type   : 'file', //valid transport
			
			dir	   : '/is/storage', // Exisiting path
			
			
		
		},
			
	
		/*
		store : {
				type   : 's3', //valid transport
		
				"bucket" 	  : 'your-bucket',
				"aws_key"     : 'your-key',
    			"aws_secret"  : 'your-secret'
		},
			*/
		
		/**
		 * Cache settings
		 */
		
		cache	  : {
			
			type   : 'file', //valid transport

			ttl	   : "1d", // 1 day, 
			
			dir    : "/is/tmp", // Exisiting path
			
		}
		
	
	}
};

module.exports = config;