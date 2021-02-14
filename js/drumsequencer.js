
//██████╗░██████╗░██╗░░░██╗███╗░░░███╗  ░██████╗███████╗░██████╗░██╗░░░██╗███████╗███╗░░██╗░█████╗░███████╗██████╗░
//██╔══██╗██╔══██╗██║░░░██║████╗░████║  ██╔════╝██╔════╝██╔═══██╗██║░░░██║██╔════╝████╗░██║██╔══██╗██╔════╝██╔══██╗
//██║░░██║██████╔╝██║░░░██║██╔████╔██║  ╚█████╗░█████╗░░██║██╗██║██║░░░██║█████╗░░██╔██╗██║██║░░╚═╝█████╗░░██████╔╝
//██║░░██║██╔══██╗██║░░░██║██║╚██╔╝██║  ░╚═══██╗██╔══╝░░╚██████╔╝██║░░░██║██╔══╝░░██║╚████║██║░░██╗██╔══╝░░██╔══██╗
//██████╔╝██║░░██║╚██████╔╝██║░╚═╝░██║  ██████╔╝███████╗░╚═██╔═╝░╚██████╔╝███████╗██║░╚███║╚█████╔╝███████╗██║░░██║
//╚═════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░░░░╚═╝  ╚═════╝░╚══════╝░░░╚═╝░░░░╚═════╝░╚══════╝╚═╝░░╚══╝░╚════╝░╚══════╝╚═╝░░╚═╝


//////////////////////////
//VARIABLES
//////////////////////////

var selectedDrumPattern = 0;
var currentBeat = 1;
var isPlaying = false;
var sessionbpm = sessionData.drumPatterns[selectedDrumPattern].bpm;
var drumSeq = sessionData.drumPatterns[selectedDrumPattern].seq;
var drumSeqName = sessionData.drumPatterns[selectedDrumPattern].name;
var loadedDrumSound = sessionData.drumPatterns[selectedDrumPattern].sound;

var drumIsLoaded = false;
var drumSounds = [];

var tileSize;
var stepinputmode = false;
var sequencerSteps = 16;
var showSeq = false;
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
  "Percussion",
];

//all necesaries functions to load sequencer page

sequencerSetup();

function sequencerSetup() {
  loadDrums(loadedDrumSound);
  drawCircleElements();
  drawSequencer();
  drawSequencerButton();
  currentPage = "sequencerpage";
}

//////////////////////////
//DRAW CIRCLE
//////////////////////////

function drawCircleElements() {
  var totalAngle = -Math.PI / 2;

  $("#stepindicator").html(currentBeat);

  $("#rhythmcircle").html("");
  $("#rhythmcircle").css({
    width: $("#rhythmcircle").height(),
    "margin-left": -($("#rhythmcircle").height() / 2),
  });

  drumSeq.forEach(function (e, i) {
    if (e.indexOf(1) != -1) {
      //check for kick drum
      $("#rhythmcircle").append(
        '<div class="ce cestyle1" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(2) != -1) {
      //check for snare drum
      $("#rhythmcircle").append(
        '<div class="ce cestyle2" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(3) != -1) {
      //check for clap
      $("#rhythmcircle").append(
        '<div class="ce cestyle3" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(4) != -1) {
      //check for hihat
      $("#rhythmcircle").append(
        '<div class="ce cestyle4" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(5) != -1) {
      //check open hihat
      $("#rhythmcircle").append(
        '<div class="ce cestyle5" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(6) != -1) {
      //check low tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle6" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(7) != -1) {
      //check mid tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle7" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(8) != -1) {
      //check hi tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle8" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(9) != -1) {
      //check crash
      $("#rhythmcircle").append(
        '<div class="ce cestyle9" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(10) != -1) {
      //check perc
      $("#rhythmcircle").append(
        '<div class="ce cestyle10" id="ce' + (i + 1) + '"></div>'
      );
    }

    $("#ce" + (i + 1)).css({
      left:
        ($("#rhythmcircle").height() / 2) * Math.cos(totalAngle) +
        $("#rhythmcircle").height() / 2 +
        "px",
      top:
        ($("#rhythmcircle").height() / 2) * Math.sin(totalAngle) +
        $("#rhythmcircle").height() / 2 +
        "px",
    });

    totalAngle += Math.PI / 8;
  });
}

///////////////////////////
//DRAW SEQUENCER
//////////////////////////

function drawSequencer() {
  $("#stepseq").html("");
  tileSize = $("#stepseq").height() / drumSounds.length;

  for (var y = 0; y < drumSounds.length; y++) {
    for (var x = 0; x < drumSeq.length; x++) {
      $("#stepseq").append(
        '<div class="seqtile" id="seqTile-' + x + "-" + y + '"></div>'
      ); //draw functional clicking tiles
      $("#seqTile-" + x + "-" + y).css({
        top: y * tileSize + "px",
        left: x * tileSize + "px",
      });
    }

    $("#stepseq").append(
      '<div class="ce cestyle' +
        (y + 1) +
        '" id="seqlblel' +
        (y + 1) +
        '"></div>'
    );

    $("#seqlblel" + (y + 1)).css({
      left: -tileSize,
      top: y * tileSize + tileSize / 2,
      transform: $("#seqlblel" + (y + 1)).css("transform") + "scale(0.7)",
    });

    $("#stepseq").append(
      '<span class="seqlbl" id="seqlbl' +
        (y + 1) +
        '">' +
        drumlabels[y] +
        "</span>"
    );

    $("#seqlbl" + (y + 1)).css({
      left: -tileSize,
      top: y * tileSize + tileSize / 2,
    });
  }

  $(".seqtile").css({ width: tileSize, height: tileSize });

  $("#stepseq").css({
    width: tileSize * sequencerSteps,
    "margin-left": -(tileSize * sequencerSteps) / 2,
  });

  updateSeqCursor();
  updateTiles();
}

////////////////////////////
//PLAYING LOOP
////////////////////////////

function seqPlay() {

  Tone.Transport.bpm.value = sessionbpm; //loop bpm = var bpm
  Tone.Transport.scheduleRepeat((time) => {
    //playing loop: use argument "time" to make it accurate

    drumSeq[currentBeat - 1].forEach((
      element //play every note on each step
    ) => drumSounds[element - 1].start(time));

    animateCircleOnBeat(); //animate all necessary elements
    updateSeqCursor(); //update sequencer cursor
    $("#stepindicator").html(currentBeat);
    currentBeat++; //go no text beat
    if (currentBeat == sequencerSteps + 1) currentBeat = 1; //if beat == max set, then go to 1 again
    
  }, "16n"); //loop frequency, 8th note

  Tone.Transport.start(); //start loop
  isPlaying = true; //set variable to playing
  $("#playInd").toggleClass("visible").removeClass("hidden");
  setTimeout(
    (x) => $("#playInd").toggleClass("hidden").removeClass("visible"),
    200
  );
}

function seqStop() {
  Tone.Transport.stop(); //stop the loop
  Tone.Transport.cancel(); //reset the loop
  isPlaying = false; //set playing var to false
  updateSeqCursor();
  $("#pauseInd").toggleClass("visible").removeClass("hidden");
  setTimeout(
    (x) => $("#pauseInd").toggleClass("hidden").removeClass("visible"),
    200
  );
}

///////////////////////////
//SOUND LOADER
//////////////////////////

//CREATE TONE:PLAYER FOR EACH SOUND IN "loadedDrumSound" FOLDER

function loadDrums(y) {
  for (var i = 0; i < 10; i++) {
    //load 10 drum sounds, from 1.wav (kick) to 10.wav (perc)
    drumSounds.push(
      new Tone.Player("assets/" + y + "/" + (i + 1) + ".wav")
        .toDestination()
        .connect(Tone.Master)
    );
  }
}

///////////////////////////
//PARAMETERS INPUT
//////////////////////////

//////BPM

$("#bpminput").on("input", function () {
  seqbpm = $("#bpminput").val();
  Tone.Transport.bpm.rampTo(seqbpm, 0.5);
});

///////////////////////////
//SEQUENCER INPUT
//////////////////////////

function registerNoteToSequencer(note, beat) {
  if (stepinputmode == true) {
    ///ON STEP INPUT MODE
    drumSeq[currentBeat - 1] = []; //clear all notes on this step/beat
    drumSeq[currentBeat - 1].push(note); //register the note that the user played to the sequence
    $("#stepindicator").html(currentBeat);
    updateElements();
    currentBeat++; //once noted is registered, go to next beat
    if (currentBeat == sequencerSteps + 1) {
      currentBeat = 1;
    }
    updateSeqCursor();
    return;
  } else if (showSeq == true) {
    ///WITHOUT STEP INPUT MODE

    if (drumSeq[beat].includes(note) == true) {
      drumSeq[beat] = drumSeq[beat].filter(
        (x) => x != note
      );
    } else if (drumSeq[beat].includes(note) == false) {
      drumSeq[beat].push(note);
    }
    updateElements();
  }
}

///////////////////////////
//STEP INPUT MODE
//////////////////////////

function stepInputOn() {
  if (stepinputmode == false) {
    stepinputmode = true; //activate step input mode
    currentBeat = 1; //reset beat
    $("#stepindicator").html(currentBeat);
    $("#stepinputalert").removeClass("hidden").addClass("visible");
    $("#stepindicator").css("color", "var(--contrast-color)");
    updateSeqCursor();
  }
}

function stepInputOff() {
  if (stepinputmode == true) {
    stepinputmode = false; //activate step input mode
    $("#stepinputalert").addClass("hidden").removeClass("visible");

    updateSeqCursor();
    $("#stepindicator").css("color", "var(--darkest-color)");
  }
}

///////////////////////////
//CIRCLE/SEQUENCER SWITCH
//////////////////////////

function drawSequencerButton() {
  for (var x = 1; x < 13; x++) {
    $(".sequencerbutton").append(
      '<div class="buttontiles" id="bt' + x + '"></div>'
    );
  }
}

//SWITCH MODE AND BUTTON STYLE

function switchSeqMode() {
  if (showSeq == true) {
    $("#stepseq").removeClass("visible").addClass("hidden");
    $("#rhythmcircle").removeClass("hidden").addClass("visible");
    $("#switchseqmode")
      .addClass("sequencerbutton")
      .attr("title", "Sequencer View")
      .removeClass("circlebutton");
    $("#stepindicator").css({
      top: "50%",
      "font-size": "80px",
    });

    drawSequencerButton();

    showSeq = false;
  } else {
    $(".sequencerbutton").html("");
    $("#stepseq").removeClass("hidden").addClass("visible");
    $("#rhythmcircle").removeClass("visible").addClass("hidden");
    $("#switchseqmode")
      .addClass("circlebutton")
      .attr("title", "Circle View")
      .removeClass("sequencerbutton");
    $("#stepindicator").css({
      top:
        $("#maincont").height() + parseInt($(".circlebutton").css("top")) + 36,
      "font-size": "40px",
    });
    showSeq = true;
  }
}

///////////////////////////
//UPDATE ELEMENTS
//////////////////////////

function updateSeqCursor() {
  //update cursor, changing the class on the current bear tile column

  $(".seqtile").removeClass("seqcursor");

  for (var y = 0; y < drumSounds.length; y++) {
    $("#seqTile-" + (currentBeat - 1) + "-" + y).toggleClass("seqcursor");
  }
}

function updateTiles() {
  $(".seqtile").removeClass("selectedTile");

  drumSeq.forEach(function (e, i) {
    e.forEach(function (element, index) {
      $("#seqTile-" + i + "-" + (element - 1)).toggleClass("selectedTile");
    });
  });
}

function updateElements() {
  updateSeqCursor();
  updateTiles();
  drawCircleElements();
}

//////////////////////////
//CLICKING EVENTS
//////////////////////////

/////SWITCH MODE

$(document).on('click','#switchseqmode',function () {
  switchSeqMode();
});


//SEQ TILE CLICK

$(document).on('click','.seqtile',function () {
  $(this).toggleClass("selectedTile");

  var thisid = $(this).attr("id");
  thisid = thisid.replace("seqTile-", "");
  thisid = thisid.split("-");
  var thisstep = thisid[0];
  var thisintrument = parseInt(thisid[1]) + 1;

  registerNoteToSequencer(thisintrument, thisstep);
});

//////////////////////////
//KEYBOARD EVENTS
//////////////////////////

////////KEYDOWN/////////////
$("html").keydown(function (e) {
  //ONLY TRIGGER WHEN PAGE LOADED
  if (loadedPage == "sequencerpage") {

    Tone.start(); //UNLOCK SOUND ON ANY KEY PRESSED

    //SPACE BAR === PLAY/PAUSE

    if (e.keyCode == 32 && isPlaying == false) {
      e.preventDefault();
      seqPlay();
      return;
    }
    if (e.keyCode == 32 && isPlaying == true) {
      e.preventDefault();
      seqStop();
      return;
    }

    //1-9
    if (e.keyCode >= 49 && e.keyCode <= 57) {
      drumSounds[e.keyCode - 49].start();
      registerNoteToSequencer(e.keyCode - 48, currentBeat-1);
      return;
    }

    //0
    if (e.keyCode == 48) {
      drumSounds[9].start();
      registerNoteToSequencer(10, currentBeat-1);
      return;
    }
    //L & R ARROWS
    if (e.keyCode == 37 || e.keyCode == 39) {
      if (e.keyCode == 37 && currentBeat > 1) currentBeat--;
      if (e.keyCode == 39 && currentBeat < sequencerSteps) currentBeat++;
      if (isPlaying == true) stop();
      drumSeq[currentBeat - 1].forEach((element) =>
        drumSounds[element - 1].start()
      );
      updateSeqCursor();
      $("#stepindicator").html(currentBeat);
      animateCircleOnBeat();
    }
    //SHIFT / STEP INPUT MODE ON
    if (e.keyCode == 16) {
      e.preventDefault();
      stop();
      stepInputOn();
    }
  }
});

////////KEYUP/////////////

$("html").keyup(function (e) {
  if (loadedPage == "sequencerpage") {
    //SHIFT / STEP INPUT MODE OFF
    if (e.keyCode == 16) {
      e.preventDefault();
      stepInputOff();
    }
  }
});

//////////////////////////
//ANIMATIONS
//////////////////////////

//ANIMATE CIRCLE ELEMENTS ON BEAT

function animateCircleOnBeat() {
  var actualwidth = $("#ce" + currentBeat).width();
  var actualheight = $("#ce" + currentBeat).height();

  $("#ce" + currentBeat).css({
    width: actualwidth + 10,
    height: actualheight + 10,
  });
  $("#ce" + currentBeat).animate(
    { width: actualwidth, height: actualheight },
    50
  );
}

//animate STEP INPUT RED CIRCLE

anime({
  targets: "#stepinputrecord",
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  loop: true,
  duration: 1500,
  easing: "easeInOutSine",
});
