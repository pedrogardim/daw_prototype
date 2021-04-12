var drumkits = [
    {
        name: '808',
        type: 'Electronic',
        sampled:true,
        labels:[
            "Kick",
            "Snare",
            "Clap",
            "Hihat",
            "Open Hihat",
            "Low Tom",
            "Mid Tom",
            "High Tom",
            "Crash",
            "Percussion",
        ],
        icons:[
          
        ]
    }
]


var drumsamplesbuffer = []



function loadDrums(y) {

    drumsamplesbuffer = [];

    for(var x = 0; x < 10; x++){
        drumsamplesbuffer.push(new Tone.Buffer("assets/samples/drums/"+drumkits[selecteddrums].name+"/"+(x)+".wav"));
      }

	for (var i = 0; i < 10; i++) {
	  //load 10 drum sounds, from 1.wav (kick) to 10.wav (perc)
	  drumSounds.push(
		new Tone.Player(drumsamplesbuffer[i]).toDestination()
	  );
	}
}