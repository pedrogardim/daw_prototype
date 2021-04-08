var looprepeats = 1;

function prepareOffline(){

    var exportdur = looprepeats * (60/sessionbpm) * 4 * sessionlength;

    Tone.Offline(({ transport }) => {

      transport.bpm.value = sessionbpm;
      var exportpiano = instrumentContructor(0);
      
      /*
      const exportpiano = new Tone.PolySynth(Tone.FMSynth,
        {
        "harmonicity":50,
        "modulationIndex": 20,
        "oscillator" : {
          "type": "sine2"
        },
        "envelope": {
          "attack": 0.001,
          "decay": 2,
          "sustain": 0.0,
          "release": 0.2,
        },
        "modulation" : {
          "type" : "sine"
        },
        "modulationEnvelope" : {
          "attack": 0.001,
          "decay": 0.5,
          "sustain": 0,
          "release": 0.0,
        }
      } ).toDestination();

      */

      exportpiano.volume.value = -12;
      

      if(playingmelodies.length > 0){
        playingmelodies.forEach((e)=>e.dispose());
        playingmelodies = [];
      }

     /*  sessionmelodies.forEach((e,i)=>{
        playingmelodies.push(new Tone.Part(((time, value) => {
          // the value is an object which contains both the note and the velocity
          sessionmelodies[0].instrument.triggerAttackRelease(value.note, value.dur, time, value.velocity);
        }), sessionmelodies[0].notes).start(0));
      }); */

      /* transport.scheduleRepeat((time) => {

        if (OFFplaybackMeasure == sessionlength) {
          OFFplaybackMeasure = OFFbeatsOnChord = OFFplaybackChord = 0;
        }
      
        var thischord = sessionchords[OFFplaybackChord];
        var thisdrumpattern = sessiondrums[OFFplaybackMeasure];
      
        console.log(sessiondrums[OFFplaybackMeasure])
      
          thisdrumpattern[OFFplaybackBeat].forEach((element) =>
            drumSounds[element - 1].start(time)
          );
          //console.log(time);
        //================
        //CHORD RHYTHM
        //================
      
        //Play the first chord of the loop
      
        OFFplaybackBeat++;
        OFFbeatsOnChord++;
      
        if (OFFplaybackBeat == sessionsubdivision) {
          OFFplaybackBeat = 0;
        
          if (looponfirstdrum == false) {
            OFFplaybackMeasure++;
            OFFchordsOnMeasure = 0;         
          }
        }
      
      }, playbacksubdivision); */

      var rhythmtime = 0;

      sessionchords.forEach((chord,chordindex)=>{

        chord[3].forEach((rhythm,rhythmindex)=>{

          var chordhitdur = (chord[1] * Tone.Time("1m").toSeconds()) / chord[3].length;

          transport.scheduleOnce((schedulerhythmtime)=>{
            if(rhythm==0){}

            if(rhythm==1){
              exportpiano.triggerAttackRelease(Tone.Frequency(chord[0][0]).toFrequency()/2,chordhitdur,schedulerhythmtime);
            }
            if(rhythm==2){
              exportpiano.triggerAttackRelease(chord[0],chordhitdur,schedulerhythmtime);
            }
          },rhythmtime);

          rhythmtime += chordhitdur;

        });
      });

      transport.start();//start loop

    }, exportdur).then((e) => {
      // do something with the output buffer
    var blob = audioBufferToWaveBlob(e);
    console.log(e);

    var promiseB = blob.then(function(result) {
        var url  = window.URL.createObjectURL(result);
        $("#downloadloopbtn").attr("href",url);
        $("#downloadloopbtn").attr("download","loop.wav");
     });
    
    }).catch((e)=>{
      console.log({ e });
    });
    
}

//prepareOffline();


function scheduleOfflineChordRhythm(chord,timetostart,transport,pc,cm) {

  var chordhitdur = (chord[1] * Tone.Time("1m").toSeconds()) / chord[3].length;
  var rhythmtime;
  var OFFplaybackChord = pc;
  var OFFchordsOnMeasure = cm;

  //IMPORTANT
  //Due to quantization, to avoid skipping the first chord
  //we need to introduce a little delay (about 1.8ms)

  var firstchorddelay = 0.0018;
  
  chord[3].forEach((e,i)=>{

      rhythmtime = firstchorddelay + timetostart + (i*chordhitdur);

      transport.scheduleOnce((schedulerhythmtime)=>{
        // we have to read data from the previous chord
        if(e==0){
          //Silence, do nothing
        }
        if(e==1){
          //Bass note, temporary solution
          exportpiano.triggerAttackRelease(Tone.Frequency(chord[0][0]).toFrequency()/2,chordhitdur-0.01,schedulerhythmtime);
        }
        if(e==2){
          //Trigger the full chord
          exportpiano.triggerAttackRelease(chord[0],chordhitdur-0.01,schedulerhythmtime);
        }

      },rhythmtime);
  });

  if (OFFplaybackChord < sessionchords.length){ 
    OFFplaybackChord++;OFFchordsOnMeasure++;
    chord = sessionchords[OFFplaybackChord-1];
  }
}


  ///////////////////////////
  ///////////////////////////
  ///////////////////////////
  ///////////////////////////



  async function audioBufferToWaveBlob(audioBuffer) {

    return new Promise(function(resolve, reject) {
  
      var worker = new Worker('./libs/waveWorker.js');
  
      worker.onmessage = function( e ) {
        var blob = new Blob([e.data.buffer], {type:"audio/wav"});
        resolve(blob);
      };
  
      let pcmArrays = [];
      for(let i = 0; i < audioBuffer.numberOfChannels; i++) {
        pcmArrays.push(audioBuffer.getChannelData(i));
      }
  
      worker.postMessage({
        pcmArrays,
        config: {sampleRate: audioBuffer.sampleRate}
      });
  
    });
  
  }