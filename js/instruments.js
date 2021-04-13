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
				"sourceType":"oscillator",
				"baseType": "square",
				"partialCount":10
			},
			"envelope": {
				"attack": 0.03,
				"decay": 0.3,
				"sustain": 0.7,
				"release": 0.1
			},
			"filter" : {
				  "frequency" : 1000,
				"gain": 0
			},
			"filterEnvelope" : {
				"attack": 0,
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

function loadMelodyInstruments(){

	sessionmelodies.forEach((e,i)=>{
		melodyinstruments.push(instrumentContructor(e.instrument));
	  });
}

