$("#btn-publish").click(() => {
    clearError();
    var text = $("#input-text").val();
    if(text.length === 0) {
        showError("Message is too short.");
    } else if(text.length > 140) {
        showError("Message is too long.");
    } else {
        $("#input-text").val("");
        createMessage(text);
    }
});

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

function createMessage(text) {
    var message = $("<div>", {
        "class": "message-div unread col-7"
    });
    message.append($("<p>", {
        "text": text
    }));

    var formDiv = $("<div>", {
        "class": "form-check"
    });
    var checkBox = $("<input>", {
        "type": "checkbox",
        "class": "form-check-input",
    });

    checkBox.click(() => {
        var checked = checkBox.prop("checked");
        if (checked) {
            message.removeClass("unread");
        } else {
            message.addClass("unread");
        }
    });

    formDiv.append(checkBox);
    formDiv.append($("<label>", {
        "class": "form-check-label",
        "text": "Läst"
    }));
    message.append(formDiv);
    $("div.message-container").prepend(message);
}
