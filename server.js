var express = require("express");
var storage = require("./storage");
var route = require("./route");

var storage = new storage.Storage("mongo", 27017, "tdp013");
var app = express();

app.use(express.static("static"));

app.route("/save")
    .get(route.createMessage);

//var server = app.listen(8000, function() {
//    var host = server.address().address;
//    var port = server.address().port;
//    
//    console.log("Example app listening at http://%s:%s", host, port);
//});

module.exports = app;
