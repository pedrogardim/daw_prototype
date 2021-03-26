var circleanimation = anime({
  targets: ["#indcenter"],
  rotate: 360,
  duration: 480 / seqbpm,
  loop: true,
  easing: "linear",
});

circleanimation.pause();

function drawCircleElements() {
  var totalAngle = -Math.PI / 2;

  $("#rhythmcircle").html("");

  drumSeq.forEach(function (e, i) {
    if (e.indexOf(1) != -1) {
      //check for kick drum
      $("#rhythmcircle").append(
        '<div class="ce cestyle1" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(2) != -1) {
      //check for snare drum
      $("#rhythmcircle").append(
        '<div class="ce cestyle2" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(3) != -1) {
      //check for clap
      $("#rhythmcircle").append(
        '<div class="ce cestyle3" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(4) != -1) {
      //check for hihat
      $("#rhythmcircle").append(
        '<div class="ce cestyle4" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(5) != -1) {
      //check open hihat
      $("#rhythmcircle").append(
        '<div class="ce cestyle5" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(6) != -1) {
      //check low tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle6" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(7) != -1) {
      //check mid tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle7" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(8) != -1) {
      //check hi tom
      $("#rhythmcircle").append(
        '<div class="ce cestyle8" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(9) != -1) {
      //check crash
      $("#rhythmcircle").append(
        '<div class="ce cestyle9" id="ce' + (i + 1) + '"></div>'
      );
    }
    if (e.indexOf(10) != -1) {
      //check perc
      $("#rhythmcircle").append(
        '<div class="ce cestyle10" id="ce' + (i + 1) + '"></div>'
      );
    }

    $("#ce" + (i + 1)).css("left", 200 * Math.cos(totalAngle) + 200 + "px");
    $("#ce" + (i + 1)).css("top", 200 * Math.sin(totalAngle) + 200 + "px");

    totalAngle += Math.PI / 8;
  });
}

function animateOnBeat() {
  var actualwidth = $("#ce" + currentBeat).width();
  var actualheight = $("#ce" + currentBeat).height();

  $("#ce" + currentBeat).css({
    width: actualwidth + 10,
    height: actualheight + 10,
  });
  $("#ce" + currentBeat).animate(
    { width: actualwidth, height: actualheight },
    50
  );
}

drawCircleElements();

$("#rhythmcircle").click(function () {
  anime({
    targets: "#rhythmcircle",
    opacity: 0,
    duration: 1500,
  });
});
