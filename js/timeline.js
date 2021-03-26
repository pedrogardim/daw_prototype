
var tlrows = ["Drums","Chords","Bass","Melody"];

for(var x= 0; x < tlrows.length; x++){

    var tlch = '<div class="tlchannel" id="tlch'+x+'"></div>'
    $("#tlchannelscont").append(tlch);


}


$("#tlchannelscont").css({
    "top": (window.innerHeight / 2) - $("#tlchannelscont").height()/2,
})

