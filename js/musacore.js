var sessionData = {
    "name":"Demo Song",
    "bpm":100,
    "length": 4, //in measure
    "timesignature":[4,4],
    "drumpatterns":[
        [[1,4],[4],[2,4],[4],[1,4],[4],[2,4],[4]],
        [[1],[1],[1],[1],[1],[1],[1],[1]],
        [[1,4],[4],[2,4],[4],[1,4],[4],[2,4],[4]],
        [[1],[1],[1],[1],[1],[1],[1],[1]],
    ],
    "dploop":1,
    "chords":[
        [["C4", "E4", "G4", "B4"],0.5,1,[2,2]],
        [["G4", "B4", "D4"],0.5,1,[2,2]],
        [["E4", "G4", "B4"],1,2,[2,2]],
        [["A4", "C4", "E4"],1,3,[2,2,2,2,2,2,2,2]],
        [["C4", "E4", "G4", "B4"],1,4,[2,2]],
    ],
    "chloop":1,
    "melodies":[{
        name:"Demo",
        instrument:simplesquerewave,
        notes:[{
          time: "0:0",
          note: "C3",
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
        },, {
          time: "3:0",
          note: "E3",
          dur: "4n",
          velocity: 0.8
        }, {
          time: "3:2",
          note: "C3",
          dur: "8n",
          velocity: 0.9
        } ]}
      ],
    //0=silece, 1=bass, 2=chord hit
}

var loadedPage;
var isPlaying = false;

var sessionName = sessionData.name;
var sessionlength = sessionData.length;
var sessionchords = sessionData.chords;
var sessionrhythms = sessionData.rhythm;
var sessionbpm = sessionData.bpm;
var sessiondrums = sessionData.drumpatterns;
var sessiontimesignature = sessionData.timesignature;
var sessionmelodies = sessionData.melodies;

var sessionsubdivision = 8;

var dploop = sessionData.dploop;
var chloop = sessionData.chloop;

var drumSounds = [];




