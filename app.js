var is = require('./lib/is');
var fs = require('fs');
var path = require('path');
var rootPath = path.normalize(__dirname + '../');

//is.plug(require('./redis-plugin'));


// This opens up the writeable stream to `output`

//var writeStream2 = fs.createWriteStream('./output2.jpg');
//var writeStream3 = fs.createWriteStream('./output3.jpg');

// This pipes the POST data to the file


//var read = new is.reader();
	
//_is.reader('url', 'http://connection.so/img/picture.jpg')

 
 
/* 

 var _is = new Is();
 _is.reader('file', './test/imgs/i1.jpg')
 .pipe(_is.imager())
 .pipe(_is.storer('file', './output.jpg'));
*/ 
 
/*

V2 
*/
(function(){
	
	var _is =  new is();
	
	var readStream = fs.createReadStream('./test/imgs/i2.jpg');
	var writeStream  = fs.createWriteStream('./output2.jpg');
	
	_is.on('image', function(stream){
		console.log('trigger image')
		stream.pipe(writeStream);
		//stream.pipe(is..pipe(writeStream);
		
		_is = null
	});
	
	_is.on('error', function(err){
		console.log(err)
	})
	
	readStream.pipe(writeStream);
	
	

})();

