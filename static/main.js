// Get messages from server
getAndInsertMessages();

// Setup button listeners
$("#btn-publish").click(() => {
    clearError();
    var text = $("#input-text").val();
    if(text.length === 0) {
        showError("Message is too short.");
    } else if(text.length > 140) {
        showError("Message is too long.");
    } else {
        $("#input-text").val("");
        saveMessage(text).then(() => {
            $("div.message-container").empty();
            getAndInsertMessages();
        }).catch(() => {
            showError("Could not publish message.");
        });
    }
});

function getAndInsertMessages() {
    // Get messages from server
    getMessages().then((messages) => {
        $.each(messages, function(i, message) {
            insertMessage(message);
        });
    }).catch(() => {
        showError("Could not retrieve messages.");
    });
}

// API
function getMessages() {
    return $.get({
        url: "http://localhost:8000/getall"
    });
}

function saveMessage(text) {
    return $.get({
        url: "http://localhost:8000/save",
        data: {
            "message": text,
        }
    });
}

function markMessageUnread(id) {
    return $.get({
        url: "http://localhost:8000/flag",
        data: {
            "id": id
        }
    });
}

// DOM stuff.
function insertMessage(message) {
    var dom = buildMessageDom(message.message, message.flag);
    dom.data("id", message._id);
    $("div.message-container").append(dom);
}

function buildMessageDom(text, unread) {
    let messageCss = "message-div col-7";
    if(unread) {
        messageCss += " unread";
    }
    var message = $("<div>", {
        "class": messageCss
    });
    message.append($("<p>", {
        "text": text
    }));

    var formDiv = $("<div>", {
        "class": "form-check"
    });

    let checkBoxAttr = {
        "type": "checkbox",
        "class": "form-check-input",
    }
    if(!unread) {
        checkBoxAttr["disabled"] = true;
        checkBoxAttr["checked"] = true;
    }
    var checkBox = $("<input>", checkBoxAttr);

    checkBox.click(() => {
        var checked = checkBox.prop("checked");
        if (checked) {
            markMessageUnread(message.data("id")).then(() => {
                message.removeClass("unread");
                checkBox.attr("disabled", true);
                checkBox.attr("checked", true);
            });
        }
    });

    formDiv.append(checkBox);
    formDiv.append($("<label>", {
        "class": "form-check-label",
        "text": "Läst"
    }));
    message.append(formDiv);
    return message;
}

function showError(text) {
    clearError();
    var message = $("<span>", {
        class: "error",
        text: text
    });
    $(".error-container").append(message);
}

function clearError() {
    $(".error").remove();
}
