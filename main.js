/* opens the default node server */

var express = require('express');
var app = express();

//echo server
app.all('/echo/:echo', 
	function (req, res, next) {
  		res.send(req.param('echo'));
		next();
	}
);

//POST and JSON styled POST input?
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
})); 

//php-cgi .deb processing with $_GET too, and also no file POST vars but not cookies
//-q option surpresses headers from php-cgi
var exec = require("child_process").exec;
var qs = require('qs');

app.all('/php/:script',
	function(req, res, next) {
		var query = qs.stringify(req.query , {delimiter: ' '});
		query += ' ' + qs.stringify(req.body , {delimiter: ' '});
		exec("php-cgi -q ./php/" + req.param('script') + ".php " + query,
			function (error, stdout, stderr) {
				res.send(stdout);
				console.log(stderr);
				next(); //here to complete ...
			}
		);
		//next(); <-- must not do as it prevents exec return doing a res.send()
	}
);

//a special to run the jsoftware.com j language .deb package rename ijconsole via exec
app.all('/j/:script',
	function(req, res, next) {
		var query = qs.stringify(req.query , {delimiter: ' '});
		query += ' ' + qs.stringify(req.body , {delimiter: ' '});
		exec("ijconsole -jprofile ./j/" + req.param('script') + ".j " + query,
			function (error, stdout, stderr) {
				res.send(stdout);
				console.log(stderr);
				next(); //here to complete ...
			}
		);
		//next(); <-- must not do as it prevents exec return doing a res.send()
	}
);

app.listen(3000);