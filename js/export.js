var looprepeats = 1;
var downloadprepared = false;

$('#downloadloopbtn').mouseenter(function () {
  if (downloadprepared == false) {
    prepareOffline();
    $('#downloadloopbtn').removeAttr('href');
    $('#downloadloopbtn').html(
      'Rendering... <i class="fa fa-circle-o-notch fa-spin"></i>'
    );
  }
});

function prepareOffline() {
  var mastervol = -10;

  var exportdur = looprepeats * (60 / sessionbpm) * 4 * sessionlength;

  Tone.Offline(({ transport }) => {
    transport.bpm.value = sessionbpm;

    var chordinst = instrumentContructor(rhythmpatch);

    var offlineDrumSounds = [];

    for (var x = 0; x < drumSounds.length; x++) {
      offlineDrumSounds.push(
        new Tone.Player(drumsamplesbuffer[x]).toDestination()
      );
      offlineDrumSounds[x].volume.value = mastervol;
    }

    chordinst.volume.value = mastervol;

    //DRUMS

    var OFFplaybackMeasure =
      (OFFplaybackBeat =
      OFFplaybackChord =
      OFFchordsOnMeasure =
      OFFbeatsOnChord =
        0);

    var playbacksubdivision = Tone.Time('1m').toSeconds() / sessionsubdivision;

    transport.scheduleRepeat((time) => {
      //console.log(OFFplaybackMeasure,OFFplaybackBeat,OFFplaybackChord,OFFchordsOnMeasure)

      if (OFFplaybackMeasure == sessionlength) {
        OFFplaybackMeasure = OFFbeatsOnChord = OFFplaybackChord = 0;
      }

      var thisdrumpattern = sessiondrums[OFFplaybackMeasure];

      thisdrumpattern[OFFplaybackBeat].forEach((element) =>
        offlineDrumSounds[element - 1].start(time)
      );

      playOFFChordRhythm(
        OFFplaybackChord,
        OFFplaybackMeasure,
        OFFplaybackBeat,
        chordinst,
        time
      );

      OFFplaybackBeat++;
      OFFbeatsOnChord++;

      if (
        OFFbeatsOnChord ==
        sessionsubdivision * sessionchords[OFFplaybackChord][1]
      ) {
        OFFplaybackChord++;
        OFFbeatsOnChord = 0;
      }

      if (OFFplaybackBeat == sessionsubdivision) {
        OFFplaybackBeat = OFFbeatsOnChord = 0;

        OFFplaybackMeasure++;
        OFFchordsOnMeasure = 0;
      }

      if (OFFplaybackMeasure == sessionlength)
        OFFplaybackMeasure = OFFplaybackChord = 0;
    }, playbacksubdivision);

    //RHYTHM

    transport.start();
  }, exportdur).then((e) => {
    // do something with the output buffer
    var blob = audioBufferToWaveBlob(e);

    var promiseB = blob.then(function (result) {
      var url = window.URL.createObjectURL(result);
      $('#downloadloopbtn').attr('href', url);
      $('#downloadloopbtn').attr('download', sessionName + '.wav');
      downloadprepared = true;
      $('#downloadloopbtn').html('DOWNLOAD LOOP');
    });
  });
}

//prepareOffline();

///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////

function playOFFChordRhythm(
  thischord,
  thismeasure,
  thisbeat,
  thisinstrument,
  time
) {
  var thisnotes = sessionchords[thischord][0];
  var thisrhythm = sessionrhythm[thismeasure][thisbeat];
  //chordstrike
  if (thisrhythm == 1) {
    thisinstrument.releaseAll(time);
    thisinstrument.triggerAttack(thisnotes, time);
    $('#chordpiano').klavier(
      'setSelectedValues',
      noteArraytoMidi(sessionchords[thischord][0])
    );
  }
  //hold anterior
  if (thisrhythm == null) {
  }
  //silence
  if (thisrhythm == 0) {
    thisinstrument.releaseAll(time);
    $('#chordpiano').klavier('setSelectedValues', []);
  }
}

async function audioBufferToWaveBlob(audioBuffer) {
  return new Promise(function (resolve, reject) {
    var worker = new Worker('./libs/waveWorker.js');

    worker.onmessage = function (e) {
      var blob = new Blob([e.data.buffer], { type: 'audio/wav' });
      resolve(blob);
    };

    let pcmArrays = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      pcmArrays.push(audioBuffer.getChannelData(i));
    }

    worker.postMessage({
      pcmArrays,
      config: { sampleRate: audioBuffer.sampleRate },
    });
  });
}
