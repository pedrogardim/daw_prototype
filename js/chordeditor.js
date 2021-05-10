var scalechords = [];
var chordcomplexity = 3;

var selectedscale = 0;
var chordsroot = 0;
var isPlayingChord = false;

var changingnamechord, hoveredchord, hoveredside, isChordHovered;
var selectedchord = null;

//avoit mouseout of button release clicked selected chord
var lastPlayedOnButton = false;

//to select which note was added/removed
var oldpianoselection;

var maxchordspermeasure = 4;

var clickedtile = null;
var clickedtiletype = null;





function selectChord(chord){

    stopPlayback();
    playbackMeasure = sessionchords[chord][2]-1;

    rhythminstrument.releaseAll();


    if(selectedchord == chord){
        unselectChord();

    }
    else{
        unselectChord();
        selectedchord = chord;
        playChord();
        $('#chordpiano').klavier('setSelectedValues', noteArraytoMidi(sessionchords[chord][0]));
        $("#chord"+(chord+1)).addClass("selectedchord");
    }

    drawRhythm();

}

function playChord(input){

    if(input == null){
        rhythminstrument.triggerAttackRelease(sessionchords[selectedchord][0], sessionchords[selectedchord][1] * Tone.Time("1m"));
        isPlayingChord = true;
        lastPlayedOnButton = false;

        return;
    }

    anime({
        targets: "#chordbtn"+input,
        translateY: -10,
        duration: 300,
        easing: 'easeOutElastic(1, .8)',
    });

    rhythminstrument.triggerAttack(scalechords[input],Tone.now());
    lastPlayedOnButton = true;
    isPlayingChord = true;

    $('#chordpiano').klavier('setSelectedValues', noteArraytoMidi(scalechords[input]));

    if(selectedchord != null){
        sessionchords[selectedchord][0] = scalechords[input];
        onModifySession();
        updateChordsOnScore();
        unselectChord();
    }

}

function releaseChords(input){
    
    anime({
        targets: "#chordbtn"+input,
        translateY: 0,
        duration: 300,
        easing: 'easeOutElastic(1, .8)',
    });
    scalechords.forEach((e)=>rhythminstrument.triggerRelease(e));
    //console.log("release",selectedchord)
    isPlayingChord = false;
    $('#chordpiano').klavier('setSelectedValues',[]);
    input = null;
}

function getChordsFromScale(){

    scalechords = [];
    for(var x = 0; x < 7; x++){
        var thischord = [];
        //bassnote
        thischord.push((scales[selectedscale][0][x]-12));

        for(var y = 0; y < chordcomplexity; y++){
            var noteindex = x + (y*2);
            if(noteindex > (scales[selectedscale][0].length)-1){
                noteindex = noteindex - (scales[selectedscale][0].length);
            }
            thischord.push(scales[selectedscale][0][noteindex]);
        }
        scalechords.push(Tone.Frequency((notes[chordsroot].split("/")[0])+"4").harmonize(thischord));
        scalechords[x] = scalechords[x].map((e)=>{
            return Tone.Frequency(e).toNote();
        })
    }

    scalechords.forEach((e,i)=>{

        var btncontent = chordNotestoName(e);

        //if(btncontent[0] == chordNotestoName(scalechords[i+1])[0]){btncontent.replac}

        $("#chordbtn"+i).html(btncontent);

    });

}

function addChord(chordnotes,chord,side){

    //this inserts a new chord, transforming half of other chord on a NC chord, 
    //on it's left side (side = 0),
    //or on the right (side = 1)
    var olderchord = sessionchords[chord];
    var olderchordrhythm = olderchord[3];

    var halfofrhythm = olderchordrhythm.length/2;
    var rhythm1sthalf = olderchordrhythm.splice(0,halfofrhythm);
    var rhythm2ndhalf = olderchordrhythm.splice(-halfofrhythm);

    if(rhythm1sthalf.length==0)rhythm1sthalf = rhythm2ndhalf;
    if(rhythm2ndhalf.length==0)rhythm2ndhalf = rhythm1sthalf;

    //older chord is smaller than 8th note, do nothing
    if(olderchord[1] <= 1/maxchordspermeasure){return;}
    //left
    if(side == 0){
        //insert the new chord(index on array, [[notes(NC)], duration, measure, rhythmpattern])
        sessionchords.splice(chord+side, 0, [chordnotes, olderchord[1]/2, olderchord[2], rhythm1sthalf]);
        olderchord[3] = rhythm2ndhalf;
        olderchord[1] = sessionchords[chord][1];
    }
    //right
    if(side == 1){
        sessionchords.splice(chord+side, 0, [chordnotes, olderchord[1]/2, olderchord[2], rhythm2ndhalf]);
        olderchord[3] = rhythm1sthalf;
        olderchord[1] = sessionchords[chord][1]/2;

    }
    
    var chorddiv = '<div class="chord" id="chord' + (chord+side) + '">' +
                chordNotestoName(chordnotes) + 
                '</div>';
    
    $("#measure" + olderchord[2]).append(chorddiv);

    updateChordsOnScore();
    unselectChord();
    onModifySession();


}

function removeChord(){
    
    var chordsinthismeasure = sessionchords.filter(function(value, index, arr){ 
        return value[2] == sessionchords[selectedchord][2];
    });
    var siblingchordsnum = chordsinthismeasure.length;
    var chordindexinmeasure = chordsinthismeasure.indexOf(sessionchords[selectedchord])

    if(siblingchordsnum == 1){
        sessionchords[selectedchord][0] = [];
    }  
    else if(siblingchordsnum > 1){
        if(chordindexinmeasure == 0){
            sessionchords[selectedchord+1][1] += sessionchords[selectedchord][1];
            sessionchords[selectedchord+1][3] = sessionchords[selectedchord][3].concat(sessionchords[selectedchord+1][3]);
        }
        else{
            sessionchords[selectedchord-1][1] += sessionchords[selectedchord][1];
            sessionchords[selectedchord-1][3] = sessionchords[selectedchord-1][3].concat(sessionchords[selectedchord][3]);

        }

        sessionchords = sessionchords.filter(function(value, index, arr){ 
            return index != selectedchord;
        });
        
        $("#chord"+(selectedchord+1)).remove();    
    }

    unselectChord();
    updateChordsOnScore();
    onModifySession();



}

function updateChordsOnScore(){

    sessionchords.forEach((e,i)=>{

        $("#chord"+(i+1)).html(chordNotestoName(e[0]));
        if(chordNotestoName(e[0]) == "N.C"){
            $("#chord"+(i+1)).addClass("nochord");
        }
        else{
            $("#chord"+(i+1)).removeClass("nochord");
        }
        $(".chord").toArray().forEach((e,i)=>{
            $(e).attr("id","chord"+(i+1));
        });

        $("#chord"+(i+1)).width(sessionchords[i][1] * 100 + "%");

    });

    //update droppable to include new chords

    $(".chord").droppable({
        accept:".chordbtn",
        hoverClass: ".drop-hover",
        over: function( event, ui ) {
  
          hoveredchord = event.target.id.replace("chord","");
          isChordHovered = true;
          //$("#chord"+hoveredchord).width($("#chord"+hoveredchord).width()-10);
        },
        out: function( event, ui ) {
          //$("#chord"+hoveredchord).css("outline","");
          //hoveredchord = hoveredside = null;
        },
        drop: function( event, ui ) {
          var chordnum = $(ui.draggable).attr("id").replace("chordbtn","");
          addChord(scalechords[chordnum],hoveredchord-1,hoveredside);
        }
    });

    drawRhythm();
    drawChordsCircle();

}

function unselectChord(){
    selectedchord = null;
    $(".selectedchord").removeClass("selectedchord");
    $('#chordpiano').klavier('setSelectedValues', []);

}   

function generateRandomProgression(){

    sessionchords = [];

    for(var z = 0; z < sessionlength; z++){
        var chordsinthismeasure = 2 ** Math.floor(Math.random() * 2);
        
        for(var x = 0; x < chordsinthismeasure; x++){

            var thischordnotes = [];
            var thischordcomplexity = Math.floor(Math.random() * 2) + 2;
            var chordgrade = Math.floor(Math.random() * 6);
            var chordduration = 1/chordsinthismeasure;

            
            //add bassnote

            thischordnotes.push((scales[selectedscale][0][chordgrade]-12));
            thischordnotes.push((scales[selectedscale][0][chordgrade]-24));


            //add notes

            for(var y = 0; y < thischordcomplexity; y++){
                var noteindex = chordgrade + (y*2);
                if(noteindex > (scales[selectedscale][0].length)-1){
                    noteindex = noteindex - (scales[selectedscale][0].length);
                }
                thischordnotes.push(scales[selectedscale][0][noteindex]);
            }

            thischordnotes = Tone.Frequency((notes[chordsroot].split("/")[0])+"4").harmonize(thischordnotes);
            thischordnotes = thischordnotes.map((e)=>{
                return Tone.Frequency(e).toNote();
            })
            
            sessionchords.push([thischordnotes,chordduration,z+1])
        
        }
    }

    drawScore();
    onModifySession();
}

function setupHarmonySelectors(){
    notes.forEach((e,i)=>{
        var thisopt = '<option value="'+i+'">'+e+'</option>'
        $("#ce-root").append(thisopt)
    })
    scales.forEach((e,i)=>{
        var thisopt = '<option value="'+i+'">'+e[1]+'</option>'
        $("#ce-scale").append(thisopt)
    })
    $("#ce-root").val(chordsroot);
    $("#ce-scale").val(selectedscale);



}



////////////////////////////////
//Intrument SELECTOR
////////////////////////////////

function rhythmInstrSelector(){
    var cont = "";
    instruments.forEach((e,i)=>{

        cont +='<option value="'+i+'">'+e.name+'</option>'
    })
    $("#chord-instr-input").html(cont);
    $("#chord-instr-input").val(rhythmpatch)
}

function setRhythmInstrument(){


    (isPlaying)?(stopPlayback()):("");

    $("#chord-instr-input").val(rhythmpatch);
    if(instruments[rhythmpatch].base == "Sampler"){
        if(rhythminstrumentbuffers != null) rhythminstrumentbuffers.dispose();
        rhythminstrumentbuffers = new Tone.Buffers(instruments[rhythmpatch].urls,instruments[rhythmpatch].options);
    }
    rhythminstrument = instrumentContructor(rhythmpatch);
    onModifySession();

}

////////////////////////////////
//RHYTHM EDITOR
////////////////////////////////

function drawRhythm(){

    $("#rhythmeditor").html("");
    for (var x = 0; x < sessionsubdivision; x++) {
        var thistile = '<div class="re-tile" id="rt-' + x+ '"></div>'
        $("#rhythmeditor").append(thistile); 
    }

    var measurechords = sessionchords.filter(chord => chord[2] == playbackMeasure+1);
    
    measurechords.forEach((chord,chordindex)=>{
        var rechordlbl = 
        '<span id="re-chname'+chordindex+'" class="re-chname">'+chordNotestoName(chord[0])+'</span>'+
        $("#rhythmeditor").append(rechordlbl);
        
    });

    $('#rt-'+(sessionsubdivision-1)).css( "border-right", "solid 1px var(--darkest-color)");

    updateRhythm();
}

function updateRhythm(){

    var thisrhythm = sessionrhythm[playbackMeasure];
    $('.re-tile').removeClass("re-selected");
    $('.re-tile').removeClass("re-hold");

    for (var x = 0; x < thisrhythm.length; x++) {
        (thisrhythm[x]==1)?($('#rt-' + x).addClass("re-selected")):("");
        (thisrhythm[x]==null)?($('#rt-' + x).addClass("re-hold")):("");

    }


}

function editRhythm(chord,add_delete){

    var measure = sessionchords[selectedchord][2];
    var chordindexes = [];
    sessionchords.forEach((e,i)=>{if(e[2]==measure)chordindexes.push(i)});

    if(add_delete){
        sessionchords[chordindexes[chord]][3].push(2)

    }else{
        sessionchords[chordindexes[chord]][3].pop()

    }
    drawRhythm()
    onModifySession();
}

////////////////////////////////
//BOTTOM PIANO
////////////////////////////////

function setNotes(input){
    sessionchords[selectedchord][0] = midiArraytoNote(input);
    updateChordsOnScore();
    onModifySession();
}

//heavy

function resizeKlavier(){
    $('#chordpiano').klavier('destroy');
    $('#chordpiano').klavier({ startKey: 21, endKey: 108});
    if(selectedchord != null){
        $('#chordpiano').klavier('setSelectedValues', noteArraytoMidi(sessionchords[selectedchord][0]));
    }
}

////////////////////////////////
//EVENTS
////////////////////////////////

$(document).on("click",".chord",function(e){
    var chordclicked = e.target.id.replace("chord","")-1;
    selectChord(chordclicked);
});

$(document).on("dblclick",".chord",function(e){

    changingnamechord = $(e.target).attr("id").replace("chord","")-1;
    $(e.target).html("");
    $("#floatinginput").val("");
    $("#floatinginput").css({
        top: $(e.target).offset().top,
        left: $(e.target).offset().left,
        width:  $(e.target).width(),
    });
    $("#floatinginput").select();
    $("#floatinginput").removeClass("hidden").addClass("visible");

});

$("#floatinginput").blur(function(e){

    $("#chord"+(changingnamechord+1)).html(chordNotestoName(sessionchords[changingnamechord][0]));
    $("#floatinginput").removeClass("visible").addClass("hidden").css({top: "-999px" ,left:"-999px"});;
    changingnamechord = null;

});

$("#floatinginput").change(function(e){

    sessionchords[changingnamechord][0] = chordNametoNotes($("#floatinginput").val());
    $("#chord"+(changingnamechord+1)).html(chordNotestoName(sessionchords[changingnamechord][0]));
    $("#floatinginput").removeClass("visible").addClass("hidden").css({top: "-999px" ,left:"-999px"});;
    changingnamechord = null;
    onModifySession();

});

$("html").keydown(function (e) {
    //ONLY TRIGGER WHEN PAGE LOADED
    if(appMode == 3){
      //1-9
      if (e.keyCode >= 49 && e.keyCode <= 57 && isPlayingChord == false && changingnamechord == null && checkForSelInput()) {
        playChord(e.keyCode - 49);
      }
      if(e.keyCode == 8){
          removeChord();
      }
      if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)){
        //Ctrl + C / Cmd + C
        e.preventDefault();
        clipboard = JSON.stringify([1,sessionchords[selectedchord]]);

      }
      if (e.keyCode == 86 && (e.ctrlKey || e.metaKey)){
       //Ctrl + V / Cmd + V
        e.preventDefault();
        //Paste only notes and rhythm, not durantion and index 

        var newchord = JSON.parse(clipboard)
          
        if(newchord[0] == 1 && newchord[1] != sessionchords[selectedchord]){
          sessionchords[selectedchord][0] = newchord[1][0];
          playChord();
          updateChordsOnScore();
          $('#chordpiano').klavier('setSelectedValues', noteArraytoMidi(sessionchords[selectedchord][0]));
        }
        
        
      }

    }
});

$("html").keyup(function (e) {
    //ONLY TRIGGER WHEN PAGE LOADED
    if(appMode == 3){
      //1-9
      if (e.keyCode >= 49 && e.keyCode <= 57 && isPlayingChord == true) {
        releaseChords(e.keyCode - 49);
      }
    }
});

$(".chordbtn").mousedown(function (e) {
  //ONLY TRIGGER WHEN PAGE LOADED

  playChord($(e.target).attr("id").replace("chordbtn",""));
  
  
});

$(".chordbtn").mouseup(function (e) { 

    releaseChords($(e.target).attr("id").replace("chordbtn",""));

});

$(".chordbtn").mouseout(function (e) { 
    if(isPlayingChord && lastPlayedOnButton){

        setTimeout(releaseChords($(e.target).attr("id").replace("chordbtn","")), 100);
    
    }  
});

$('#chordpiano').click((e)=>{
    var notepressed = $(e.target).data("value");;
    var pianonotes = $('#chordpiano').klavier('getSelectedValues');

    if(pianonotes.indexOf(notepressed)!=-1){
        rhythminstrument.triggerAttackRelease(Tone.Frequency(notepressed,"midi"),"4n")
    }

    setNotes($('#chordpiano').klavier('getSelectedValues'));
});

$("#chord-instr-input").change((e)=>{

    rhythmpatch = tempData.rhythmpatch = $(e.target).val();
    setRhythmInstrument()
})

$(".chordbtn").draggable({
    revert: true,
    revertDuration:0,
    helper:"clone",
    opacity: 0.35,
    cursorAt: { bottom: 27 },
    classes: {
        "ui-draggable-dragging":"draghelper",
    },
    drag: function( event, ui ) {

        if(isChordHovered){
            var innerposition = ui.offset.left-$("#chord"+hoveredchord).offset().left;
            hoveredside = (innerposition<($("#chord"+hoveredchord).width()/2)-27)?(0):(1);

            if(sessionchords[hoveredchord-1][1] > 1/maxchordspermeasure){
                //console.log(hoveredchord,hoveredside);
                $("#addchordhelper").show(0).css({
                    top:$("#chord"+hoveredchord).offset().top,
                    left:$("#chord"+hoveredchord).offset().left+((hoveredside==0)?(0):($("#chord"+hoveredchord).width()/2)),
                    width:$("#chord"+hoveredchord).width()/2
                })
            }
            else{
                $("#addchordhelper").hide(0);
            }
        }
        
    },
    stop: function( event, ui ) {
        isChordHovered = false;
        $("#addchordhelper").hide(0);

    }
});

$("#ce-root").change((e)=>{

    chordsroot = $(e.target).val();
    getChordsFromScale()
})

$("#ce-scale").change((e)=>{

    selectedscale = $(e.target).val();
    getChordsFromScale()
})


$(document).on("click",".re-tile",(e)=>{
    var index = parseInt(e.target.id.replace("rt-",""));
    sessionrhythm[playbackMeasure][index] = (sessionrhythm[playbackMeasure][index]==0)?(1):(0);
    (sessionrhythm[playbackMeasure][index+1] == null && index+1 < sessionsubdivision)?(sessionrhythm[playbackMeasure][index+1] = 1):("")
    updateRhythm();
    onModifySession();


})


$("#rhythmeditor").on("mouseenter",".re-tile",(e)=>{
var index = parseInt(e.target.id.replace("rt-",""));
  if(clickedtiletype != 0 && clickedtile != null){
    sessionrhythm[playbackMeasure][index] = null;    //$(e.target).css("border-left","solid 1px var(--dark-color)")
    updateRhythm();
    
    //console.log(sessionrhythm[playbackMeasure][clickedtile]);
  }
})

$("#rhythmeditor").on("mouseleave",(e)=>{

    if(clickedtile != null){
        clickedtile = null;
        //console.log("out")
        updateRhythm();
        onModifySession();
    }


})

$("#rhythmeditor").on("mousedown",".re-tile",(e)=>{
  e.preventDefault();
  var index = parseInt(e.target.id.replace("rt-",""));
  clickedtiletype = sessionrhythm[playbackMeasure][index];

  clickedtile = e.target.id.replace("rt-","");
  onModifySession();
  updateRhythm();

})

$("#rhythmeditor").on("mouseup",(e)=>{
  clickedtile = null;
  onModifySession();

  //console.log("out")
  updateRhythm();

})

$("#ce-random").click((e)=>generateRandomProgression())

