//in case the instrument is sampled, for offline

var rhythminstrumentbuffers;

//==============================================

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
				"baseType": "sine",
				"partialCount":8
			},
			"envelope": {
				"attack": 0.01,
				"decay": 0.0,
				"sustain": 1,
				"release": 0.01
			},
			"filter" : {
				"frequency" : 1000,
				"gain": 0
			},
			"filterEnvelope" : {
				"attack": 0,
				"decay": 0,
				"sustain": 1,
				"release": 0
			},
			"portamento":0,
		}
	},
	{
		name: "Grand Piano",
		base: "Sampler",
		type: 2,
		gain: -18,
		urls: {
			"68": "Ab4.wav",
			"51": "Eb3.wav",
			"75": "Eb5.wav",
			"43": "G2.wav",
			"85": "Db6.wav",
			"32": "C2.wav",
			"71": "B4.wav",
			"54": "Gb3.wav",
			"62": "D4.wav",
			"40": "E2.wav"
		},
		options:{
			
			"baseUrl": "assets/samples/instruments/piano1/",
		},
		asdr:[0,0]
	},

];


function instrumentContructor(input){
	
	var instr;
	var patch = instruments[input];

	if(patch.base == "Sampler"){

				
		instr = new Tone.Sampler().toDestination()
		instr._buffers = rhythminstrumentbuffers;

		//instr = new Tone.Sampler(patch.urls,patch.options).toDestination()
		instr.attack = patch.asdr[0];
		instr.release = patch.asdr[1];

	}
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

