var currentBeat = 1;
var isPlaying = false;
var seqbpm = 120;
var drumSeq = [[1,4],[1,4],[2,4],[4],[4],[4],[2,4],[4],[1,4],[4],[2,4],[4],[1,4],[4],[2,4],[4]];

var drumIsLoaded = false;
var drumSounds = [];


$("html").keydown(function (e) {
    Tone.start();
    if (e.keyCode == 32 && isPlaying == false){e.preventDefault(); Tone.start();play(); return;}
    if (e.keyCode == 32 && isPlaying == true){e.preventDefault(); stop(); return;}
   

});

$("#stepindicator").html(currentBeat);


function play(){
 
    Tone.Transport.bpm.value = seqbpm;                  //loop bpm = var bpm

    Tone.Transport.scheduleRepeat(time => {             //playing loop: use argument "time" to make it accurate

        drumSeq[currentBeat-1].forEach(element => drumSounds[element-1].start(time));   //play every note on each step
        //drumSounds[drumSeq[currentBeat-1]].start(time);
        animateOnBeat();                                //animate all necessary elements
        updateSeqCursor();                              //update sequencer cursor
        $("#stepindicator").html(currentBeat);

        currentBeat++;                                  //go no text beat
        if(currentBeat == sequencerSteps+1) currentBeat = 1;          //if beat == max set, then go to 1 again

    }, "16n");                                           //loop frequency, 8th note

    Tone.Transport.start();                             //start loop
    isPlaying = true;                                   //set variable to playing
    $("#playInd").css("opacity", 1);           
    $("#playInd").animate({opacity:0}, 400);
    
}

function stop(){
    
    Tone.Transport.stop();                              //stop the loop
    Tone.Transport.cancel();                            //reset the loop
    isPlaying = false;                                  //set playing var to false
    updateSeqCursor();
    $("#pauseInd").css("opacity", 1);
    $("#pauseInd").animate({opacity:0}, 400);
    

}

function loadDrums(y){

    for (var i = 0; i < 10; i++) {                       //load 10 drum sounds, from 1.wav (kick) to 10.wav (perc)
        drumSounds.push(new Tone.Player("assets/"+y+"/"+(i+1)+".wav").toDestination().connect(Tone.Master));
    }

}

loadDrums("808");                                       //load files on "808" folder

$('#bpminput').on('input', function() {                 //change loop bpm on value change
    seqbpm = $('#bpminput').val();
    Tone.Transport.bpm.rampTo(seqbpm, 0.5);
});
