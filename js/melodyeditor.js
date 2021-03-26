var pianorollzoomX = 1;
var pianorollzoomY = 1;
var selectedmelody = 0;
var selectednote;
var noterange = 97;
var pr_rows = 24;
var scrolllevels = noterange - pr_rows;


var prrange;
var bottomnote = 40;


function showMelodyList(){

    $("#melodylist").html("");

    var addbutton = '<span class="material-icons">add_circle</span>';

    sessionmelodies.forEach((e,i)=>{

        $("#melodylist").append(melodyListItem(e,i));
    })

    $("#melodylist").append(addbutton);
}

function melodyListItem(element,index){

    var thisdiv = 
    '<div class="melodylistitem data-index="'+index+'">'+
    '<div class="melodyinfo"><h3>'+element.name+'</h3><h5>'+element.instrument+'</h5></div>'+
    
    '<div class="melodypreview" data-index="'+index+'"></div>'+

    '<div class="melodyactions">'+
    '<span class="material-icons play" data-index="'+index+'">play_arrow</span>'+
    '<span class="material-icons edit" data-index="'+index+'">edit</span>'+
    '<span class="material-icons remove" data-index="'+index+'">delete</span>'+
    
    '</div>'+
    '</div>';

    return thisdiv;
};

// ----------------------------------------------------------------
// DRAW PIANO ROLL
// ----------------------------------------------------------------


function drawPianoRoll(input){

    prrange = Math.floor(bottomnote/12)-1;

    for(var y = -1; y < pr_rows; y++){

        var x = y+bottomnote;

        var blackkey = false;

        if( (x%12==1||x%12==3||x%12==6||x%12==8||x%12==10)){
            blackkey = true;
        }
        if(y!=-1){
        $("#pianorollkeys").append('<div id="prkey'+(y)+'" class="prkey '+(blackkey?"prblack":"")+'">'+notes[x%12].split("/")[0] + Math.floor((x/12))+'</div>')
        $("#pianorollgrid").append('<div id="'+"prrow"+(y)+'" class="prrow '+(blackkey?"prblack":"")+'"></div>')
        }

        for(var z = 0; z < sessionlength*sessionsubdivision/2; z++){
           if(y==-1){
               $("#prheader").append('<div id="prtile'+(y)+'-'+(z)+'" class="prtile"></div>')
               }
           else{            
               $("#prrow"+(y)).append('<div id="prtile'+(y)+'-'+(z)+'" class="prtile"></div>')
           }
           if(z % (sessionsubdivision/2) == 0  && z!=0){
               $('#prtile'+(y)+'-'+z).css("border-left","solid 2px #1f554a")
           }
        } 
    }

    $("#prheader").width($("#prcont").width());
    $("#prscrollthumb").height(((pr_rows/98)*100)+"%").css("top",(((1-(bottomnote/98)))*$("#prscrollbar").height())-$("#prscrollthumb").height());

    sessionmelodies[selectedmelody].notes.forEach((e,i)=>{
        addNote(e,i);   
    });

}

// ----------------------------------------------------------------
// ADD NOTE
// ----------------------------------------------------------------


function addNote(notetoadd,noteindex){

    var i;
    (typeof noteindex == undefined)?(i=$(".note").toArray().length-1):(i = noteindex);

    var thisnote = Tone.Frequency(notetoadd.note).toMidi();

        if(thisnote >= bottomnote+12 && thisnote < bottomnote+36){
        $("#pianorollgrid").append('<div class="note" id="note'+i+'">'+notetoadd.note+'</div>');
        var thispos = pr_rows - ((Tone.Frequency(notetoadd.note).toMidi()+13)-(bottomnote)-pr_rows);
        $("#note"+i).css({
            top: thispos * $("#prrow0").height(),
            height: $("#prrow0").height()-1,
            width:  PRTimeToPixels(notetoadd.dur),
            left:   PRTimeToPixels(notetoadd.time)
        });
        $("#note"+i).draggable({
            grid:[1,$("#prrow0").height()],
            containment: "parent",
            drag: function( event, ui ) {
                var newnotemidi = Math.floor(($("#pianorollgrid").height()-(ui.position.top))/$("#prrow0").height())+bottomnote+12;
                console.log(Tone.Frequency(newnotemidi,"midi").toNote());
                sessionmelodies[selectedmelody].notes[selectednote].note = Tone.Frequency(newnotemidi,"midi").toNote();
                sessionmelodies[selectedmelody].notes[selectednote].time = (ui.position.left/($("#pianorollgrid").width())*Tone.Time("1m").toSeconds()*sessionlength);
                $(event.target).html(Tone.Frequency(newnotemidi,"midi").toNote());
                sessionmelodies[selectedmelody].instrument.triggerRelease();
            },
            stop: function( event, ui ) {
                //(event.target).css("top","");
                
            }
        });
        $("#note"+i).resizable({
            grid:[1,9999999],
            handles:"e",
            "disabled": true,
            stop: function( event, ui ) {
                sessionmelodies[selectedmelody].notes[selectednote].dur = (ui.size.width/ui.element.parent().width())*sessionlength*Tone.Time("1m").toSeconds();
                
            },
        });
        
    }

}



function updatePianoRoll(){   

    $("#prheader").width($("#prcont").width());

    prrange = Math.floor(bottomnote/12)-1;

    $(".prblack").removeClass("prblack");

    for(var y = -1; y < pr_rows; y++){

        var x = y+bottomnote;
        var blackkey = false;

        if((x%12==1||x%12==3||x%12==6||x%12==8||x%12==10)){
            blackkey = true;
        }

        if(y!=-1){
            $("#prkey"+(y)).addClass((blackkey?"prblack":"")).html(notes[x%12].split("/")[0] + Math.floor((x/12)));
            $("#prrow"+(y)).addClass((blackkey?"prblack":""));
        }

        //$('.prtile').css("border-left","1px solid rgb(43, 116, 101)");
        //for(var z = 0; z < sessionlength*sessionsubdivision/2; z++){
        //   if(z % (sessionsubdivision/2) == 0  && z!=0){
        //       $('#prtile'+(y)+'-'+z).css("border-left","solid 2px #1f554a")
        //   }
        //} 
    }
    
    $("#prscrollthumb").css("top",(((1-(bottomnote/98)))*$("#prscrollbar").height())-$("#prscrollthumb").height());
    $(".note").toArray().forEach((e,i)=>{
        var thispos = pr_rows - ((Tone.Frequency($(e).html()).toMidi()+13)-(bottomnote)-pr_rows);
        var thisnote = sessionmelodies[selectedmelody].notes[i];
        $(e).css({
            top: thispos * $("#prrow0").height(),
            height: $("#prrow0").height()-1,
            width:  PRTimeToPixels(thisnote.dur),
            left:   PRTimeToPixels(thisnote.time)
            
        });
    })
}

drawPianoRoll(12);




function PRTimeToPixels(input){

    return Tone.Time(input).toSeconds()/Tone.Time("1m").toSeconds()*$("#pianorollgrid").width()/sessionlength
}

$(document).on("mousedown",".note",(e)=>{

    if($(e.target).hasClass("note") && e.target.id.replace("note","") != selectednote){
        sessionmelodies[selectedmelody].instrument.triggerRelease();
        $("#note"+selectednote).removeClass("activenote").resizable( "option", "disabled", true );
        selectednote = e.target.id.replace("note","");
        $("#note"+selectednote).addClass("activenote").resizable( "option", "disabled", false );
        sessionmelodies[selectedmelody].instrument.triggerAttackRelease(sessionmelodies[selectedmelody].notes[selectednote].note,sessionmelodies[selectedmelody].notes[selectednote].dur);
    }
});

$(document).on("mousedown",".prkey",(e)=>{
    sessionmelodies[selectedmelody].instrument.triggerAttackRelease($(e.target).html(),"1m");

});

$(document).on("mouseup",".prkey",(e)=>{
    sessionmelodies[selectedmelody].instrument.triggerRelease($(e.target).html());

});

$("#pianorollgrid").on("mousewheel",(e)=>{

        if(e.originalEvent.deltaY < 0 && bottomnote < scrolllevels){
            bottomnote++;
        };
        if(e.originalEvent.deltaY > 0 && bottomnote > 0){
            bottomnote--;
        };
        updatePianoRoll();
            
});

$("#prscrollthumb").draggable({
    grid:[1,$("#prscrollbar").height()/scrolllevels],
    containment: "parent",
    drag: function( event, ui ) {
        bottomnote = scrolllevels-Math.floor((ui.position.top/($("#prscrollbar").height()-$("#prscrollthumb").height()))*scrolllevels);
        updatePianoRoll();
        
    },
    stop: function( event, ui ) {
        //(event.target).css("top","");
        
    }
});




