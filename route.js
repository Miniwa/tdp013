var storage = require("./storage");
var backend = new storage.Storage("localhost", 27017, "tdp013");

function createMessage(req, res) {
    if(req.method !== "GET") {
        res.status(405).end();
        return;
    }

    let message = req.query.message;
    if(message == null || message == undefined || message.length == 0 ||
        message.length > 140) {
        res.status(400).end();
        return;
    }
    
    backend.createMessage({message: req.query.message}).then((id) => {
        res.end();
    }).catch((err) => {
        res.status(500).end();
    });
}

function flagMessageRead(req, res) {
    if(req.method !== "GET") {
        res.status(405).end();
        return;
    }

    let id = req.query.id;
    if(id == null || id == undefined || id.length == 0) {
        res.status(400).end();
        return;
    }

    backend.setMessageRead(id).then(() => {
        res.end();
    }).catch((err) => {
        res.status(500).end();
    });
}

function getMessages(req, res) {
    if(req.method !== "GET") {
        res.status(405).end();
        return;
    }

    backend.getMessages().then((messages) => {
        res.json(messages).end();
    }).catch((err) => {
        res.status(500).end();
    });
}

function clearMessages(req, res) {
    if(req.method !== "GET") {
        res.status(405).end();
        return;
    }

    backend.connect().then((db) => {
        db.collection("messages").deleteMany({}, (err) => {
            if(err != null) {
                res.status(500).end();
            } else {
                res.end();
            }
        });
    }).catch((err) => {
        res.status(500).end();
    });
}

module.exports = {createMessage, flagMessageRead, getMessages, clearMessages, backend};
