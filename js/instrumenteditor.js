const wavetypes = ['sine', 'sawtooth', 'triangle', 'square'];
const oscparamsbytype = {
  oscillator: ['partialCount'],
  fat: ['partialCount', 'spread'],
  pwm: ['partialCount', 'modulationFrequency'],
  pulse: ['partialCount', 'width', 'carrierType'],
  am: ['partialCount', 'harmonicity', 'modulationType'],
  fm: ['partialCount', 'harmonicity', 'modulationIndex', 'modulationType'],
};
const oscparamsrange = {
  partialCount: [1, 32],
  spread: [],
  width: [],
  modulationFrequency: [],
  carrierType: [],
  harmonicity: [],
  modulationIndex: [],
  modulationType: [],
};

var editinginstrument;

function openIntrumentEditor(instrument) {
  editinginstrument = instrument;

  var originalinstr = instrument._dummyVoice;
  var instrtype = originalinstr.name;

  var instropt = instrument._dummyVoice;

  $('.instr-tabs-item').removeClass('selectednavitem');

  //console.log(instrtype);

  if (instrtype == 'FMSynth') {
    $('.instr-tabs-item[data-type="2"]').addClass('selectednavitem');
  }
  if (instrtype == 'MonoSynth') {
    $('.instr-tabs-item[data-type="0"]').addClass('selectednavitem');
  }

  //check for each instr option:

  if ('oscillator' in instropt) {
    const init_osctype = instropt.oscillator.sourceType;
    const init_oscpartials = instropt.oscillator.partialCount;
    const init_oscwave = instropt.oscillator.baseType;

    var osctype = init_osctype;
    var oscwave = init_oscwave;
    var oscpartials = init_oscpartials;

    console.log(osctype, oscwave, oscpartials);

    $('#ie-mainosc-type option[value="' + osctype + '"]').prop(
      'selected',
      true
    );
    $('#ie-mainosc-wave option[value="' + oscwave + '"]').prop(
      'selected',
      true
    );

    $('#ie-mainosc-type').change((e) => {
      osctype = $('#ie-mainosc-type').val();
      instropt.oscillator.sourceType = osctype;
      drawWave(instrument, 'ie-mainosc-wave');
    });

    $('#ie-mainosc-wavetype').change((e) => {
      oscwave = $('#ie-mainosc-wavetype').val();
      instropt.oscillator.baseType = oscwave;

      drawWave(instrument, 'ie-mainosc-wave');
    });

    $('#ie-mainosc-params').html('');

    oscparamsbytype[osctype].forEach((e, i) => {
      $('#ie-mainosc-params').append(
        '<div class="flex-row"><span>' +
          e +
          '</span><input class="ie-osc-slider" data-param="' +
          e +
          '" min="' +
          oscparamsrange[e][0] +
          '" max="' +
          oscparamsrange[e][1] +
          '" type="range"></div>'
      );
    });

    $(document).on('input', '.ie-osc-slider', (e) => {
      console.log(editinginstrument, $(e.target).val());

      instropt.oscillator[$(e.target).data('param')] =
        originalinstr.oscillator.type[$(e.target).data('param')] = $(
          e.target
        ).val();
      drawWave(editinginstrument, 'ie-mainosc-wave');
    });

    drawWave(instrument, 'ie-mainosc-wave');
  }

  $('#intrument-editor').removeClass('hidden').addClass('visible');
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

function drawWave(instr, svgid) {
  instr._dummyVoice.oscillator.asArray(128).then((wavearray) => {
    var pathstring = 'M 0 32 ';

    for (var x = 0; x < wavearray.length; x++) {
      pathstring += 'L ' + x + ' ' + (wavearray[x] * 32 + 32) + ' ';
    }

    $('#' + svgid).html(
      '<path d="' + pathstring + '" stroke="#05386b" fill="none"/>'
    );
  });
}

$(document).on('change', '.ie-osc-slider', (e) => {
  console.log(editinginstrument, $(e.target).val());

  editinginstrument.options.oscillator[$(e.target).data('param')] =
    editinginstrument._dummyVoice.oscillator[$(e.target).data('param')] = $(
      e.target
    ).val();
  drawWave(editinginstrument, 'ie-mainosc-wave');
});
