# Nodeis 
###### Prononce (nōdĭ′iss)
Nodeis is for Node Image Service.  It enables on-demand crop, resizing and flipping of images.
It is inspired by Thumbor but it is not a direct port from python to nodejs. 
Using nodeis is very easy. All you have to do is access it using an URL for an image, like this:

```
http://localhost:8080/fetch/optional-secure-key/?src=http://any-image-url.jpg&opt=resizeTo:255,112;
```

###### Features
 - Auto detect webp.
 - Save original image to filesystem || S3 || Create your own storage.
 - You can fetch || upload images.
 - Build with pluggins. You can create your own easily
 
### Version
0.0.3

### Installation
Via npm :
```sh
npm install nodeis
```
Git :
```sh
git clone https://github.com/marcguevremont/nodeis.git
cd nodeis
```
###### Run
```sh
cd node_modules/nodeis
cp etc/config.default.js etc/config.js
IS_HTTP_PORT=8080 IS_HOST=http://localhost npm start
```

Docker : 
```sh
docker run -p 8080 -d --name='nodeis' webs7/nodeis
```



### Requirement
By default nodeis use vips image library. 
See [https://github.com/lovell/sharp](https://github.com/lovell/sharp) for detail. 
You can also use graphic magic if you want. 

### Config
The configuration file is located in etc/config.default.js. Copy it and rename it config.js. 

Config example :

```
var config = {
	
	server : {
		port 	: 8080,
		baseurl : http://localhost:8080
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
		 * Http  settings
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
		
		saveUpload : false, //Save upload directly or save temp file and wait for transformation. This is to enable croping in browser like facebook profile picture.
	
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
```

### Plugins
Implement you own and enable it in config.js
See lib/engine or lib/transport for working examples

### Todo's
 - Add ttl to cache. 
 - Create doc
 - Create tests
 - Add face detection via opencv

### Contribute
If you want to contribute your are welcome.

License
---

MIT