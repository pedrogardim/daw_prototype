var stepvalues = [4,8,12,16,24,32,48];
var stepselec;
var dragtileselect = false;
var selectedonthisdrag = [];

function drawSequencer() {
    $("#stepseq").html("");
    
    for (var y = 0; y < drumSounds.length; y++) {

      var thistile = '<div class="seqrow" id="seqrow'+ y + '"></div>'
      $("#stepseq").append(thistile)

      for (var x = 0; x < sessionsubdivision; x++) {

        var thistile = '<div class="seqtile" id="seqTile-' + x + "-" + y + '"></div>'
        $("#seqrow"+y).append(thistile); 

      }

      var thisicon = '<div class="ce cestyle' + (y + 1) +'" id="seqlblel' +(y + 1) +'"></div>';
      $("#seqTile-0-"+y).append(thisicon);
  
      $("#seqlblel" + (y + 1)).css({
        transform: $("#seqlblel" + (y + 1)).css("transform") + "scale(0.9)",
      });

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

    console.log(note, beat);

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
      
      if ((sessionsubdivision - drumseq.length) == 0) return;
      
      var newsubdivarray = Array.apply([],Array(sessionsubdivision));
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
    sessionsubdivision = input;
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
  
  $(document).on('click','.seqtile',function (e) {
    //selectedonthisdrag = [];

    $(e.target).toggleClass("selectedTile");
  
    var thisid = $(e.target).attr("id");
    thisid = thisid.replace("seqTile-", "");
    thisid = thisid.split("-");
    var thisstep = parseInt(thisid[0]);
    var thisintrument = parseInt(thisid[1]) + 1;
  
    registerNoteToSequencer(thisintrument, thisstep);
  });

  //SEQTILE Drag Select

/*   $(document).on('mousedown','.seqtile',function () {

    dragtileselect = true;
  });
  $(document).on('mouseup',function () {

    dragtileselect = false;
    selectedonthisdrag = [];
  });

  $(document).on('mousemove','.seqtile',function (e) {

    var targetid = $(this).attr("id");

    if(dragtileselect && selectedonthisdrag.indexOf(targetid) == -1){

      $(this).toggleClass("selectedTile");
      
      var thisid = $(this).attr("id");
      thisid = thisid.replace("seqTile-", "");
      thisid = thisid.split("-");
      var thisstep = parseInt(thisid[0]);
      var thisintrument = parseInt(thisid[1]) + 1;
      
      registerNoteToSequencer(thisintrument, thisstep);
      selectedonthisdrag.push(targetid)
      console.log(selectedonthisdrag);
      
    }

  }); */






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
  
      //1-9
      if (e.keyCode >= 49 && e.keyCode <= 57) {
        drumSounds[e.keyCode - 49].start();
        registerNoteToSequencer(e.keyCode - 48, playbackBeat);
        return;
      }
  
      //0
      if (e.keyCode == 48) {
        drumSounds[9].start();
        registerNoteToSequencer(10, playbackBeat);
        return;
      }
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
    
  });