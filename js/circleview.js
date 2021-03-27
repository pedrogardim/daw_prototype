
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
var fulldrumcircle = false;

var tileSize;
var stepinputmode = false;
var sequencerSteps = sessiondrums.length;
var showSeq = false;


//////////////////////////
//DRAW CIRCLE
//////////////////////////

function drawCircleElements() {
  var totalAngle = -Math.PI / 2;

  $("#rhythmcircle").html("");


  var brokedowndrums = [];

  if(fulldrumcircle == true){
    sessiondrums.forEach((x)=>{x.forEach((y)=>{brokedowndrums.push(y)})})
    console.log(brokedowndrums);
  }
  else{
    brokedowndrums = sessiondrums[playbackMeasure];
  }

  for(var x = 0; x< brokedowndrums.length; x++){
    if (brokedowndrums[x].indexOf(1) != -1) {
      //check for kick drum
      $("#rhythmcircle").append(
        '<div class="ce cestyle1" id="ce' + x + '"></div>'
      );
      continue;
    }

    if (brokedowndrums[x].indexOf(2) != -1) {
      //check for snare drum
      $("#rhythmcircle").append(
        '<div class="ce cestyle2" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(3) != -1) {
      //check for clap
      $("#rhythmcircle").append(
        '<div class="ce cestyle3" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(4) != -1) {
      //check for hihat
      $("#rhythmcircle").append(
        '<div class="ce cestyle4" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(5) != -1) {
      //check open hihat
      $("#rhythmcircle").append(
        '<div class="ce cestyle5" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(6) != -1) {
      //check low tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle6" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(7) != -1) {
      //check mid tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle7" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(8) != -1) {
      //check hi tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle8" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(9) != -1) {
      //check crash
      $("#rhythmcircle").append(
        '<div class="ce cestyle9" id="ce' + x + '"></div>'
      );
      continue;
    }
    if (brokedowndrums[x].indexOf(10) != -1) {
      //check perc
      $("#rhythmcircle").append(
        '<div class="ce cestyle10" id="ce' + x + '"></div>'
      );
      continue;
    }

  }
  

  for(var x=0; x< brokedowndrums.length; x++){

    $("#ce" + x).css({
      left:
        ($("#rhythmcircle").height() / 2) * Math.cos(totalAngle) +
        $("#rhythmcircle").height() / 2 +
        "px",
      top:
        ($("#rhythmcircle").height() / 2) * Math.sin(totalAngle) +
        $("#rhythmcircle").height() / 2 +
        "px",
    });

    totalAngle += Math.PI / (brokedowndrums.length / 2);

  }

  


}

function drawChordsCircle() {

  if (sessionchords.length==0){
    $("#chordcircle").css(
      {"background":"var(--bright-color)",
        "border":"solid 1px var(--dark-color)"});
    $("#chordcirclecenter").css({"border":"solid 1px var(--dark-color)"});
    return;


  }

  var chordcircle = "conic-gradient("
  var accumulatedegree = 0; 

  sessionchords.forEach(function(e,i){

    if (i==0){
      accumulatedegree += (e[1]*90);
      chordcircle += colors[i%3] + " " +accumulatedegree+"deg,";
      
    }
    else if(i==(sessionchords.length-1)){
      if([i%3] != 0){
        chordcircle += (colors[i%3]) + " 0";
      }
      else{
        chordcircle += (colors[(i-2)%3]) + " 0";
      }

    }
    else{
      accumulatedegree += (e[1]*90);
      chordcircle += colors[i%3] + " 0 " +accumulatedegree+"deg, ";

    }
  });

  chordcircle += ")";

  $("#chordcircle").css({"background-image":chordcircle,
                        "border":"none"});

  $("#chordcirclecenter").css({"border":"none"});

}

function drawCircleMelodies(){
  
}

//////////////////////////
//ANIMATIONS
//////////////////////////

//ANIMATE CIRCLE ELEMENTS ON BEAT

var elementtoanimate = 0;

function animateCircleOnBeat() {

  
  //if (playbackBeat == sessiondrums[playbackMeasure.length-1]){
  //  elementtoanimate = 0;
  //}
  //else{
  //  elementtoanimate = playbackBeat-1
  //}
  var actualwidth = $("#ce" + elementtoanimate).width();
  var actualheight = $("#ce" + elementtoanimate).height();

  $("#ce" + elementtoanimate).css({
    width: actualwidth + 10,
    height: actualheight + 10,
  });
  $("#ce" + elementtoanimate).animate(
    { width: actualwidth, height: actualheight },
    50
  );

  elementtoanimate ++;
  if(sessiondrums[playbackMeasure] == undefined){
    elementtoanimate = 0; 
  }
  else if(elementtoanimate == sessiondrums[playbackMeasure].length){
    elementtoanimate = 0;
  }
  
}


