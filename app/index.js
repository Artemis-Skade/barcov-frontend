const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const path = require("path");
//const unless = require("express-unless");

const app = express();

// Certificate
const privateKey = fs.readFileSync("./certs/privkey.pem", "utf8");
const certificate = fs.readFileSync("./certs/fullchain.pem", "utf8");
const ca = fs.readFileSync("./certs/fullchain.pem", "utf8");

const creds = {
	key: privateKey,
	cert: certificate,
	ca: ca
}

var htmlPath = path.join(__dirname, 'build');
app.use(express.static(htmlPath));

app.get('/infofile', function(req, res) {
	var data = fs.readFileSync(__dirname + '/build-homepage/infofile.pdf');
	res.contentType("application/pdf");
	res.send(data);
});

app.get('/*', function(req, res) {
	fs.readFile(__dirname + '/build/index.html', 'utf8', (err, text) => {
        	res.send(text);
	});
});


// Starting both http and https server
const httpServer = http.createServer(app);
const httpsServer = https.createServer(creds, app);

httpServer.listen(80, () => {
	console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
	console.log("HTTPS Server running on port 443");
});
