var pianorollzoomX = 1;
var pianorollzoomY = 1;
var selectedmelody = 0;
var selectednote;
var noterange = 97;
var pr_rows = 24;
var octavestodraw = 8;
var scrolllevels = noterange - pr_rows;
var mldysize = sessionmelodies[selectedmelody].size;
var mldyscale = scales[sessionmelodies[selectedmelody].scale];
var root = 'C1';
var harmscale = Tone.Frequency(root).harmonize(mldyscale[0]);
var mldyscalelength = mldyscale[0].length;

var prrange;
var bottomnote = 40;

var prscale = 1;

function showMelodyList() {
  $('#melodylist').html('');

  var addbutton = '<span class="material-icons">add_circle</span>';

  sessionmelodies.forEach((e, i) => {
    $('#melodylist').append(melodyListItem(e, i));
    drawNotesPreview(e, i);
  });

  $('#melodylist').append(addbutton);
  updateMelodyPreview();
}

function melodyListItem(element, index) {
  var thisdiv =
    '<div class="melodylistitem data-index="' +
    index +
    '">' +
    '<div class="melodyinfo"><h3>' +
    element.name +
    '</h3><h5>' +
    instruments[element.instrument].name +
    '</h5></div>' +
    '<div class="melodypreview" data-index="' +
    index +
    '"></div>' +
    '<div class="melodyactions">' +
    '<span class="material-icons m-play" data-index="' +
    index +
    '">play_arrow</span>' +
    '<span class="material-icons m-edit" data-index="' +
    index +
    '">edit</span>' +
    '<span class="material-icons m-remove" data-index="' +
    index +
    '">delete</span>' +
    '</div>' +
    '</div>';

  return thisdiv;
}

function drawNotesPreview(melody, melodyindex) {
  var thisnotes = melody.notes;
  var minmaxnotes = [];
  var minnote, maxnote;

  thisnotes.forEach((e, i) => {
    minmaxnotes.push(Tone.Frequency(e.note).toMidi());
  });
  minmaxnotes.sort((a, b) => a - b);
  minmaxnotes = [...new Set(minmaxnotes)];

  minnote = minmaxnotes[0];
  maxnote = minmaxnotes[minmaxnotes.length - 1];

  thisnotes.forEach((note, noteindex) => {
    var thisnote =
      '<div class="preview-note pn' +
      melodyindex +
      '" data-index="' +
      noteindex +
      '"></div>';
    $(".melodypreview[data-index='" + melodyindex + "']").append(thisnote);
    var thisH = $('.melodypreview').height();
    var thisW = $('.melodypreview').width();

    $('.pn' + melodyindex + "[data-index='" + noteindex + "']").css({
      height: (thisH / minmaxnotes.length) * 0.8,
      width:
        (Tone.Time(note.dur).toSeconds() /
          (Tone.Time('1m').toSeconds() * mldysize)) *
        thisW,
      left:
        (Tone.Time(note.time).toSeconds() /
          (Tone.Time('1m').toSeconds() * mldysize)) *
        thisW,
      top:
        (thisH / minmaxnotes.length) *
        (maxnote - Tone.Frequency(note.note).toMidi()),
      'margin-top':
        (thisH / minmaxnotes.length) * 0.25 -
        ((thisH / minmaxnotes.length) *
          (maxnote - Tone.Frequency(note.note).toMidi())) /
          2,
    });
  });
}

function updateMelodyPreview() {
  $('.melodypreview').html('');
  sessionmelodies.forEach((melody, melodyindex) => {
    drawNotesPreview(melody, melodyindex);
  });
}

// ----------------------------------------------------------------
// DRAW PIANO ROLL
// ----------------------------------------------------------------

function drawPianoRoll() {
  $('#pianorollkeys').html('');
  $('#pianorollgrid').html('');

  for (var x = -1; x < mldyscalelength * 8; x++) {
    var blackkey = false;
    var thisrownote =
      Tone.Frequency(harmscale[x % mldyscalelength])
        .toNote()
        .replace(/[0-9]/g, '') + Math.floor(x / mldyscalelength + 1);
    var thisabsnote = thisrownote.replace(/[0-9]/g, '');

    if (
      thisabsnote == 'C#' ||
      thisabsnote == 'D#' ||
      thisabsnote == 'F#' ||
      thisabsnote == 'G#' ||
      thisabsnote == 'A#'
    ) {
      blackkey = true;
    }
    if (x != -1) {
      $('#pianorollkeys').append(
        '<div id="prkey' +
          x +
          '" class="prkey ' +
          (blackkey ? 'prblack' : '') +
          '">' +
          thisrownote +
          '</div>'
      );
      $('#pianorollgrid').append(
        '<div id="' +
          'prrow' +
          x +
          '" class="prrow ' +
          (blackkey ? 'prblack' : '') +
          '"></div>'
      );
    }

    for (var z = 0; z < (mldysize * sessionsubdivision) / 2; z++) {
      if (x == -1) {
        $('#prheader').append(
          '<div id="prtile' + x + '-' + z + '" class="prtile"></div>'
        );
      } else {
        $('#prrow' + x).append(
          '<div id="prtile' + x + '-' + z + '" class="prtile"></div>'
        );
      }
      if (z % (sessionsubdivision / 2) == 0 && z != 0) {
        $('#prtile' + x + '-' + z).css('border-left', 'solid 2px #1f554a');
      }
    }
  }

  //$("#prcont").scrollTop(0);

  var thisnotes = [];

  sessionmelodies[selectedmelody].notes.forEach((e, i) => {
    addNote(e, i);
    thisnotes.push(Tone.Frequency(e.note).toFrequency());
  });

  var highestnoteoffset =
    $(
      '.prkey:contains("' +
        Tone.Frequency(Math.max.apply(Math, thisnotes)).toNote() +
        '")'
    ).position().top - 20;

  $('#prcont').scrollTop(highestnoteoffset);
}

// ----------------------------------------------------------------
// ADD NOTE
// ----------------------------------------------------------------

function addNote(notetoadd, noteindex) {
  var i = noteindex == undefined ? $('.note').toArray().length : noteindex;

  var thisnote = Tone.Frequency(notetoadd.note).toNote();

  $('#pianorollgrid').append(
    '<div class="note" id="note' + i + '">' + notetoadd.note + '</div>'
  );

  if ($('.prkey:contains("' + thisnote + '")').offset().top === undefined) {
    return;
  }

  var thispos = $('.prkey:contains("' + thisnote + '")').position().top;

  $('#note' + i).css({
    top: thispos,
    height: $('#prrow0').height() - 1,
    width: PRTimeToPixels(notetoadd.dur),
    left: PRTimeToPixels(notetoadd.time),
  });
  $('#note' + i).draggable({
    grid: [1, $('#prrow0').height()],
    containment: 'parent',
    drag: function (event, ui) {
      melodyinstruments[
        sessionmelodies[selectedmelody].instrument
      ].triggerRelease();
    },
    stop: function (event, ui) {
      var newnote, newtop;

      $('.prkey')
        .toArray()
        .forEach((e, i) => {
          if (Math.abs($(e).offset().top - ui.offset.top) < 5) {
            newnote = $(e).html();
            newtop = $(e).position().top + 1;
          }
        });

      var newnotemidi =
        Math.floor(
          ($('#pianorollgrid').height() - ui.position.top) /
            $('#prrow0').height()
        ) +
        24 -
        1;
      //console.log(Tone.Frequency(newnotemidi,"midi").toNote());
      sessionmelodies[selectedmelody].notes[selectednote].note = newnote;
      sessionmelodies[selectedmelody].notes[selectednote].time = PRPixelsToTime(
        ui.position.left
      );
      $(event.target).html(newnote);
      ui.position.top = newtop;
      updateMelodyPreview();
      onModifySession();
    },
  });
  $('#note' + i).resizable({
    grid: [1, 9999999],
    handles: 'e',
    disabled: true,
    stop: function (event, ui) {
      sessionmelodies[selectedmelody].notes[selectednote].dur = PRPixelsToTime(
        ui.size.width
      );
      updateMelodyPreview();
      onModifySession();
    },
  });

  updateMelodyPreview();

  //console.log($(".note").toArray().length);
}

function adjustNotesPos() {
  for (var x = 0; x < $('.note').toArray().length; x++) {
    var thisnote = sessionmelodies[selectedmelody].notes[x];
    $('#note' + x).css({
      width: PRTimeToPixels(thisnote.dur),
      left: PRTimeToPixels(thisnote.time),
    });
  }
}

function PRTimeToPixels(input) {
  return (
    ((Tone.Time(input).toSeconds() / Tone.Time('1m').toSeconds()) *
      $('#pianorollgrid').width()) /
    mldysize
  );
}

function PRPixelsToTime(input) {
  return (
    (input / $('#pianorollgrid').width()) *
    Tone.Time('1m').toSeconds() *
    mldysize
  );
}

////////////////////////////////////////////////////////////////
//EVENTS
////////////////////////////////

$(document).on('mousedown', '.note', (e) => {
  if (
    $(e.target).hasClass('note') &&
    e.target.id.replace('note', '') != selectednote
  ) {
    melodyinstruments[
      sessionmelodies[selectedmelody].instrument
    ].triggerRelease();
    $('#note' + selectednote)
      .removeClass('activenote')
      .resizable('option', 'disabled', true);
    selectednote = e.target.id.replace('note', '');
    $('#note' + selectednote)
      .addClass('activenote')
      .resizable('option', 'disabled', false);
    melodyinstruments[
      sessionmelodies[selectedmelody].instrument
    ].triggerAttackRelease(
      sessionmelodies[selectedmelody].notes[selectednote].note,
      sessionmelodies[selectedmelody].notes[selectednote].dur
    );
  }
});

$(document).on('mousedown', '.prkey', (e) => {
  melodyinstruments[
    sessionmelodies[selectedmelody].instrument
  ].triggerAttackRelease($(e.target).html(), '1m');
});

$(document).on('mouseup', '.prkey', (e) => {
  melodyinstruments[sessionmelodies[selectedmelody].instrument].triggerRelease(
    $(e.target).html()
  );
});

$(document).on('click', '.m-edit', (e) => {
  var newmelody = $(e.target).data('index');
  selectedmelody = newmelody;

  mldysize = sessionmelodies[selectedmelody].size;
  mldyscale = scales[sessionmelodies[selectedmelody].scale];
  harmscale = Tone.Frequency(root).harmonize(mldyscale[0]);
  mldyscalelength = mldyscale[0].length;
  drawPianoRoll();
  $('#melodyeditcont').removeClass('hidden').addClass('visible');
});

$('#pr-close').on('click', (e) => {
  $('#melodyeditcont').removeClass('visible').addClass('hidden');
  updateMelodyPreview();
});

$('#pianorollgrid').on('mousewheel', (e) => {});

$('#pianorollgrid').dblclick((event) => {
  var tileclickedposY = $(event.target).position().top;
  var tileclickedposX = $(event.target).position().left;

  var thisnote;

  console.log(tileclickedposY);

  $('.prkey')
    .toArray()
    .forEach((e, i) => {
      if (Math.abs($(e).position().top - tileclickedposY) < 5) {
        thisnote = $(e).html();
        console.log(thisnote, tileclickedposX);
      }
    });

  var newnote = {
    time: PRPixelsToTime(tileclickedposX),
    note: thisnote,
    dur: '4n',
    velocity: 0.7,
  };
  console.log(newnote);
  sessionmelodies[selectedmelody].notes.push(newnote);
  addNote(newnote);
  onModifySession();
});
