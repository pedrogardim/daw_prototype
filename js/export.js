

$(()=>{


function prepareOffline(){
    const offline = 
    new Tone.Offline(() => {
      const oscillator = new Tone.Oscillator().toDestination().start(0);
  
    }, 2).then((e) => {
      // do something with the output buffer
    console.log(audioBufferToWav(e));

    var blob = audioBufferToWaveBlob(e);

    var promiseB = blob.then(function(result) {
        var url  = window.URL.createObjectURL(result);
        console.log(url);
     });
    
    });
    
}

prepareOffline();




});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////







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