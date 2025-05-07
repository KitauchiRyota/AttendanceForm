function onSubmit(e) {;

    username = "フォーム回答通知Bot";
    icon_emoji = ":ghost:";
    var linkText = "フォーム";
    var linkUrl = "https://docs.google.com/spreadsheets/d/1SampleURL1234567890abcdefg/edit#gid=0";
    var webhookUrl = "https://hooks.slack.com/services/XXXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX";
    
    var formResponses = e.response.getItemResponses();
    var message = "<" + linkUrl + "|" + linkText + ">に回答がありました\n\n";
    
    formResponses.forEach(function(itemResponse) {
        message += itemResponse.getItem().getTitle() + " : " + itemResponse.getResponse() + "\n";
    });
    
    var payload = JSON.stringify({ "text": message,"username": username,"icon_emoji": icon_emoji });
    var options = {
        method: "post",
        contentType: "application/json",
        payload: payload
    };
    
    UrlFetchApp.fetch(webhookUrl, options);
    }