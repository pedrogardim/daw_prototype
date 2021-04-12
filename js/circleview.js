
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

//numbers after [drumelemcategory] @ drumskits.js
const showpriotity = [13,14,15,10,1,2,3,7,8,9,0,11,12,6,4,5]


//////////////////////////
//DRAW CIRCLE
//////////////////////////

function drawCircleElements() {
  var totalAngle = -Math.PI / 2;

  $("#rhythmcircle").html("");

  brokedowndrums = sessiondrums[playbackMeasure];

  for(var x=0; x< brokedowndrums.length; x++){

    if(brokedowndrums[x].length == 0){

      totalAngle += Math.PI / (brokedowndrums.length / 2);
      continue;

    };

    var priorarray = [];

    brokedowndrums[x].forEach((e,i)=>{
      var thisnotecategory = seldrumkit.elemcat[e-1];
      var thisnotepriority = showpriotity.indexOf(thisnotecategory);
      priorarray.push(thisnotepriority)
    })

    var chosenelement = brokedowndrums[x][priorarray.indexOf(Math.min.apply(null,priorarray))]-1;

    var elementicon = (seldrumkit.hasOwnProperty('icons'))?(seldrumkit.icons[chosenelement]):(drumelemcategory[seldrumkit.elemcat[chosenelement]][1]);

    $("#rhythmcircle").append(
      '<svg height="48px" width="48px" viewBox="0 0 64 64" class="ce" id="ce' + x + '">'+elementicon+'</svg>'
    );

    $("#ce" + x).css({
      left:
        (($("#rhythmcircle").height() / 2) * Math.cos(totalAngle) +
        $("#rhythmcircle").height() / 2 ) - 24 + "px",
      top:
        ($("#rhythmcircle").height() / 2) * Math.sin(totalAngle) +
        $("#rhythmcircle").height() / 2 - 24 + "px",
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


