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