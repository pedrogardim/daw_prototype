//================================================
//MUSIC DATA
//================================================
var notes = ["C","C#/D♭","D","D#/E♭","E","F","F#/G♭","G","G#/A♭","A","A#/B♭","B"];

var chordnamepossibilities=[
  ["4","4th"],
  ["5","5th"],
  ["","maj","major","maior","mayor","M"],
  ["m","min","minor","menor","-"],
  ["sus2","2"],
  ["sus4","4"],
  ["dim","°"],
  ["aug","+","+5"],
  
  ["6","maj6","M6","major6"],
  ["maj7","M7","major7"],
  ["maj7#5","M7#5","aug7"],

  ["9","add9","major9","maj9"],
  
  ["m6","-6","minor6"],
  ["m7","-7","minor7","min7"],
  ["m9","-9","minor9","min9"],
  
  ["7"],
  ["mmaj7","-maj7"],
  ["°7","dim7"],
  ["ø7","m7♭5"],

];

var chordtypes =[

  [0,5],
  [0,7],
  [0,4,7],
  [0,3,7],
  [0,2,7],
  [0,5,7],
  [0,3,6],
  [0,4,8],
  
  [0,4,7,9],
  [0,4,7,11],
  [0,4,8,11],

  [0,4,7,11,14],
  
  [0,3,7,8],
  [0,3,7,10],
  [0,3,7,10,14],
  
  [0,4,7,10],
  [0,3,7,11],
  [0,3,6,10],
  [0,3,6,9],

];

var chordextentions = ["","♭9","9","#9","#9","11","#11","","♭13","13","♭7","7"]
///////////////77777/ ["","m2","2","m3","M3","4"," #4","5", "m6", "6","m7","7"]

var musicalintervals = [1.0595,1.1225,1.1892,1.2599,1.3348,1.4142,1.4983,1.5874,1.6818,1.7818,1.8877,2];

var scales = [
  [[0,1,2,3,4,5,6,7,8,9,10,11],"Chromatic"],
  [[0,2,4,5,7,9,11],"Major"],
  [[0,2,3,5,7,8,10],"Minor"],
  [[0,2,4,7,9],"Major Pentatonic"],
  [[0,3,5,7,10],"Minor Pentatonic"],
  [[0,2,3,5,7,9,10],"Dorian Mode"],
  [[0,1,3,5,7,8,10],"Phrygian"],
  [[0,1,3,5,7,8,10],"Lydian"],





];

var drumlabels = [
  "Kick",
  "Snare",
  "Clap",
  "C.HiHat",
  "O.HiHat",
  "Lo Tom",
  "Mid Tom",
  "Hi Tom",
  "Crash",
  "Perc",
];

var colors = [
  "var(--darkest-color)",
  "var(--dark-color)",
  "var(--medium-color)",
  "var(--bright-color)",
]

//var colors = [
//  "blue",
//  "red",
//  "green",
//  "yellow",
//]
//================================================
//================================================


//METER ================================================

//const meter = new Tone.FFT(128);
//console.log([0, 1, 2, 3, 4].map(index => meter.getFrequencyOfIndex(index)));
//const meter = new Tone.FFT(128);
const meter = new Tone.Meter();
meter.normalRange = true;
Tone.Master.connect(meter);

//TOOLTIP ================================================

$(document).tooltip({
  track: false,
  show:50,
  hide:50,
  classes: {
    "ui-tooltip": "customtooltip",
  },
  position: {
    my: "center bottom-20",
    at: "center top",
    using: function (position, feedback) {
      $(this).css(position);
    },
  },
});

$( ".sidemenuitem" ).tooltip({
  position: { my: "left+15 center", at: "right center" }
});

////////////////////////////////
//LOAD SCREEN ================================================
////////////////////////////////

function closeLoadingScreen(){
  $(".loadingscreen").addClass("hidden").css("z-index",-99999);

}


////////////////////////////////


function drawScore() {

  $("#centerscore").html("");
  
  var measures=[];
    sessionchords.forEach((e,i)=>{measures.push(e[2])})
    measures = [...new Set(measures)];
    measures.forEach((e,i)=>{
      var measure = '<div class="measure" id="measure' + e + '"></div>';
      $("#centerscore").append(measure);
    })
  
  sessionchords.forEach(function (el, ind) {

    var chord = '<div class="chord" id="chord' + (ind+1) + '">' +
                //'<span class="material-icons addchordbtn acbl">add_circle</span>' +
                chordNotestoName(el[0]) + 
                //'<span class="material-icons addchordbtn acbr">add_circle</span>' +
                '</div>';

    $("#measure" + el[2]).append(chord);
    $("#chord" + (ind+1),"#centerscore").width( el[1] * 100 + "%");
    $("#chord" + (ind+1)).droppable({
      accept:".chordbtn",
      hoverClass: ".drop-hover",
      over: function( event, ui ) {
        $("#addchordhelper").show(0);

        hoveredchord = event.target.id.replace("chord","");
        isChordHovered = true;
      },
      out: function( event, ui ) {
        //$("#chord"+hoveredchord).css("outline","");
        //console.log("hoverout");
        //$("#addchordhelper").hide(0);
        //isChordHovered = false;

      },
      drop: function( event, ui ) {
        var chordnum = $(ui.draggable).attr("id").replace("chordbtn","");
        addChord(scalechords[chordnum],hoveredchord-1,hoveredside);
        isChordHovered = false;
        $("#addchordhelper").hide(0);



      }
  
  });
    
  });
  rhythmInstrSelector();
}

function drumScore() {
  
  var existentnotesonsession = [];

  sessiondrums.forEach((msre,msreindex)=>{
   msre.forEach((a)=>{a.forEach((b)=>{if(existentnotesonsession.indexOf(b) == -1){existentnotesonsession.push(b)}})});
  });

  existentnotesonsession.sort((a, b) => a - b);
  
  sessiondrums.forEach((msre,msreindex)=>{
  
    var measure = '<div class="measure drummeasure" id="drummeasure' + (msreindex+1) + '"></div>';
    $("#bottomscore").append(measure);
    //draw the measure tiles

    var tileh = 60/existentnotesonsession.length;
    var tilew = $('#drummeasure'+(msreindex+1)).width()/msre.length;
    
    existentnotesonsession.forEach((note,noteindex)=>{


    msre.forEach((beat,beatindex)=>{
        
        var tile = '<div class="measuretile" id="mt'+msreindex+'-'+beatindex+'-'+noteindex+'"></div>';
        $('#drummeasure'+(msreindex+1)).append(tile);

        $("#mt"+msreindex+'-'+beatindex+'-'+noteindex).css({
          "height":tileh+"px",
          "width":tilew+"px",
        });
        
        if(beat.indexOf(note)!=-1){
          $("#mt"+msreindex+'-'+beatindex+'-'+noteindex).addClass("activetile");
        }

      });
    });

  })

  
  //sessionchords.forEach(function (el, ind) {
  //    
  //  var chord = '<div class="ghostchord" id="ghostchord' + (ind+1) + '">' + chordNotestoName(el[0]) + '</div>';
  //  $("#drummeasure" + el[2]).append(chord);
  //  $("#chord" + (ind+1),"#bottomscore").width(el[1] * 100 + "%");
  //});

  

}

function chordNametoNotes(arg) {
  var chordroot,
    chordtype,
    chordbass = null;
  var chordinput = arg.replace(" ", "");

  if (chordinput.indexOf("/") != -1) {
    chordbass = chordinput.split("/")[1];
    chordinput = chordinput.split("/")[0];
  } else if (chordinput[1] == "b") {
    var includecomma = chordinput.replace("b", "b,");
    var rootandtypearray = includecomma.split(",");
    chordroot = rootandtypearray[0];
    chordtype = rootandtypearray[1];
  } else {
    chordroot = chordinput[0];
    chordtype = chordinput.replace(chordroot, "");
  }

  chordnamepossibilities.forEach(function (element, index) {
    if (element.indexOf(chordtype) != -1) {
      chordtype = index;
    }
  });

  if (chordbass !== null) {
    //append bass
  }
  
  var harmonizedchord =  Tone.Frequency(chordroot + "3").harmonize(chordtypes[chordtype]);
  var finishedchord = [];
  harmonizedchord.forEach((e)=>finishedchord.push(Tone.Frequency(e).toNote()));

  return finishedchord;

}

function chordNotestoName(arg) {

  if(arg.length == 0){
    return "N.C";
  };

  var chordroot = Tone.Frequency(arg[0]).toFrequency();
  var chordtype = "...";
  var additionalnotes = [];
  var additionalnotesstring = "";

  var chordintervals = [0];

  //transform the note array into intervals array, putting everyone inside the same octave and removing duplicated.

  arg.forEach(function (element, index) {
    if (index == 0) return;
    var thisfrequency = Tone.Frequency(element).toFrequency();
    var thisrelation =
      Math.round((thisfrequency / chordroot + Number.EPSILON) * 10000) / 10000;
    while (thisrelation < 1) {
      thisrelation *= 2;
    }
    while (thisrelation > 2) {
      thisrelation /= 2;
    }

    musicalintervals.forEach(function (e, i) {
      if (Math.abs(thisrelation - e) < 0.005) {
        thisinterval = i + 1;
      }
    });

    if (chordintervals.indexOf(thisinterval) == -1)
      chordintervals.push(thisinterval);
  });

  //Sort in numeric order - 2,3,1 into 1,2,3

  chordintervals.sort((a, b) => a - b);

  //Now, compare it with each type in the "chordtypes" array

  //This array will store the common intervals with each of the "chordtypes" type

  var typepossibilities = [];

  //For each chordtype:

  chordtypes.forEach(function (element, index) {
    var commonintervals = [];
    commonintervals = chordintervals.filter((el) => element.includes(el));
    typepossibilities.push(commonintervals.length - 1);

    //Check the common intervals with which of the types.
  });

  //Now, chose the one type with most common intervals (if are more than 1, pick the first)

  var typechosen = typepossibilities.reduce(
    (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
    0
  );

  //the output is a int, will be the index. Now we pick the name from "chordnamepossibilities"

  chordtype = chordnamepossibilities[typechosen][0];

  //also add other extentions to the chord

  additionalnotes = chordintervals.filter(function (val) {
    return chordtypes[typechosen].indexOf(val) == -1;
  });


    additionalnotes.forEach(function (element, index) {
      if (additionalnotes.length == 1 && element != 12) {
        additionalnotesstring = "(" + chordextentions[element] + ")";
         
      } 
      else if(element == 12){
        additionalnotesstring="";
      }
      
      else {
        if (index == 0) {
          additionalnotesstring = chordextentions[element];
        } else if(element != 12){
          additionalnotesstring += "/";
          additionalnotesstring += chordextentions[element];
        }
      }
    });
 

  //Convert the root note from chord to  ;

  chordroot = Tone.Frequency(chordroot).toNote().replace(/[0-9]/g, "");

  //return everything

  return chordroot + chordtype + additionalnotesstring;
}

function noteArraytoMidi(arg){
  var newarray = []
  arg.forEach((e)=>{newarray.push(Tone.Frequency(e).toMidi())});
  return newarray;
}

function midiArraytoNote(arg){
  var newarray = []
  arg.forEach((e)=>{newarray.push(Tone.Frequency(e,"midi").toNote())});
  return newarray;
}

function gcd_two_numbers(x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number')) 
    return false;
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function checkForSelInput(){
  return ($(document.activeElement)[0].tagName == "INPUT")?(false):(true)
}

//ANIMATED CUBE
/* 
function setup() {
  let cnv = createCanvas(100, 100, WEBGL);
  cnv.id('mycanvas');
  cnv.parent("circlescont");
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
}
function draw() {
  background(color(0,0,0,0));
  
  var size = map((meter.getValue()),0,0.5,40,50);

  rotateX(millis() / 3500);
  rotateY(millis() / 3500);

  //torus(map((meter.getValue()),0,0.5,30,40), 15, 3, 12);
  stroke("#05386b");
  strokeWeight(2);
  box(size, size, size);
  noFill();

}
 */
//all necesaries functions to load sequencer page
$(function() {

  //onModifySession();
  drawCircleElements();
  drawChordsCircle();
  drumScore();
  drawScore();
  //drawPianoRoll();

  getChordsFromScale();
  //showMelodyList();
  //loadMelodyInstruments()

  loadDrums("808");

  drawDrumKeys();
  updateMsreScroreTiles();
  adaptDrumSeqtoSubdiv();

  $("#sessiontitle").html(sessionName);
  $('#chordpiano').klavier({ startKey: 21, endKey: 108});
  
  navTo(2);

  drawSequencer();

  $("#sessiontitle").html(sessionName);
  initializeSettingsInputs();

  closeLoadingScreen();
});

$(window).resize(function () {
  //updateMelodyPreview();
  //adjustNotesPos();
  resizeKlavier();
  


});

function updateAll(){
  
  updateMsreScroreTiles();
  updateSequencerElements();

  adaptDrumSeqtoSubdiv();
  //updateMelodyPreview();
  drawScore();
  drawRhythm();
  setRhythmInstrument()

  //adjustNotesPos();
  if(selectedchord != null){
    $('#chordpiano').klavier('setSelectedValues', noteArraytoMidi(sessionchords[selectedchord][0]))
  }
}


//////////////////////////////////
///EVENTS
//////////////////////////////////

function initializeSettingsInputs(){

  $("#ss-bpminput").val(sessionbpm);
  $("#ss-lpsizeinput").val(sessionlength);
  $('#ss-timesig option[value="'+(sessiontimesignature[0]/sessiontimesignature[1])+'"]').prop('selected', true);

}

$("#ss-bpminput").change((e)=>{

  var newbpm = parseInt($(e.target).val());
  if (newbpm > 60 && newbpm < 300){
    Tone.Transport.bpm.rampTo(newbpm, 0.5);
    sessionbpm = tempData.bpm = newbpm;
  }
  else if(newbpm < 60){
    $("#ss-bpminput").val(60);
    Tone.Transport.bpm.rampTo(60, 0.5);
    sessionbpm = tempData.bpm = 60;

  }
  else if(newbpm > 300){
    $("#ss-bpminput").val(300);
    Tone.Transport.bpm.rampTo(300, 0.5);
    sessionbpm = tempData.bpm = 300; 
  }

  onModifySession()

})





