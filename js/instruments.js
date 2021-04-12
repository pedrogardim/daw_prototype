const instrPiano1 = new Tone.Sampler({
	urls: {
		"Ab4": "Ab4.wav",
        "Eb3": "Eb3.wav",
		"Eb5": "Eb5.wav",
		"G2": "G2.wav",
		"Db6": "Db6.wav",
		"C2": "C2.wav",
		"B4": "B4.wav",
		"Gb3": "Gb3.wav",
		"D4": "D4.wav",
        "E2": "E2.wav"


	},
	baseUrl: "assets/samples/instruments/piano1/",
	onload: () => {
	}
}).toDestination();

instrPiano1.volume.value = -12;
instrPiano1.release = 0.4;

//==============================================


//const instrOrgan1 = new Tone.Sampler({
//	urls: {
//		"C1": "C1.wav",
//        "C2": "C2.wav",
//		"C3": "C3.wav",
//		"C4": "C4.wav",
//		"C5": "C5.wav",
//		"C6": "C6.wav",
//		"C7": "C7.wav",
//	},
//	baseUrl: "assets/samples/instruments/organ1/",
//	onload: () => {
//	}
//}).toDestination();
//
//instrOrgan1.volume.value = -12;
//
////==============================================
//
//
//const instrEp1 = new Tone.Sampler({
//	urls: {
//		"C1": "C1.wav",
//        "C2": "C2.wav",
//		"C3": "C3.wav",
//		"C4": "C4.wav",
//		"C5": "C5.wav",
//		"C6": "C6.wav",
//		"C7": "C7.wav",
//	},
//	baseUrl: "assets/samples/instruments/ep1/",
//	onload: () => {
//	}
//}).toDestination();
//
//instrEp1.volume.value = -12;

const instrmusaepiano = new Tone.PolySynth(Tone.FMSynth,
	{
	"harmonicity":50,
	"modulationIndex": 20,
	"oscillator" : {
		"type": "sine2"
	},
	"envelope": {
		"attack": 0.001,
		"decay": 2,
		"sustain": 0.0,
		"release": 0.2,
	},
	"modulation" : {
		"type" : "sine"
	},
	"modulationEnvelope" : {
		"attack": 0.001,
		"decay": 0.5,
		"sustain": 0,
		"release": 0.0,
	}
} ).toDestination();

instrmusaepiano.volume.value = -6;

const tremolo = new Tone.Tremolo(4, 0.7).toDestination().start();
instrmusaepiano.connect(tremolo);

//instrmusaepiano.connect(phaser);




const instrcategories = ["Drums", "Keys", "Synth"];

const instruments = [
	{
	name: "Musa Electric Piano",
	base: "FM",
	categ: 1,
	gain: -6,
	options:{
		"harmonicity":50,
		"modulationIndex": 20,
		"oscillator" : {
			"type": "sine2"
		},
		"envelope": {
			"attack": 0.001,
			"decay": 2,
			"sustain": 0.0,
			"release": 0.2,
		},
		"modulation" : {
			"type" : "sine"
		},
		"modulationEnvelope" : {
			"attack": 0.001,
			"decay": 0.5,
			"sustain": 0,
			"release": 0.0,
		}
		}
	},
	{
		name: "Square Lead",
		base: "AM",
		categ: 2,
		gain: -16,
		options:{
			"harmonicity": 3.999,
			"oscillator": {
				"type": "square"
			},
			"envelope": {
				"attack": 0.03,
				"decay": 0.3,
				"sustain": 0.7,
				"release": 0.1
			},
			"modulation" : {
				  "volume" : 12,
				"type": "square6"
			},
			"modulationEnvelope" : {
				"attack": 2,
				"decay": 3,
				"sustain": 0.8,
				"release": 0.1
			}
		}
		
	},
	{
		name: "MonoDemo",
		base: "Synth",
		type: 2,
		gain: -12,
		options:{
			"oscillator": {
				"type": "sawtooth8"
			},
			"envelope": {
				"attack": 0.03,
				"decay": 0.3,
				"sustain": 0.7,
				"release": 0.1
			},
			"filter" : {
				  "frequency" : 1000,
				"gain": -12
			},
			"filterEnvelope" : {
				"attack": 2,
				"decay": 3,
				"sustain": 0.8,
				"release": 0.1
			},
			"portamento":0.4,
		}
		
		},

];


function instrumentContructor(input){
	
	var instr;
	var patch = instruments[input];

	
	if(patch.base == "FM"){
		instr = new Tone.PolySynth(Tone.FMSynth,patch.options).toDestination()
	}
	if(patch.base == "AM"){
		instr = new Tone.PolySynth(Tone.AMSynth,patch.options).toDestination();
	}
	if(patch.base == "Synth"){
		instr = new Tone.PolySynth(Tone.MonoSynth,patch.options).toDestination();
	}

	instr.volume.value = patch.gain;

	return instr;

}

function openIntrumentEditor(intrument){

	var instrtype = intrument._dummyVoice.name;

	$(".instr-tabs-item").removeClass("selectednavitem");

	//console.log(instrtype);

	if(instrtype == "FMSynth"){
    	$('.instr-tabs-item[data-type="2"]').addClass("selectednavitem");
	}
	if(instrtype == "MonoSynth"){
    	$('.instr-tabs-item[data-type="0"]').addClass("selectednavitem");
	}

	var instropt = intrument.options

	console.log(intrument.options);

	//check for each instr option:

	if("oscillator" in instropt){
		$("#ie-osc").append('<div class="ie-subcont" id="ie-mainosc"></div>');
		$("#ie-mainosc").append('<svg width="128px" height="64px" viewBow="0 0 128 64" id="ie-mainosc-wave"></svg>')
		
	}

	intrument._dummyVoice.oscillator.asArray(128).then((r)=>{drawWave(r,"ie-mainosc-wave")});


	$("#intrument-editor").removeClass("hidden").addClass("visible");



}

/*
function drawWave(wavearray,id){

	var canvas = document.getElementById(id);
	var ctx = canvas.getContext("2d")
	ctx.beginPath();
	ctx.moveTo(0, 39);
	for(var x = 0; x < wavearray.length; x++){
		ctx.lineTo(x,(wavearray[x]*39)+39);
	}
	ctx.stroke();

}
*/

function drawWave(wavearray,svgid){

	var pathstring = "M 0 32 ";
	
	for(var x = 0; x < wavearray.length; x++){
		pathstring += "L " + x + " " + ((wavearray[x]*32)+32) + " ";
	}

	$("#"+svgid).html('<path d="'+pathstring+'" stroke="#05386b" fill="none"/>');
	

}