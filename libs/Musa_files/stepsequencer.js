var tileSize;
var stepinputmode = false;
var sequencerSteps = 16;
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

$("html").keydown(function (e) {
  //pressing shift
  if (e.keyCode == 16) {
    e.preventDefault();
    stop();
    stepInputOn();
  }
  if (e.keyCode == 37) {
    currentBeat--;
    updateSeqCursor();
  }
  if (e.keyCode == 39) {
    currentBeat++;
    updateSeqCursor();
  }
});

$("html").keyup(function (e) {
  if (e.keyCode == 16) {
    e.preventDefault();
    stepInputOff();
  }
});

function drawSequencer() {
  tileSize = $("#stepseq").width() / drumSeq.length;

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
      transform: $("#seqlblel" + (y + 1)).css("transform") + "scale(0.8)",
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
  $(".headseqtile").css({ width: tileSize, height: tileSize });
}

function registerNoteToSequencer(note) {
  if (stepinputmode == true) {
    registerStepInput(note);
    return;
  } else {
    toggleNote(currentBeat - 1, note);
  }
}
function stepInputOn() {
  if (stepinputmode == false) {
    stepinputmode = true; //activate step input mode
    currentBeat = 1; //reset beat
    $("#stepindicator").html(currentBeat);
    anime({
      //show step input indicator
      targets: "#stepinputalert",
      opacity: 1,
      duration: 1500,
    });

    $("#stepindicator").css("color", "#E85A4F");
    updateSeqCursor();
  }
}

function stepInputOff() {
  if (stepinputmode == true) {
    stepinputmode = false; //activate step input mode
    anime({
      //hide step input indicator
      targets: "#stepinputalert",
      opacity: 0,
      duration: 1500,
    });
    updateSeqCursor();
    $("#stepindicator").css("color", "#05386B");
  }
}

function registerStepInput(note) {
  //look for keys played during step input mode
  if (stepinputmode == true) {
    //check if stepInputMode is on, otherwise do nothing
    drumSeq[currentBeat - 1] = []; //clear all notes on this step/beat
    drumSeq[currentBeat - 1].push(note); //register the note that the user played to the sequence
    drawCircleElements(); //refresh circle
    $("#stepindicator").html(currentBeat);
    updateSeqCursor();

    currentBeat++; //once noted is registered, go to next beat
    if (currentBeat == sequencerSteps + 1) currentBeat = 1;
    updateSeqCursor();

  }
}

function toggleNote(thisstep, thisintrument) {
  if (drumSeq[thisstep].includes(thisintrument) == true) {
    drumSeq[thisstep] = drumSeq[thisstep].filter((x) => x != thisintrument);
  } else if (drumSeq[thisstep].includes(thisintrument) == false) {
    drumSeq[thisstep].push(thisintrument);
  }

  drawCircleElements();
  updateTiles();
}

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

drawSequencer();

$(".seqtile").click(function () {
  $(this).toggleClass("selectedTile");

  var thisid = $(this).attr("id");
  thisid = thisid.replace("seqTile-", "");
  thisid = thisid.split("-");
  var thisstep = thisid[0];
  var thisintrument = parseInt(thisid[1]) + 1;

  toggleNote(thisstep, thisintrument);
});

updateTiles();

anime({
  //animate recording red circle
  targets: "#stepinputrecord",
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  loop: true,
  duration: 1500,
  easing: "easeInOutSine",
});
