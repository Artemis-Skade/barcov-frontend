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

var router = express.Router();
app.use("/", router);

var htmlPathHomepage = path.join(__dirname, '../homepage/build');
app.use(express.static(htmlPathHomepage));

var htmlPath = path.join(__dirname, 'build');
app.use(express.static(htmlPath));


router.get('/', function(req, res) {
	console.log("Send homepage");
	fs.readFile(__dirname + '/../homepage/build/index.html', 'utf8', (err, text) => {
		res.send(text);
	});
});

app.get('/infofile', function(req, res) {
	var data = fs.readFileSync(__dirname + '/build-homepage/infofile.pdf');
	res.contentType("application/pdf");
	res.send(data);
});

app.get('/*', function(req, res) {
	console.log(req.originalUrl);
	if (req.originalUrl === "/") {
		res.send("Test");
	} else if (["/unternehmen", "/gaeste", "/team"].includes(req.originalUrl)) {
		console.log("Send homepage");
		fs.readFile(__dirname + '/../homepage/build/index.html', 'utf8', (err, text) => {
			res.send(text);
		});
	} else {
		fs.readFile(__dirname + '/build/index.html', 'utf8', (err, text) => {
        	res.send(text);
		});
	}
});


// Starting both http and https server
const httpServer = http.createServer(app);
const httpsServer = https.createServer(creds, app);

httpServer.listen(8000, () => {
	console.log("HTTP Server running on port 80");
});

httpsServer.listen(8001, () => {
	console.log("HTTPS Server running on port 443");
});
