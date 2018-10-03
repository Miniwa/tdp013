var storage = require("./storage");
var backend = new storage.Storage("localhost", 27017, "tdp013");

function createMessage(req, res) {
    backend.createMessage({message: req.query.message}).then((id) => {
        res.json({id: id});
    });
}

module.exports = {createMessage, backend};