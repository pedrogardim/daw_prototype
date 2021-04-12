var drumkits = [
    {
        name: '808',
        type: 'Electronic',
        sampled:true,
        elemcat:[0,1,3,4,5,7,8,9,10,13],
    }
]


var drumsamplesbuffer = []

const drumelemcategory = [
  ["Kick","<circle cx=\"32\" cy=\"32\" r=\"32\" fill=\"#05386b\"/>"],
  ["Snare","<polygon points=\"8,32 32,8 56,32 32,56\" style=\"fill:#8ee4af;stroke:#379683;stroke-width:4\" />"],
  ["Side Stick","<polygon points=\"8,32 32,8 56,32 32,56\" style=\"fill:#379683;stroke:#8ee4af;stroke-width:4\" />"],
  ["Clap","<polygon points=\"8,32 32,8 56,32 32,56\" style=\"fill:#379683;stroke:#8ee4af;stroke-width:4\" />"],
  ["Hi-Hat Closed", "<line x1=\"44\" y1=\"44\" x2=\"20\" y2=\"20\" style=\"stroke:#379683;stroke-width:4\" /><line x1=\"44\" y1=\"20\" x2=\"20\" y2=\"44\" style=\"stroke:#379683;stroke-width:4\" />"],
  ["Hi-hat Open",  "<circle cx=\"32\" cy=\"32\" r=\"24\" stroke=\"#379683\" stroke-width=\"4\" fill=\"none\"/><line x1=\"48\" y1=\"48\" x2=\"16\" y2=\"16\" style=\"stroke:#379683;stroke-width:4\" /><line x1=\"48\" y1=\"16\" x2=\"16\" y2=\"48\" style=\"stroke:#379683;stroke-width:4\" />"],
  ["Hi-Hat Foot Close"],
  ["Low Tom",  "<circle cx=\"32\" cy=\"32\" r=\"26\" stroke=\"#379683\" stroke-width=\"4\" fill=\"#05386b\"/>"],
  ["Mid Tom","<circle cx=\"32\" cy=\"32\" r=\"22\" stroke=\"#379683\" stroke-width=\"4\" fill=\"#5cdb95\"/>"],
  ["High Tom","<circle cx=\"32\" cy=\"32\" r=\"20\" stroke=\"#379683\" stroke-width=\"4\" fill=\"#8ee4af\"/>"],
  ["Crash","<line x1=\"48\" y1=\"48\" x2=\"16\" y2=\"16\" style=\"stroke:#05386b;stroke-width:8\" /><line x1=\"48\" y1=\"16\" x2=\"16\" y2=\"48\" style=\"stroke:#05386b;stroke-width:8\" />"],
  ["Ride Out"],
  ["Ride Bell"],
  ["Cow Bell", "<polygon points=\"14,16 32,47 49,16\"  style=\"fill:#8ee4af;stroke:#379683;stroke-width:4\" />"],
  ["Tambourine"],
  ["Shaker"]
]





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