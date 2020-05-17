const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const path = require("path");

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

// Starting both http and https server
const httpServer = http.createServer(app);
const httpsServer = https.createServer(creds, app);

httpServer.listen(80, () => {
	console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
	console.log("HTTPS Server running on port 443");
});
