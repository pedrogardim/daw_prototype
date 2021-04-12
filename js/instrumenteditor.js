var wavetypes = ["sine","sawtooth","triangle","square"];

function openIntrumentEditor(instrument){

    var instrmonovoice = instrument._dummyVoice;

	var instrtype = instrmonovoice.name;

	$(".instr-tabs-item").removeClass("selectednavitem");

	//console.log(instrtype);

	if(instrtype == "FMSynth"){
    	$('.instr-tabs-item[data-type="2"]').addClass("selectednavitem");
	}
	if(instrtype == "MonoSynth"){
    	$('.instr-tabs-item[data-type="0"]').addClass("selectednavitem");
	}


	//check for each instr option:

	if("oscillator" in instrmonovoice){

        var osctype = instrmonovoice.oscillator._sourceType;
        console.log(osctype);
        $('#ie-mainosc-type option[value="'+osctype+'"]').prop('selected', true);
        $('#ie-mainosc-type').change((e)=>{
            instrmonovoice.oscillator._sourceType = $('#ie-mainosc-type').val();
            drawWave(instrument,"ie-mainosc-wave");

        });

        if(osctype == "oscillator"){
            $("#ie-mainosc-params").append('<input type="text" class="dial">')
        };

        $(".dial").knob({
            'min':-50,
            'max':50,
            'width':"40px",
            'height':"40px",
            'angleOffset':-140,
            'angleArc':280,
            'cursor':10,
            'thickness':".3",
            'font':'Barlow Semi Condensed", sans-serif',
            'bgColor' : "#379683",
            'fgColor':"#05386b"
        });

        drawWave(instrument,"ie-mainosc-wave");


	}




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

function drawWave(instr,svgid){

    instr._dummyVoice.oscillator.asArray(128).then((wavearray)=>{

        var pathstring = "M 0 32 ";
	
        for(var x = 0; x < wavearray.length; x++){
            pathstring += "L " + x + " " + ((wavearray[x]*32)+32) + " ";
        }
    
        $("#"+svgid).html('<path d="'+pathstring+'" stroke="#05386b" fill="none"/>');       

    });

	

}