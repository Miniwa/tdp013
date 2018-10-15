let app = require("./server");

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let server = app.listen(8000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});

function shutDown() {
    console.log("Shutting down gracefully");
    process.exit(0);
}
