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


const instrOrgan1 = new Tone.Sampler({
	urls: {
		"C1": "C1.wav",
        "C2": "C2.wav",
		"C3": "C3.wav",
		"C4": "C4.wav",
		"C5": "C5.wav",
		"C6": "C6.wav",
		"C7": "C7.wav",
	},
	baseUrl: "assets/samples/instruments/organ1/",
	onload: () => {
	}
}).toDestination();

instrOrgan1.volume.value = -12;

//==============================================


const instrEp1 = new Tone.Sampler({
	urls: {
		"C1": "C1.wav",
        "C2": "C2.wav",
		"C3": "C3.wav",
		"C4": "C4.wav",
		"C5": "C5.wav",
		"C6": "C6.wav",
		"C7": "C7.wav",
	},
	baseUrl: "assets/samples/instruments/ep1/",
	onload: () => {
	}
}).toDestination();

instrEp1.volume.value = -12;

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

const simplesquerewave = new Tone.PolySynth(Tone.AmSynth,
	{
		"harmonicity": 3.999,
		"oscillator": {
			"type": "sawtooth"
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
	} ).toDestination();

	simplesquerewave.volume.value = -24;


function loadDrums(y) {
	for (var i = 0; i < 10; i++) {
	  //load 10 drum sounds, from 1.wav (kick) to 10.wav (perc)
	  drumSounds.push(
		new Tone.Player("assets/samples/drums/" + y + "/" + (i + 1) + ".wav")
		  .toDestination()
		  .connect(Tone.Master)
	  );
	
	}
}

