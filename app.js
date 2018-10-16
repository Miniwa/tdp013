var express = require("express");
var storage = require("./storage");
var route = require("./route");
var cors = require("cors");

var storage = new storage.Storage("mongo", 27017, "tdp013");
var app = express();

var corsOptions = {
    origin: "http://localhost:8008",
}
app.use(cors(corsOptions));

app.route("/save")
    .all(route.createMessage);

app.route("/flag")
    .all(route.flagMessageRead);

app.route("/getall")
    .all(route.getMessages);

app.route("/clear")
    .all(route.clearMessages);

module.exports = app;
