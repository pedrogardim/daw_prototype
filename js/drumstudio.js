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

      ///WITHOUT STEP INPUT MODE
  
      if (sessiondrums[playbackMeasure][beat].includes(note) == true) {
        sessiondrums[playbackMeasure][beat] = sessiondrums[playbackMeasure][beat].filter(
          (x) => x != note
        );
      } else if (sessiondrums[playbackMeasure][beat].includes(note) == false) {
        sessiondrums[playbackMeasure][beat].push(note);
        drumSounds[note-1].start();

      }

      updateSequencerElements();
      updateMsreScroreTiles();
  }


  function adaptDrumSeqtoSubdiv(){
    sessiondrums.forEach((element,index)=>{
      var newsubdivarray = [];
      var difference = (sessionsubdivision / element.length)-1;
      element.forEach((e,i)=>{
        newsubdivarray.push(e);
        for(var x = 0; x < difference; x++){
          newsubdivarray.push([]);
        }
      });
      sessiondrums[index] = newsubdivarray;
    });
    
    updateSequencerElements();
    updateMsreScroreTiles();
    drawSequencer();

  }


  ///////////////////////////
  //PARAMETERS INPUT
  //////////////////////////
  
  //////BPM
  
  $("#bpminput").on("input", function () {
    seqbpm = $("#bpminput").val();
    Tone.Transport.bpm.rampTo(seqbpm, 0.5);
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

  
    sessiondrums[playbackMeasure].forEach(function (e, i) {
      e.forEach(function (element, index) {
        $("#seqTile-" + i + "-" + (element - 1)).toggleClass("selectedTile");
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
  
  $(document).on('click','.seqtile',function () {

    $(this).toggleClass("selectedTile");
  
    var thisid = $(this).attr("id");
    thisid = thisid.replace("seqTile-", "");
    thisid = thisid.split("-");
    var thisstep = parseInt(thisid[0]);
    var thisintrument = parseInt(thisid[1]) + 1;
  
    registerNoteToSequencer(thisintrument, thisstep);
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
    }
    
  });