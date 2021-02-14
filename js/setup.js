//SIDE MENU ================================================
$("#sidemenu").css({
  left: -$("#sidemenu").outerWidth() + 10,
});

$("#sidemenu").hover(
  function () {
    //onHoverIn
    $("#sidemenu").css({
      left: 0,
    });

    $("#sideenubackgound").removeClass("visible").toggleClass("hidden");
    $("#sidemenubackgound").removeClass("visible").toggleClass("hidden");
  },
  function () {
    //onHoverOut
    $("#sidemenu").css({
      left: -$("#sidemenu").outerWidth() + 10,
    });
    $("#sidemenubackgound").removeClass("hidden").toggleClass("visible");
  }
);

//MENUCLICK ================================================

//$(".pagemenu").click(function (e) {
  if (isPlaying == true) Tone.Transport.dispose();

  //var link = $(this).attr("id");
  //link = link.replace("link", "");
  var link = "composerpage"
  $("#workspace").html("");
  $("#workspace").load("pages/" + link + ".html", pageSetup(link));
  loadedPage = link;
//});

//LOADER ================================================

function pageSetup(link) {
  if (link == "sequencerpage") {
    setTimeout(() => {
      sequencerSetup();
      console.log();
    }, 100);
    return;
  } 
  if (link == "composerpage") {
    setTimeout(() => {
      composerSetup();
      console.log();
    }, 100);
    return;
  } 
}


//TOOLTIP ================================================

$(document).tooltip({
  track: true,
  classes: {
    "ui-tooltip": "customtooltip shadow",
  },
  position: {
    my: "center bottom-20",
    at: "center top",
    using: function (position, feedback) {
      $(this).css(position);
    },
  },
});

$(window).resize(function () {
  drawSequencer();
  drawCircleElements();
});
