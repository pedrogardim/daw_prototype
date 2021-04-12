function createChannelStrip(){

    var chstripindex = $(".chstrip").toArray().length;

    var chstrip = '<div class="chstrip" data-channel="'+chstripindex+'"></div>';

    $("#mixcont").append(chstrip);

    var thischstrip = '.chstrip[data-channel="'+chstripindex+'"]';

    //LABEL/LEVEL

    $(thischstrip).append('<span class="chlbl">Element '+(chstripindex+1)+'</span>');
    $(thischstrip).append('<span class="chlvl">0.0</span>');


    $(thischstrip).append('<div class="chfadercont" data-channel="'+chstripindex+'"></div>');

    //FADER

    $('.chfadercont[data-channel="'+chstripindex+'"]').append('<div class="chfader" data-channel="'+chstripindex+'"></div>');
    $('.chfader[data-channel="'+chstripindex+'"]').slider({
            orientation: "vertical",
            min: -60,
            max:12,
    });

    //LVL METER

    $('.chfadercont[data-channel="'+chstripindex+'"]').append('<div class="chmeter" data-channel="'+chstripindex+'"></div>');
    for(var x=0; x < 16;x++){
        $('.chmeter[data-channel="'+chstripindex+'"]').append('<div class="chmetertile" data-channel="'+chstripindex+'" data-lvl="'+x+'"></div>');
    }

    //MUTE/SOLO

    $(thischstrip).append('<div class="flex-row" data-channel="'+chstripindex+'"><button class="chmute">M</button><button class="chsolo">S</button></div>');

    //PAN 

    $(thischstrip).append('<input type="text" value="0" class="dial">');
    var dialwidth = Math.floor($(thischstrip).width()*0.4);

    $(thischstrip + " > .dial").knob({
        'min':-50,
        'max':50,
        'width':dialwidth+"px",
        'height':dialwidth+"px",
        'angleOffset':-140,
        'angleArc':280,
        'cursor':10,
        'thickness':".3",
        'font':'Barlow Semi Condensed", sans-serif',
        'bgColor' : "#379683",
        'fgColor':"#05386b"
    });

    $(thischstrip).append('<div class="chfx" data-channel="'+chstripindex+'"></div>');

        







}

for(var x = 0; x < 15; x++){
    createChannelStrip()
}
