function prepareOffline(){
    Tone.Offline(({ transport }) => {

      console.log(sessionchords);

      var OFFplaybackMeasure = 0;
      var OFFplaybackBeat = 0;
      var OFFplaybackChord = 0;
      var OFFchordsOnMeasure = 0;
      var OFFbeatsOnChord = 0;
  

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

      var playbacksubdivision = Tone.Time("1m").toSeconds() / sessionsubdivision;

      transport.scheduleRepeat((time) => {

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
        if (OFFplaybackChord == 0){
          scheduleOfflineChordRhythm(thischord, Tone.Time(transport.position).quantize("8n"),transport,OFFplaybackChord,OFFchordsOnMeasure);
        }
      
        if(OFFbeatsOnChord == sessionchords[OFFplaybackChord][1]*sessionsubdivision){
          scheduleOfflineChordRhythm(thischord, Tone.Time(transport.position).quantize("8n"),transport,OFFplaybackChord,OFFchordsOnMeasure);
          OFFbeatsOnChord = 0;
        }
      
        OFFplaybackBeat++;
        OFFbeatsOnChord++;
      
        if (OFFplaybackBeat == sessionsubdivision) {
          OFFplaybackBeat = 0;
        
          if (looponfirstdrum == false) {
            OFFplaybackMeasure++;
            OFFchordsOnMeasure = 0;         
          }
        }
      
      }, playbacksubdivision);

      transport.start();//start loop

    }, 2).then((e) => {
      // do something with the output buffer
    var blob = audioBufferToWaveBlob(e);

    var promiseB = blob.then(function(result) {
        var url  = window.URL.createObjectURL(result);
        $("#downloadloopbtn").attr("href",url);
        $("#downloadloopbtn").attr("download","loop.wav");
     });
    
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
          instrmusaepiano.triggerAttackRelease(Tone.Frequency(chord[0][0]).toFrequency()/2,chordhitdur-0.01,schedulerhythmtime);
        }
        if(e==2){
          //Trigger the full chord
          instrmusaepiano.triggerAttackRelease(chord[0],chordhitdur-0.01,schedulerhythmtime);
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