//////////////////////////
//PLAYBACK

var playbackChord = playbackMeasure = playbackBeat = playbackChord = beatsOnChord = 0;
var editmode = false;
var isPlaying = false;
var isChordPlaying = false;

var drumIsLoaded = false;
var drumSounds = [];

var looponfirstdrum = false;

var playingmelodies = [];
var melodyCursorLoop;

var rhythmcounter;

Tone.Transport.bpm.value = sessionbpm;

Tone.Transport.loop = true;
Tone.Transport.loopStart = 0;
Tone.Transport.loopEnd = "4m";

function startPlayback() {
  
  playbackMeasure = playbackBeat = playbackChord = chordsOnMeasure = elementtoanimate = beatsOnChord = 0;
  
  isChordPlaying = false;
  drawCircleElements();
  unselectChord();

  $("#drummeasure"+(playbackMeasure+1)).css("filter","brightness(1.2)");
  isPlaying = true; //set variable to playing

  playMelodies();

  var playbacksubdivision = Tone.Time("1m").toSeconds() / sessionsubdivision;

  Tone.Transport.scheduleRepeat((time) => {
    
    if (playbackMeasure == sessionlength) {
      playbackMeasure = beatsOnChord = playbackChord = 0;
    }

    var thischord = sessionchords[playbackChord];
    var thisdrumpattern = sessiondrums[playbackMeasure];

    //================
    //DRUMS
    //================

    var drumssub = sessionsubdivision / sessiondrums[playbackMeasure].length;
    //For instance, 16(session sub)/8(length of drumpattern of the current measur) = 2

    //If the current beat is a multiple of 2 (0,2,4,6,8....), play.

    if (playbackBeat % drumssub == 0) {
      thisdrumpattern[playbackBeat / drumssub].forEach((element) =>
        drumSounds[element - 1].start(time)
      );
      //console.log(time);
      Tone.Draw.schedule(function () {
        animateCircleOnBeat();
      }, time);
    }

    updateSequencerElements();

    //================
    //CHORD RHYTHM
    //================

    //Play the first chord of the loop
    if (playbackChord == 0){
      scheduleChordRhythm(thischord, Tone.Time(Tone.Transport.position).quantize("8n"));
    }

    if(beatsOnChord == sessionchords[playbackChord-1][1]*sessionsubdivision){
      scheduleChordRhythm(thischord, Tone.Time(Tone.Transport.position).quantize("8n"));
      beatsOnChord = 0;
    }

    $("#statuscursor").css(
      "transform",
      "rotate(" +
        ((playbackMeasure * sessionsubdivision + playbackBeat) /
          (sessionsubdivision * sessionlength)) *
          360 +
        "deg)"
    );

    playbackBeat++;
    beatsOnChord++;

    if (playbackBeat == sessionsubdivision) {
      playbackBeat = 0;

      if (looponfirstdrum == false) {
        playbackMeasure++;
        chordsOnMeasure = 0;
        Tone.Draw.schedule(function () {
          updateSequencerElements();
          drawCircleElements();
        }, time + playbacksubdivision);

      }
    }

  }, playbacksubdivision);
  

  Tone.Transport.start(); //start loop

  melodyCursorLoop = 
  setInterval(function (){
    var cursorposition = 50 + ($("#prrow1").width()*Tone.Transport.progress);
    $("#prcursor").css("left",cursorposition);
  }, 16);

}
//===============================

function stopPlayback() {
  Tone.Transport.stop(); //stop the loop
  Tone.Transport.cancel(); //stop the loop

  playbackMeasure = playbackBeat = playbackChord = elementtoanimate = beatsOnChord = 0;

  //playbackChord --; 

  $(".chord").css("color","var(--darkest-color)");

  drawCircleElements();
  $("#statuscursor").css(
    "transform",
    "rotate(" +
      ((playbackMeasure * sessionsubdivision + playbackBeat) /
        (sessionsubdivision * sessionlength)) *
        360 +
      "deg)"
  );

  updateSequencerElements();
  unselectChord();

  clearInterval(melodyCursorLoop);

  isPlaying = false;

  $(".chordinput").removeClass("activechord");

  $("#pauseInd").toggleClass("visible").removeClass("hidden");
  setTimeout(
    (x) => $("#pauseInd").toggleClass("hidden").removeClass("visible"),
    200
  );
}

function scheduleChordRhythm(chord,timetostart) {

  var chordhitdur = (chord[1] * Tone.Time("1m").toSeconds()) / chord[3].length;
  var rhythmtime;

  //IMPORTANT
  //Due to quantization, to avoid skipping the first chord
  //we need to introduce a little delay (about 1.8ms)

  var firstchorddelay = 0.0018;
  
  chord[3].forEach((e,i)=>{

      rhythmtime = firstchorddelay + timetostart + (i*chordhitdur);

      Tone.Transport.scheduleOnce((schedulerhythmtime)=>{
        // we have to read data from the previous chord
        if(e==0){
          //Silence, do nothing
        }
        if(e==1){
          //Bass note, temporary solution
          instrmusaepiano.triggerAttackRelease(Tone.Frequency(chord[0][0]).toFrequency()/2,chordhitdur-0.01,schedulerhythmtime);
        }
        if(e==2){
          //Trigger the full chord
          instrmusaepiano.triggerAttackRelease(chord[0],chordhitdur-0.01,schedulerhythmtime);
        }

        $(".re-strike").css("background","var(--darkest-color)");

        $("#re-strike-"+(chordsOnMeasure-1)+"-"+i).css("background","var(--medium-color)");

      },rhythmtime);
  });

  if (playbackChord < sessionchords.length){ 
    playbackChord++;chordsOnMeasure++;
    chord = sessionchords[playbackChord-1];
    $(".chord").css("color","var(--darkest-color)");
    $("#chord"+(playbackChord)).css("color","var(--medium-color)");
    $("#chordpiano").klavier('setSelectedValues', noteArraytoMidi(chord[0]));

    drawRhythm(sessionchords[playbackChord-1][2]);
    $("#re-chname").css("color","var(--darkest-color)");
    $("#re-chname"+(chordsOnMeasure-1)).css("color","var(--medium-color)");

  }
}

function scheduleDrums() {
  var measureposition = 0;
  var currentmeasure = 0;

  for (var x = 0; x < sessionlength; x++) {

    Tone.Transport.schedule((time) => {
      sessiondrums.forEach((beat, beatnum) => {
        beat.forEach((notes, notenum) => {
          drumSounds[parseInt(notes) - 1].start(
            time + (Tone.Time("1m").toSeconds() / sessiondrums.length) * beatnum
          );
        });
      });

      currentmeasure++;
    }, measureposition);

    measureposition += Tone.Time("1m").toSeconds();
  }
}

function playMelodies(){
  
  if(playingmelodies.length > 0){
    playingmelodies.forEach((e)=>e.dispose());
    playingmelodies = [];
  }
  sessionmelodies.forEach((e,i)=>{
    playingmelodies.push(new Tone.Part(((time, value) => {
      // the value is an object which contains both the note and the velocity
      sessionmelodies[0].instrument.triggerAttackRelease(value.note, value.dur, time, value.velocity);
    }), sessionmelodies[0].notes).start(0));
  });
}


//////////////////////////
//KEYDOWN EVENTS
//////////////////////////

$("html").keydown(function (e) {
  //ONLY TRIGGER WHEN PAGE LOADED

  Tone.start(); //UNLOCK SOUND ON ANY KEY PRESSED

  //SPACE BAR === PLAY/PAUSE

  if (e.keyCode == 32 && isPlaying == false && changingnamechord == null) {
    e.preventDefault();
    startPlayback();
    //scheduleChords();
    return;
  }
  if (e.keyCode == 32 && isPlaying == true) {
    stopPlayback();
    return;
  }
  if (e.keyCode == 190) {
    //instrmusaepiano.triggerAttackRelease(["C3", "E4", "B4"],"4n");
    return;
  }
});
