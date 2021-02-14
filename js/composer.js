//░█████╗░░█████╗░███╗░░░███╗██████╗░░█████╗░░██████╗███████╗██████╗░
//██╔══██╗██╔══██╗████╗░████║██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗
//██║░░╚═╝██║░░██║██╔████╔██║██████╔╝██║░░██║╚█████╗░█████╗░░██████╔╝
//██║░░██╗██║░░██║██║╚██╔╝██║██╔═══╝░██║░░██║░╚═══██╗██╔══╝░░██╔══██╗
//╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░░░░░╚█████╔╝██████╔╝███████╗██║░░██║
//░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░░╚════╝░╚═════╝░╚══════╝╚═╝░░╚═╝

//////////////////////////
//VARIABLES
//////////////////////////

var sessionName = sessionData.name;
var sessionParts = sessionData.parts;
var playbackPart = 1;
var playbackMeasure = 1;
var playbackBeat = 1;
var editmode = false;


//all necesaries functions to load sequencer page

function composerSetup() {
    drawScore();
  
}


function drawScore(){

    var line = 1;

    sessionParts.forEach(function(element, index) {
        
        element.measures.forEach(function(el, i) {
    
          var counter = i + 1;
          var sheetline = '<div class="line" id="line' + line + '" style="top:' + (80 * (line - 1)) + 'px"></div>';
          var measure = '<div class="line" id="line' + counter + '"></div>';
    
          if (counter % 4 == 1) {
            $("#score").append(sheetline);
            console.log(line , "████████");
            line++;
          }

          console.log($("#line"+line).height());
          $("#line"+line).append(measure);
          
        });
      });

}

if (editmode==false){
    
}
