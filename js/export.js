var looprepeats = 1;
var downloadprepared = false;

$("#downloadloopbtn").mouseenter(function () { 
  if(downloadprepared == false){
    prepareOffline();
    $("#downloadloopbtn").removeAttr('href');
    $("#downloadloopbtn").html('Rendering... <i class="fa fa-circle-o-notch fa-spin"></i>');
  }
  
});



function prepareOffline(){

    var mastervol = -10;


    var exportdur = looprepeats * (60/sessionbpm) * 4 * sessionlength;

    Tone.Offline(({ transport }) => {

      transport.bpm.value = sessionbpm;

      var chordinst = instrumentContructor(0);

      var offlineDrumSounds = [];

      for (var x = 0; x < drumSounds.length; x++) {
        offlineDrumSounds.push(new Tone.Player(drumsamplesbuffer[x]).toDestination());
        offlineDrumSounds[x].volume.value = mastervol;
      }

      chordinst.volume.value = mastervol;

      //DRUMS
     
      var playbacksubdivision = Tone.Time("1m").toSeconds() / sessionsubdivision;

      var OFFplaybackMeasure = OFFplaybackBeat = 0;

      transport.scheduleRepeat((time) => {
        
        var thisdrumpattern = sessiondrums[OFFplaybackMeasure];
            
          thisdrumpattern[OFFplaybackBeat].forEach((element) =>{
            offlineDrumSounds[element-1].start(time);
          });
      
        OFFplaybackBeat++;
      
        if (OFFplaybackBeat == sessionsubdivision) {
          OFFplaybackBeat = 0;
          OFFplaybackMeasure++;
        }
      
      }, playbacksubdivision);

      //RHYTHM

      var rhythmtime = 0;

      sessionchords.forEach((chord,chordindex)=>{

        chord[3].forEach((rhythm,rhythmindex)=>{

          var chordhitdur = (chord[1] * Tone.Time("1m").toSeconds()) / chord[3].length;

          transport.scheduleOnce((schedulerhythmtime)=>{
            if(rhythm==0){}

            if(rhythm==1){
              chordinst.triggerAttackRelease(Tone.Frequency(chord[0][0]).toFrequency()/2,chordhitdur,schedulerhythmtime);
            }
            if(rhythm==2){
              chordinst.triggerAttackRelease(chord[0],chordhitdur,schedulerhythmtime);
            }
          },rhythmtime);

          rhythmtime += chordhitdur;

        });
      });


      transport.start();




    }, exportdur).then((e) => {
      // do something with the output buffer
    var blob = audioBufferToWaveBlob(e);

    var promiseB = blob.then(function(result) {
        var url  = window.URL.createObjectURL(result);
        $("#downloadloopbtn").attr("href",url);
        $("#downloadloopbtn").attr("download",sessionName+".wav");
        downloadprepared = true;
        $("#downloadloopbtn").html("DOWNLOAD LOOP");

     });
    
    });

  
    
}

//prepareOffline();


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


