

var http = require('http'),
	parse = require('url').parse,
	path = require('path'),
	join = path.join,
	fs = require('fs'),
	root = __dirname,
	port = process.env.port || 3000,
	defaultFileName = "/calculator.html",
	extensions = {
		".html":"text/html",
		".css":"text/css",
		".js":"application/javascript",
		".png":"image/png",
		".gif":"image/gif",
		".jpg":"image/jpeg"
	};

var server = http.createServer(function (req, res) {
	var url = parse(req.url),
		fileName = (url.pathname === "/") ? defaultFileName : url.pathname,
		ext = path.extname(fileName),
		pathFileName = join(root, fileName);

	fs.stat(pathFileName, function (err, stat) {
		if (err) {
			if ('ENOENT' === err.code) {
				res.statusCode = 404;
				res.end('Not Found');
			} else {
				res.statusCode = 500;
				res.end('Internal Server Error');
			}
		} else {
			res.setHeader('Content-Length', stat.size);
			var mimeType = extensions[ext];
			if (mimeType) {
				res.writeHead(200, { 'Content-Type':mimeType });

				var stream = fs.createReadStream(pathFileName);
				stream.pipe(res);
				stream.on('error', function (err) {
					res.statusCode = 500;
					res.end('Internal Server Error');
				});
			} else {
				res.statusCode = 404;
				res.end('Not Found');
			}
		}
	});
});
server.listen(port);

