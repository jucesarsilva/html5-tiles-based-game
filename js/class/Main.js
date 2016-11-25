/*#################################################################################################
  #                                                                                               #
  #                             Author : Julio Cesar Silva                                        #
  #                             Data : 02/12/2013                                                 #
  #                                                                                               #
  #                                                                                               #
  #################################################################################################*/


var content;
var canvas;
var ctx;
var size = {w:0,h:0};
var FPS = 32;
var keyboard;
var player;
var map;
var enimy;
var enimy2;




$(document).ready( function() 
{ 
    map = new Map();
    map.init();
    
    player = new Player();
    player.init();
    
    enimy = new Enimy( 273, 80);
    enimy.init();
    
    enimy2 = new Enimy( 450, 250 );
    enimy2.init();
    
    
    /* Criar o fps */
    FPSMeter.defaults.theme = "colorful";
    FPSMeter.defaults.graph = 1;
    FPSMeter.defaults.history = 20;
    var meter = new FPSMeter([content] [FPSMeter.defaults]);
    
    
    
    
    /* Ordem de processamento dos objetos */
    function engine()
	{
        meter.tickStart();
	    meter.tick();
        
        player.engine( map );
        
        enimy.engine( map, size, player, ctx );
        
        enimy2.engine( map, size, player, ctx );
        
        render();
    };
    
    
    
    
    /* Ordem de desenho os objetos */
    function render()
    {
        map.drawBaseLayerSection( ctx, map.x, map.y, size.w, size.h, 0, 0, size.w, size.h );
        map.drawObjectsAnimated( ctx, map.x, map.y, size.w, size.h );
        
        player.render();
        
        enimy.render( map );
        
        enimy2.render( map );
        
        map.drawMiddleLayerSection( ctx, map.x, map.y, size.w, size.h, 0, 0, size.w, size.h );
        
        GUI.drawGUI( ctx );
    };
    
    
    
    
    /* Laço de repetição default */
    function loop()
    {
        engine();
        requestAnimationFrame(loop);
    };
    loop();


    /* Base para construção do laço de repetição */
    window.requestAnimationFrame = (function() {
        
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
            
        function(callback, element) {
            window.setTimeout(callback, FPS);
        }
    })();
});






/* Funçao visível global para criação do canvas */
function createCanvas()
{
    content = document.getElementById("content")
    canvas  = document.createElement('canvas');
    size.w  = $("#content").css("width"); 
    size.h  = $("#content").css("height");
    
    size.w = parseInt( (size.w.replace("px","")/Map.TILE_W) ) * Map.TILE_W;
    size.h = parseInt( (size.h.replace("px","")/Map.TILE_H) ) * Map.TILE_H;
    
    $("#content").width(size.w).height(size.h);
    
    canvas.setAttribute("width", size.w);
    canvas.setAttribute("height", size.h);
    canvas.setAttribute("id", "canvas");
    content.appendChild(canvas);
    ctx = canvas.getContext("2d");
};






/* Funçao visível global para destruição do canvas */
function destroyCanvas()
{
    if ( content != null )
        if ( canvas != null )
            content.removeChild( canvas );
};





/*  Funçao visível global para  atualização para canvas (stage) */
function updateCanvas()
{
    if (size.w != $("#content").css("width").replace("px","") ||
        size.h != $("#content").css("height").replace("px","") )
    {
        destroyCanvas();
        createCanvas();
    }
};