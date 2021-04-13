//NAV ================================================

//appMode
//1 = Circles
//2 = Drum Studio
//3 = Chord

var appMode = 1;
var pages = ["homepage","drumpage","chordeditor","melodyeditor","mixpage"];
var optionsMenu = false;

function navTo(page){

    if(page == 4 || page == 5){
        return;
    }
    
    $(".page").removeClass("visible").addClass("hidden");
    $("#"+pages[page-1]).removeClass("hidden").addClass("visible");
    appMode = page;
    $(".tabitem").removeClass("selectednavitem");
    $(".tabitem[data-nav="+page+"]").addClass("selectednavitem");


    if(page == 5){
        $("#circlescont").addClass("hidden");
    }
    else{
        $("#circlescont").removeClass("hidden");

    }
    if(page == 1){
        $("#circlescont").removeClass("circle-comp");
    }
    else{
        $("#circlescont").addClass("circle-comp");

    }
    if(page == 2){
        $("#drumseqpage").removeClass("hidden");
        
    }
    

}

$(".tabitem").click(function (e) { 
    if($(this).attr("id") == "sessionsettings"){return};
    navTo($(this).data("nav"));
});

$("#chordcircle").click(function (e) { 
    navTo(3)
});

$("#rhythmcircle").click(function (e) { 
    navTo(2)
});



