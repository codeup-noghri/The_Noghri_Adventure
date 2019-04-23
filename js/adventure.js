"use strict";


let storyElements={
    "Intro":{
        "text":"Hello! Welcome to my text adventure!",
        "options":{
            "Go away":["Intro","Denial"],
            "Hello!" :["Intro","Greeting"],
            "What"   :["Intro"]
        },
        "Denial":{
            "text":"Wow ok rood",
            "transition":{
                "time":2000,
                "location":["Ending"]
            }
        },
        "Greeting":{
            "text":"Glad you could make it...",
            "transition":{
                "time":2000,
                "location":["Chapter1"]
            }
        }
    },
    "Chapter1":{
        "text":"On a distant planet, far far away...",
        "options":{
            "Boring" :["Chapter1","Denial"],
            "Blow it up" :["Chapter1","Violence"],
            "Go to planet" :["Chapter1","GoTo"],
            "What"   :["Chapter1"]
        },
        "Denial":{
            "text":"Wow ok rood",
            "transition":{
                "time":2000,
                "location":["Ending"]
            }
        },
        "Violence":{
            "text":"*sigh*.... And everyone died.",
            "transition":{
                "time":2000,
                "location":["FastText"]
            }
        },
        "GoTo":{
            "text":"You appear on the planet, your mind is foggy",
            "transition":{
                "time":2000,
                "location":["Ending"]
            }
        }
    },
    "FastText":{
        "text": "This",
        "transition":{
            "time":100,
            "location":["FastText","Jump1"]
        },
        "Jump1":{
            "text": "is",
            "transition":{
                "time":100,
                "location":["FastText","Jump2"]
            }
        },
        "Jump2":{
            "text": "some",
            "transition":{
                "time":100,
                "location":["FastText","Jump3"]
            }
        },
        "Jump3":{
            "text": "Fast text!",
            "transition":{
                "time":2000,
                "location":["Ending"]
            }
        }
    },
    "Ending": {
        "text": "The End.",
        "options": {
            "Restart": ["Restart"]
        }
    }
};















let storyBox = $("#storybox");
let commandInput = $("#commandinput input");

commandInput.bind("keypress", {}, keypressInBox);


let curOptions={};



function scrollToBottom(e){
    storyBox.scrollTop(storyBox[0].scrollHeight);
}

function keypressInBox(e) {
    let code = (e.code ? e.code : e.which);
    if (code === 13) { //Enter keycode
        e.preventDefault();
        let command = commandInput.val();
        commandInput.val(commandInput.val().slice(0,64));
        storyBox.append("<p>"+commandInput.val()+"</p>");
        commandInput.val("");
        scrollToBottom();
        if (command in curOptions){
            processStory(curOptions[command]);
        }else{
            storyBox.append("<p>I don't understand!</p>");
        }
        scrollToBottom();
    }
}
let storyLocation;
function processStory(location){
    console.log(location);
    if (location[0] === "Restart"){
        console.log("Restart");
        storyBox.text("");
        processStory(["Intro"]);
        return false;
    }
    let relLoc="";
    location.forEach(function(element){
        relLoc +="['"+element+"']"
    });
    storyLocation = eval("storyElements"+relLoc);
    console.log(storyLocation);
    let storyBuffer="";
    if("text" in storyLocation) {
        storyBuffer = "<p>" + storyLocation["text"];
    }
    if("options" in storyLocation) {
        storyBuffer+="<br><ul>";
        Object.keys(storyLocation["options"]).forEach(function (element) {
            storyBuffer += "<li>" + element + "</li>";
            curOptions[element] = storyLocation["options"][element]
        });
        storyBuffer+="</ul>";
    }
    if("transition" in storyLocation) {

        setTimeout(function(){processStory(storyLocation["transition"]["location"])},storyLocation["transition"]["time"])
    }
    storyBuffer+='</p>';
    console.log(storyBuffer);
    storyBox.append(storyBuffer);
    scrollToBottom();

}


$(document).ready(function() {
    processStory(["Intro"]);
});