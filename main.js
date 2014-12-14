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

//php-cgi .deb processing with $_GET too, no POST vars or cookies
//-q option surpresses headers from php-cgi
var exec = require("child_process").exec;
var qs = require('querystring');

app.all('/php/:script',
	function(req, res, next) {
		var query = qs.stringify(req.query , ' ');
		exec("php-cgi -q " + req.param('script') + ".php " + query,
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