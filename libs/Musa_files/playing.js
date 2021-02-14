$("html").keydown(function (e) {
  if (e.keyCode >= 49 && e.keyCode <= 57) {
    drumSounds[e.keyCode - 49].start();
    highlightDrumKeys(e.keyCode - 48);
    registerNoteToSequencer(e.keyCode - 48);

    return;
  }
  if (e.keyCode == 48) {
    drumSounds[9].start();
    highlightDrumKeys(10);
    registerNoteToSequencer(10);
    return;
  }
});

drumSounds.forEach(drawDrumPlayInd);

function drawDrumPlayInd(e, i) {
  $("#drumplayind").append(
    '<div class="drumkeyind" id="drumkey' + i + '"></div>'
  );
  $("#drumkey" + i).css({ left: (window.innerWidth / drumSounds.length) * i });
}

function highlightDrumKeys(note) {
  $("#drumplayind").css({ opacity: 1 });
  $("#drumplayind").animate({ opacity: 0 }, 800);

  $("#drumkey" + note).toggleClass("highlightedkey");
  $("#drumkey" + note).removeClass("highlightedkey");
}
