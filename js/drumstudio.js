var stepvalues = [4,8,12,16,24,32,48];
var stepselec;
var dragtileselect = false;
var drumview = 0;
var seldrumkit = drumkits[selecteddrums];



///////////////////////////
//INTERNAL NAV
//////////////////////////

$("#toggleseq").click((e)=>{
  if (drumview == 0){
    $("#drumpage").animate({bottom:"100%"});
    $("#drumseqpage").animate({bottom:"0%"}).removeClass("hidden");
    drumview = 1;
    $("#toggleseq").css({transform:'rotate(-90deg)'})
    return;
  }
  if (drumview == 1){
    $("#drumpage").animate({bottom:"0%"}).removeClass("hidden");
    $("#drumseqpage").animate({bottom:"-100%"});
    
    drumview = 0
    $("#toggleseq").css({transform:'rotate(90deg)'})

    return;
  }

});

$("#drumseqpage").css({bottom:"-100%"});


///////////////////////////
//KEYS
//////////////////////////

var drumtriggers = ["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];

function drawDrumKeys(){
  var drumkeys = "";
  drumSounds.forEach((e,i)=>{

    var thislabel = (seldrumkit.hasOwnProperty('labels'))?(seldrumkit.labels[i]):(drumelemcategory[seldrumkit.elemcat[i]][0]);
    var thisicon = (seldrumkit.hasOwnProperty('icons'))?(seldrumkit.icons[i]):(drumelemcategory[seldrumkit.elemcat[i]][1])

    drumkeys += 
    '<div class="drumkey" data-index="'+i+'" data-trigger="'+drumtriggers[1]+'">'+
    '<span class="dk-lbl">'+thislabel+'</span>'+
    '<svg height="48px" width="48px" viewBox="0 0 64 64">'+thisicon+'</svg>'+
    '<span class="triggerkeylbl">'+
    drumtriggers[i]+
    '</span></div>';

  })
  $("#drumkeyscont").html(drumkeys)
}


function playDrumSound(keycodetoindex){

  if(keycodetoindex < drumSounds.length){
    if(drumview == 1){
      registerNoteToSequencer(keycodetoindex+1, playbackBeat); 
      return
    };
    drumSounds[keycodetoindex].start();
    $('.drumkey[data-index="'+keycodetoindex+'"]').css("background-color","var(--medium-color)")
   
  } 



}

///////////////////////////
//SEQUENCER
//////////////////////////

function drawSequencer() {
    $("#stepseq").html("");
    
    for (var y = 0; y < drumSounds.length; y++) {

      var thistile = '<div class="seqrow" id="seqrow'+ y + '"></div>'
      $("#stepseq").append(thistile)

      for (var x = 0; x < sessionsubdivision; x++) {

        var thistile = '<div class="seqtile" id="seqTile-' + x + "-" + y + '"></div>'
        $("#seqrow"+y).append(thistile); 

      }

      var elementicon = (seldrumkit.hasOwnProperty('icons'))?(seldrumkit.icons[y]):(drumelemcategory[seldrumkit.elemcat[y]][1]);

      var thisicon = '<svg height="40px" width="40px" viewBox="0 0 64 64" class="ce" id="seqlblel' +(y + 1) +'">'+elementicon+'</svg>';

      $("#seqTile-0-"+y).append(thisicon);

      var instrlabel = '<span class="seqlbl hidden" id="seqlbl' +(y + 1) +'">'+drumlabels[y] +"</span>"
      $("#seqTile-0-"+y).append(instrlabel);

    }

    $("#seq-steps-input").html("");

    stepvalues.forEach((e)=>{
      $("#seq-steps-input").append('<option value="'+e+'">'+e+'</option>')
    })

    $("#seq-steps-input").val(sessionsubdivision)

    updateSequencerElements();
  }
  
function updateMsreScroreTiles(){
  var existentnotesonsession = [];
sessiondrums.forEach((msre,msreindex)=>{
 msre.forEach((a)=>{a.forEach((b)=>{if(existentnotesonsession.indexOf(b) == -1){existentnotesonsession.push(b)}})});
});
existentnotesonsession.sort((a, b) => a - b);

sessiondrums.forEach((msre,msreindex)=>{
  $('#drummeasure'+(msreindex+1)).html("");
  
  existentnotesonsession.forEach((note,noteindex)=>{
    
    var thisrow = '<div class="drummsrerow" style="order:'+note+'" id="drummsrerow-'+msreindex+"-"+note+'"></div>';
    $('#drummeasure'+(msreindex+1)).append(thisrow);
    msre.forEach((beat,beatindex)=>{
        var thistile = '<div class="drummsretile" id="mt'+msreindex+'-'+beatindex+'-'+note+'"></div>';
        $('#drummsrerow-'+msreindex+"-"+(note)).append(thistile);
        if(beat.indexOf(note)!=-1){
          $("#mt"+msreindex+'-'+beatindex+'-'+note).addClass("activetile");
        }
      
      });
  });
});
};


  
  ///////////////////////////
  //SEQUENCER INPUT
  //////////////////////////
  
  function registerNoteToSequencer(note, beat) {

    console.log(note,beat)

      ///WITHOUT STEP INPUT MODE  
      if (sessiondrums[playbackMeasure][beat].includes(note) == true) {
        sessiondrums[playbackMeasure][beat] = sessiondrums[playbackMeasure][beat].filter(
          (e) => e != note
        );
      } else if (sessiondrums[playbackMeasure][beat].includes(note) == false) {
        sessiondrums[playbackMeasure][beat].push(note);
        drumSounds[note-1].start();

      }

      updateSequencerElements();
      updateMsreScroreTiles();
      onModifySession();
  }

  function adaptDrumSeqtoSubdiv(){

    sessiondrums.forEach((drumseq,index)=>{

      var difference = sessionsubdivision / drumseq.length;

      var newsubdivarray = [];

      //POSSIBLE SCENARIOS:

      //no difference
      
      if (difference == 1) return;

      //difference is greater than double, insert silences between beats

      else if (difference % 2 == 0 || difference % 3 == 0){ 

        for(var x = 0; x < drumseq.length; x++){
          newsubdivarray.push(drumseq[x]);
          for(var y = 0; y < (difference-1); y++){
            newsubdivarray.push([]);
          }
        }
      }

      //difference is positive, but less than double, insert silences in some intervals

      else if (difference > 1 && difference < 2){ 

        for(var x = 0; x < drumseq.length; x++){
            newsubdivarray.push(drumseq[x]);
            if(x%((difference*2)-1) == 1){
              newsubdivarray.push([]);
            }
        }
      }

      else if (difference < 1){ 

        for(var x = 0; x < sessionsubdivision; x++){
            newsubdivarray.push(drumseq[x/difference]);
        }
      }

      sessiondrums[index] = newsubdivarray;
      return;
    
    
      
      //var dif = sessionsubdivision/(sessionsubdivision-drumseq.length);
      //console.log(dif)
      
      for(var x = 0; x < sessionsubdivision; x++){

        newsubdivarray[x] = drumseq[x%drumseq.length];
      
      }

      sessiondrums[index] = newsubdivarray;

      //console.log(sessionsubdivision,sessiondrums[index].length,difference)

    });

    updateMsreScroreTiles();
    drawSequencer();
    updateSequencerElements();

  }

  function updateSteps(input){
    sessionsubdivision = tempData.steps = input;
    adaptDrumSeqtoSubdiv();


  }
  ///////////////////////////
  //PARAMETERS INPUT
  //////////////////////////
  
  //////STEPS

  $("#seq-steps-input").on("change", function (e) {

    var goal = $(this).val();
    var closest = stepvalues.reduce((prev, curr) => {return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev)});
    stepselec = stepvalues.indexOf(closest);
    
    updateSteps(goal);
    $(this).val(goal);
    onModifySession();

  });





  
  ///////////////////////////
  //UPDATE ELEMENTS
  //////////////////////////
  
  function updateSeqCursor() {
    //update cursor, changing the class on the current bear tile column
  
    $(".seqtile").removeClass("seqcursor");
  
    for (var y = 0; y < drumSounds.length; y++) {
      $("#seqTile-" + (playbackBeat) + "-" + y).toggleClass("seqcursor");
    }
  }
  
  function updateTiles() {
    $(".seqtile").removeClass("selectedTile");

  
    sessiondrums[playbackMeasure].forEach(function (beat, btindex) {
      beat.forEach(function (element, index) {
        $("#seqTile-" + btindex + "-" + (element - 1)).toggleClass("selectedTile");
      });
    });
  }
  
  function updateSequencerElements() {
    updateSeqCursor();
    updateTiles();
    $(".circlebutton").html(playbackBeat);
    $(".drummeasure").removeClass("hightlightedmeasure").css("filter","none");
    $("#drummeasure"+(playbackMeasure+1)).addClass("hightlightedmeasure").css("filter","brightness(1.2)");
    //when update sequencer, also update circle
    drawCircleElements();


  }

  //////////////////////////
  //EVENTS
  //////////////////////////
  
  
  //SEQ TILE CLICK
  
  //$(document).on('click','.seqtile',function (e) {
//
  //  $(e.target).toggleClass("selectedTile");
  //
  //  var thisid = $(e.target).attr("id");
  //  thisid = thisid.replace("seqTile-", "");
  //  thisid = thisid.split("-");
  //  var thisstep = parseInt(thisid[0]);
  //  var thisintrument = parseInt(thisid[1]) + 1;
  //
  //  registerNoteToSequencer(thisintrument, thisstep);
  //});

  //SEQTILE Drag Select

   $(document).on('mousedown','.seqtile',function () {

    var targetid = $(this).attr("id");

    dragtileselect = true;
    ($(this).hasClass("selectedTile"))?(dtsmode = "remove"):(dtsmode = "add");
    $(this).toggleClass("selectedTile");
      
      var thisid = $(this).attr("id");
      thisid = thisid.replace("seqTile-", "");
      thisid = thisid.split("-");
      var thisstep = parseInt(thisid[0]);
      var thisintrument = parseInt(thisid[1]) + 1;
      
      registerNoteToSequencer(thisintrument, thisstep);

  });
  $(document).on('mouseup',function () {

    dragtileselect = false;
  });

  $(document).on('mousemove','.seqtile',function (e) {

    var targetid = $(this).attr("id");

    if(dragtileselect){

      if(($(this).hasClass("selectedTile") && dtsmode == "remove")||($(this).hasClass("selectedTile") == false && dtsmode == "add")){

      $(this).toggleClass("selectedTile");
      
      var thisid = $(this).attr("id");
      thisid = thisid.replace("seqTile-", "");
      thisid = thisid.split("-");
      var thisstep = parseInt(thisid[0]);
      var thisintrument = parseInt(thisid[1]) + 1;
      
      registerNoteToSequencer(thisintrument, thisstep);

      }

    }

  }); 


  ///CLICK
  $(document).on('mousedown','.drumkey',function (e) {

    playDrumSound($(this).data("index"));
  

  });

  $(document).on('mouseup',function (e) {

    $('.drumkey').css("background-color","")

  

  });


  //MEASURE CLICK

  $(document).on('click','.drummeasure',function (e) {
    var measureclicked = $(e.target).parent().parent().attr("id").replace("drummeasure", "");
    if(isPlaying==true){stopPlayback()};
    playbackMeasure = measureclicked-1;
    sessionchords.forEach((e,i)=>{
      if(e[2] == measureclicked){playbackChord = i}
    });
    updateSequencerElements();
  });


  $(".ce").hover(function () {
    $(".seqlbl").removeClass("hidden").addClass("visible");

    }, function () {
      $(".seqlbl").removeClass("visible").addClass("hidden");

    }
  );
  
  //////////////////////////
  //KEYBOARD EVENTS
  //////////////////////////
  
  ////////KEYDOWN/////////////
$("html").keydown(function (e) {
    //ONLY TRIGGER WHEN PAGE LOADED
  
    if(appMode == 2){

      var keycodetoindex = drumtriggers.indexOf(String.fromCharCode(e.keyCode));
      $('.drumkey[data-index="'+keycodetoindex+'"]').css("background-color","var(--bright-color)")

      //1-9
      if (keycodetoindex != -1 && e.ctrlKey == false && e.metaKey == false && checkForSelInput()) {
        playDrumSound(keycodetoindex);
        return;
      }

      //only on sequencer page

      if(drumview == 1){

      
      //L & R ARROWS
        if (e.keyCode == 37 || e.keyCode == 39) {
          if (e.keyCode == 37 && playbackBeat > 0){playbackBeat--;}
          else if (e.keyCode == 37 && playbackBeat == 0 && playbackMeasure > 0){playbackMeasure--; playbackBeat = sessiondrums[playbackMeasure].length-1;}
          else if (e.keyCode == 39 && playbackBeat < sessiondrums[playbackMeasure].length-1){playbackBeat++;}
          else if (e.keyCode == 39 && playbackBeat == sessiondrums[playbackMeasure].length-1 && playbackMeasure < sessiondrums.length-1){playbackMeasure++; playbackBeat=0;}
          if (isPlaying == true){stopPlayback();}
          sessiondrums[playbackMeasure][playbackBeat].forEach((element) =>
            drumSounds[element - 1].start()
          );
          updateSequencerElements();
          //$("#stepindicator").html(playbackBeat);
        }
        //SHIFT / STEP INPUT MODE ON
        if (e.keyCode == 16) {
          //e.preventDefault();
          //stop();
          //stepInputOn();
        }

        if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)){
          //Ctrl + C / Cmd + C
          e.preventDefault();
          navigator.clipboard.writeText(JSON.stringify([0,sessiondrums[playbackMeasure]]));

        }
        if (e.keyCode == 86 && (e.ctrlKey || e.metaKey)){
         //Ctrl + V / Cmd + V
          e.preventDefault();
          navigator.clipboard.readText().then((value)=>{
          try{var copiedmsre = JSON.parse(value)}
          catch(err){alert("Oops.. Make sure you are trying to paste a drum pattern");return}

            if(copiedmsre[0] == 0 && copiedmsre[1] != sessiondrums[playbackMeasure]){
              sessiondrums[playbackMeasure] = copiedmsre[1];
              updateSequencerElements();
              updateMsreScroreTiles();
            }
          })

        }

      }
    }
    
  });

  $("html").keyup(function (e) {
    //ONLY TRIGGER WHEN PAGE LOADED
  
    if(appMode == 2){

      var keycodetoindex = drumtriggers.indexOf(String.fromCharCode(e.keyCode));
      $('.drumkey[data-index="'+keycodetoindex+'"]').css("background-color","")


    }
    
  });