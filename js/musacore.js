

var sessionData = {
    "name":"Demo Song",
    "bpm":120,
    "length": 4, //in measure
    "timesignature":[4,4],
    "steps":16,
    "selecteddrums":0,
    "drumpatterns":[
      [[1],[],[4],[],[3,1],[],[4],[],[1],[],[4],[],[3,1],[],[4],[]],
      [[1],[],[4],[],[3,1],[],[4],[],[1],[],[4],[],[3,1],[],[4],[]],
      [[1],[],[4],[],[3,1],[],[4],[],[1],[],[4],[],[3,1],[],[4],[]],
      [[1],[],[4,1],[],[3,1],[],[4,1],[],[1],[1,3],[4,1],[1],[3,1],[1],[4,1],[1,3]],
    ],
    "dploop":1,
    "rhythmpatch":2,
    "chords":[
        [["E1", "E3", "E4", "G4", "B4"],1,1,[2]],
        [["C2", "C3", "D#4", "G4", "A#4", "D5"],1,2,[2,2,2]],
        [["E1", "E3", "E4", "G4", "B4"],1,3,[2,2]],
        [["B1", "B3", "D#4", "A4"],0.5,4,[2,2,2,2]],
        [["B1", "B3", "D#4", "F#4", "B4", "D#5"],0.25,4,[2,2]],
        [["B1", "B3", "D#4", "A4", "F#5"],0.25,4,[2,2]],

    ],
    "chordrhythm":[
      [1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,1],
      [1,0,0,1,0,0,0,1,1,0,1,0,0,1,1,0],
      [1,0,0,1,0,0,1,0,0,1,1,0,1,1,0,1],
      [0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1],
    ],
    "chloop":1,
    "melodies":[{
        name:"Bass",
        instrument:1,
        scale:0,
        size:4,
        notes:[{
          time: "0:0",
          note: "F3",
          dur: "4n",
          velocity: 0.9
        }, {
          time: "0:2",
          note: "G3",
          dur: "8n",
          velocity: 0.7
        
        }, {
          time: "0:3",
          note: "A3",
          dur: "8n",
          velocity: 0.7
        },  {
          time: "1:0",
          note: "E3",
          dur: "4n",
          velocity: 0.9
        }, {
          time: "1:2",
          note: "B2",
          dur: "8n",
          velocity: 0.7
        }, {
          time: "2:0",
          note: "A2",
          dur: "4n",
          velocity: 0.9
        }, {
          time: "2:1",
          note: "B2",
          dur: "4n",
          velocity: 0.9
        }, {
          time: "2:2",
          note: "C3",
          dur: "4n",
          velocity: 0.9
        }, {
          time: "2:3",
          note: "D3",
          dur: "4n",
          velocity: 0.8
        },{
          time: "3:0",
          note: "E3",
          dur: "8n",
          velocity: 0.8
        }, {
          time: "3:2",
          note: "B2",
          dur: "8n",
          velocity: 0.9
        } ]},{
          name:"Mel2",
          instrument:1,
          scale:1,
          size:4,
          notes:[{
            time: "0:0",
            note: "F3",
            dur: "4n",
            velocity: 0.9
          }, {
            time: "0:2",
            note: "G3",
            dur: "8n",
            velocity: 0.7
          
          }, {
            time: "0:3",
            note: "A3",
            dur: "8n",
            velocity: 0.7
          },  {
            time: "1:0",
            note: "E3",
            dur: "4n",
            velocity: 0.9
          }, {
            time: "1:2",
            note: "B2",
            dur: "8n",
            velocity: 0.7
          }, {
            time: "2:0",
            note: "A2",
            dur: "4n",
            velocity: 0.9
          }, {
            time: "2:1",
            note: "B2",
            dur: "4n",
            velocity: 0.9
          }, {
            time: "2:2",
            note: "C3",
            dur: "4n",
            velocity: 0.9
          }, {
            time: "2:3",
            note: "D3",
            dur: "4n",
            velocity: 0.8
          },{
            time: "3:0",
            note: "E3",
            dur: "8n",
            velocity: 0.8
          }, {
            time: "3:2",
            note: "B2",
            dur: "8n",
            velocity: 0.9
          } ]}
      ],
    //0=silece, 1=bass, 2=chord hit
}

var loadedPage;
var isPlaying = false;

var modhistory = [];
var restoreversion = 0;

var tempData = JSON.parse(JSON.stringify(sessionData));

var sessionName = tempData.name;
var sessionlength = tempData.length;
var sessionchords = tempData.chords;
var sessionrhythm = tempData.chordrhythm;
var sessionbpm = tempData.bpm;
var selecteddrums = tempData.selecteddrums;
var rhythmpatch = tempData.rhythmpatch;
var sessiondrums = tempData.drumpatterns;
var sessiontimesignature = tempData.timesignature;
var sessionmelodies = tempData.melodies;
var sessionsubdivision = tempData.steps;
var dploop = tempData.dploop;
var chloop = tempData.chloop;


var drumSounds = [];

var clipboard;


function onModifySession(){

  console.log("mod")

  var oldsessionData = JSON.parse(JSON.stringify(sessionData));

  modhistory.push(oldsessionData);

  if(modhistory.length == 20){
    modhistory.shift();
  }

  sessionData = JSON.parse(JSON.stringify(tempData));
  downloadprepared = false;
  
}

$("html").keydown(function (e) {

  //ctrl Z

  if (e.keyCode == 90  && (e.ctrlKey || e.metaKey)){

    if(modhistory.length == 0){alert("No changes to undo"); return;}

    sessionData = JSON.parse(JSON.stringify(modhistory.pop()));

    tempData = JSON.parse(JSON.stringify(sessionData));

    sessionName = tempData.name;
    sessionlength = tempData.length;
    sessionchords = tempData.chords;
    sessionrhythm = tempData.chordrhythm;
    sessionbpm = tempData.bpm;
    sessiondrums = tempData.drumpatterns;
    rhythmpatch = tempData.rhythmpatch;
    selecteddrums = tempData.selecteddrums;
    sessiontimesignature = tempData.timesignature;
    sessionmelodies = tempData.melodies;
    sessionsubdivision = tempData.steps;
    dploop = tempData.dploop;
    chloop = tempData.chloop;

    updateAll();

  }

})





