//NAV ================================================

//appMode
//1 = Circles
//2 = Drum Studio
//3 = Chord

var appMode = 1;
var pages = ["circlescont","drumpage","chordeditor","melodyeditor"];
var optionsMenu = false;

function navTo(page){
    $(".page").removeClass("visible").addClass("hidden");
    $("#"+pages[page-1]).removeClass("hidden").addClass("visible");
    appMode = page;
    $(".tabitem").removeClass("selectednavitem");
    $(".tabitem[data-nav="+page+"]").addClass("selectednavitem");
    if(page == 1){
        $("#circlescont").removeClass("circle-comp");
    }
    if(page != 1){
        $("#circlescont").addClass("circle-comp");

    }

}

$(".tabitem").click(function (e) { 
    navTo($(this).data("nav"));
    
});

$("#chordcircle").click(function (e) { 
    navTo(3)
});

$("#rhythmcircle").click(function (e) { 
    navTo(2)
});



$("#openedit").click(function (e) { 
    if(optionsMenu == false){
        $("#optionscolumn").css("right",0);
        optionsMenu = true;
        return;
    }
    if(optionsMenu == true){
        $("#optionscolumn").css("right",-($("#optionscolumn").width()+20));
        optionsMenu = false;
        return;

    }
});


