/*#################################################################################################
  #                                                                                               #
  #                             Author : Julio Cesar Silva                                        #
  #                             Data : 02/12/2013                                                 #
  #                             Empresa Mstech©                                                   #
  #                                                                                               #
  #################################################################################################*/

function Map()
{
    /* statics vars */
    Map.TILE_W            = 0;
    Map.TILE_H            = 0;
    Map.TILES_HORIZONTAL  = 0;
    Map.TILES_VERTICAL    = 0;
    Map.MAP_W             = 0;
    Map.MAP_H             = 0;
    
    
    /* publics vars: métodos para acesso GET and SET */
    var isready          = false;
    var json             = null;
    var img              = null;
    var baseSprites      = new Array();
    var baseMix          = new Array();
    var middleSprites    = new Array();
    var collisionSprites = new Array();
    var tilesheet        = new Array();
    var objectsAnimated  = new Array();
    
    /* privates vars: sem métodos de acesso GET and SET */
    var imgloaded  = false;
    var jsonloaded = false;
    
    
    /* Vars publicas */
     this.x = 0;
     this.y = 0;
    
    
    /* Criação dos buffers de mapa com auxílio da f(x) ready Jquery */
    $(document).ready( function() {
       
    });
    
    
    
    /* Get propriedade "isready" */
    this.getIsready = function(  )
    {
        return isready;
    };
    
    /* Get propriedade "json" */
    this.getJson = function(  )
    {
        return json;
    };
    
    /* Get propriedade "img" */
    this.getImg = function( )
    {
        return img;
    };
    
    /* Get and Set propriedade "collisionSprites" */
    this.getCollisionSprites = function()
    {
        return collisionSprites;
    };
    
    
    
    
    
    /* Retorna (true||false) se o tile correspondente ao ponto (x,y) passado for "colisível" */
    this.getColliderTile = function(type, _x, _y )
    {
        var i = parseInt( _x / Map.TILE_W );
        var j = parseInt( _y / Map.TILE_H );
        
        var jsonTile = (j * Map.TILES_HORIZONTAL) + i;
       
        var currentTileCollision = collisionSprites[jsonTile] - 1;
        
        if ( currentTileCollision <= 0 )
        { 
            return false;
        }
        else
        {
           // debug(i*32,j*32);
            return true;
        }
    };
    
    
    
    
    /* preenche os espaços dos tiles que estão colidindo */
    function debug( tx, ty, tw, th )
    {
        ctx.fillStyle="#FF0000";
        ctx.fillRect( tx, ty, Map.TILE_W, Map.TILE_H ); 
    };
    
    
    
    
    
    /* Inicializador de classe */
    this.init = function()
    {
        loadImage();
        loadJSON();
    };
    
    
    
    
    function loadImage () 
    {
        img = new Image();
        img.onload = function() { 
            
            imgloaded = true; 
            
            if ( jsonloaded && imgloaded )
            {
                isready = true;
                getBufferLayers();
            }
        };
        img.src = "img/tilesheet.png";
    };
    
    
    
    function loadJSON( )
    {
        json = new XMLHttpRequest();
       
        json.onload = function(){
          
            jsonloaded = true;
            
            getMapData(json);
            
            getTileSheet();
            
            if ( jsonloaded && imgloaded )
            {
                isready = true;
                getBufferLayers();
            }
            
            createCanvas();
        };
        
        json.open("GET", "json/tilemap.json", true);
        json.send();
    };
    
    
    
    
    
    
    
    /* Desenha a matriz presente no json em canvas que tem a finalidade de servir como buffers
       de memória para armazenamento de imgs */
    function getBufferLayers()
    {
       Buffer.addBuffer("bufferBaseLayer", Map.TILES_HORIZONTAL * Map.TILE_W, Map.TILES_VERTICAL * Map.TILE_H );
       Buffer.addBuffer("bufferMiddleLayer", Map.TILES_HORIZONTAL * Map.TILE_W, Map.TILES_VERTICAL * Map.TILE_H );
        
       var objBuffer = Buffer.getBufferByID(0);
       getBaseLayerBuffer( objBuffer.context );
        
       objBuffer = Buffer.getBufferByID(1);
       getMiddleLayerBuffer( objBuffer.context  );
    }
    
    
    
    
    
    
    
    /* Armazena os dados do arquivo json com os arrays de layer do mapa */
    function getMapData(_json)
    {
        var parsed = JSON.parse(_json.responseText);
        
        Map.TILE_W            = parsed.tilewidth;
        Map.TILE_H            = parsed.tileheight;
        Map.TILES_HORIZONTAL  = parsed.width;
        Map.TILES_VERTICAL    = parsed.height;
        Map.TILESHEET_W       = parsed.tilesets[0].imagewidth;
        Map.TILESHEET_H       = parsed.tilesets[0].imageheight;
        
        
        for (var key in parsed.layers )
        { 
            switch( parsed.layers[key].name )
            { 
                case "base_layer":
                   baseSprites = parsed.layers[key].data;
                break;
                    
                case "basemix":
                   baseMix = parsed.layers[key].data;
                break;
                    
                case "middle_layer":
                   middleSprites = parsed.layers[key].data;
                break;
                    
                case "collision":
                   collisionSprites = parsed.layers[key].data;
                break;
                    
                case "coins animadas":
                    getObjectsAnimated( parsed.layers[key].objects );
                break;
            }
        }
    };
    
    
    
    
    
    
    /* Formatação dos objetos animados */
    function getObjectsAnimated( objects )
    {
        for ( var key in objects )
        { 
            var arrTiles = new Array();
            for ( var tile in objects[key].properties )
                arrTiles.push( objects[key].properties[tile] ) ;
            
           
            var obj = {
                "frame": 1,
                "currentTile": objects[key].gid,
                "name": objects[key].name,
                "tiles": arrTiles,
                "type": objects[key].type,
                "visible": objects[key].visible,
                "x": objects[key].x,
                "y": objects[key].y,
                "animaFPS": FPS / arrTiles.length,
                "currentFPS": 0
            };
            
            objectsAnimated.push ( obj );
        }
    };
    
    
    
    
    
    
    
    
    /* Armazena as subdivisões de tiles para localização dos mesmos na imagem atlases (tilesheet) */
    function getTileSheet()
    {
        var maxW = Map.TILESHEET_W/Map.TILE_W;
        var maxH = Map.TILESHEET_H/Map.TILE_H;
        
        for ( var i = 0; i < maxH; i++ )
        {   
            for ( var j = 0; j < maxW; j++ )
            {
                var tile = {
                    "id":tilesheet.length,
                    "x":(j * Map.TILE_W),
                    "y":(i * Map.TILE_H)
                };
                
                tilesheet.push( tile );
            }
        }
    }
    
    
    
    
    
    
    
    /* Desenha um tile pelas coordenadas armazenadas no array de tilesheet (x,y) source, 
    e pelas coordenadas do mapa (x,y) destine */
    function drawTile( _ctx, tileX, tileY, mapX, mapY )
    {
        _ctx.drawImage( img,
                  tileX, tileY, Map.TILE_W, Map.TILE_H,
                  mapX, mapY, Map.TILE_W, Map.TILE_H );
    }
    
    
    
    
    
    
    
    /* Desenha a camada baseLayer segundo a matriz total */
    function getBaseLayerBuffer( _context )
    {
        if ( isready )
        {
            for ( var i = 0; i <  Map.TILES_VERTICAL; i++ )
            {
                for ( var j = 0; j <  Map.TILES_HORIZONTAL; j++ )
                {
                    var jsonTile    = (i * Map.TILES_HORIZONTAL) + j;
                    var currentTile = baseSprites[jsonTile] - 1;
                    var currentBaseMix = baseMix[jsonTile] - 1;
                    
                    /* Segurança de integridade quando não houver tile (0) */
                    if ( currentTile < 0 )
                        currentTile = 0;
                    if ( currentBaseMix < 0 )
                        currentBaseMix = 0;
                    
                    var _y = i * Map.TILE_H;
                    var _x = j * Map.TILE_W;
                    
                    drawTile( _context, tilesheet[currentTile].x, tilesheet[currentTile].y, _x, _y );
                    drawTile( _context, tilesheet[currentBaseMix].x, tilesheet[currentBaseMix].y, _x, _y ); 
                }
            }
        }
    };
    
    
    
    
    
    
    
    /* Desenha a camada middleLayer segundo a matriz total */
    function getMiddleLayerBuffer( _context )
    {
        if ( isready )
        {
            for ( var i = 0; i <  Map.TILES_VERTICAL; i++ )
            {
                for ( var j = 0; j <  Map.TILES_HORIZONTAL; j++ )
                {
                    var jsonTile    = (i * Map.TILES_HORIZONTAL) + j;
                    var currentTile = middleSprites[jsonTile] - 1;
                    
                     /* Segurança de integridade quando não houver tile (0) */
                    if ( currentTile < 0 )
                        currentTile = 0;
                    
                    var _y = i * Map.TILE_H;
                    var _x = j * Map.TILE_W;
                    
                    drawTile( _context, tilesheet[currentTile].x, tilesheet[currentTile].y, _x, _y );
                }
            }
        }
    };
    
    
    
    
    
    
    /* Desenha toda a extensão da matriz do mapa */
    this.drawBaseLayerAllMap =  function(_ctx )
    {
        getBaseLayerBuffer(_ctx);
    };
    
    
    
    
    
    
    /* Desenha toda a extensão da matriz do mapa */
    this.drawMiddleLayerAllMap =  function( _ctx )
    {
        getMiddleLayerBuffer(_ctx);
    };
    
    
    
    
    
    
    /* Origem : (_ox, _oy, _ow, _oh) 
       Destino : (_dx, _dy, _dw, _dh)*/
    this.drawBaseLayerSection = function( _ctx, _ox, _oy, _ow, _oh, _dx, _dy, _dw, _dh )
    {
          var objBuffer = Buffer.getBufferByID(0);
        
            if( objBuffer != null )
                _ctx.drawImage( objBuffer.buffer,
                              _ox, _oy, _ow, _oh, 
                              _dx, _dy, _dw, _dh );
    };
    
    
    
    
    
    
    /* Origem : (_ox, _oy, _ow, _oh) 
        Destino : (_dx, _dy, _dw, _dh)*/
    this.drawMiddleLayerSection = function( _ctx, _ox, _oy, _ow, _oh, _dx, _dy, _dw, _dh )
    {
          var objBuffer = Buffer.getBufferByID(1);
        
            if( objBuffer != null )
                _ctx.drawImage( objBuffer.buffer,
                              _ox, _oy, _ow, _oh, 
                              _dx, _dy, _dw, _dh );
        
    };
    
    
    
    
    
    
    /* Desenha somente os tiles presentes no perímetro visível do canvas,
       ou seja, um intervalos da matriz de tiles */
    this.drawBaseLayerMatrizInterval = function( _ctx, _width, _height )
    {
        if ( isready )
        {
            var matrizWidth   = parseInt(_width / Map.TILE_W) + 1;
            var matrizHeight  =parseInt(_height / Map.TILE_H) + 1;
            
       
            for ( var i = 0; i <  matrizHeight; i++ )
            {
                for ( var j = 0; j <  matrizWidth; j++ )
                {
                    var jsonTile    = (i * Map.TILES_HORIZONTAL) + j;
                    var currentTile = baseSprites[jsonTile] - 1;
                    var currentBaseMix = baseMix[jsonTile] - 1;
                    
                    if ( currentTile < 0 )
                        currentTile = 0;
                    if ( currentBaseMix < 0 )
                        currentBaseMix = 0;
                    
                    var _y = i * Map.TILE_H;
                    var _x = j * Map.TILE_W;
                    
                    drawTile( _ctx, tilesheet[currentTile].x, tilesheet[currentTile].y, _x, _y );
                    drawTile( _ctx, tilesheet[currentBaseMix].x, tilesheet[currentBaseMix].y, _x, _y ); 
                }
            }
            
        }
    };
    
    
    
    
    
    
    
    /* Desenha somente os tiles presentes no perímetro visível do canvas,
       ou seja, um intervalos da matriz de tiles */
    this.drawMiddleLayerMatrizInterval = function( _ctx, _width, _height )
    {
        if ( isready )
        {
            var matrizWidth   = parseInt(_width / Map.TILE_W) + 1;
            var matrizHeight  = parseInt(_height / Map.TILE_H) + 1;
            
       
            for ( var i = 0; i <  matrizHeight; i++ )
            {
                for ( var j = 0; j <  matrizWidth; j++ )
                {
                   var jsonTile    = (i * Map.TILES_HORIZONTAL) + j;
                    var currentTile = middleSprites[jsonTile] - 1;
                    
                    if ( currentTile < 0 )
                        currentTile = 0;
                    
                    var _y = i * Map.TILE_H;
                    var _x = j * Map.TILE_W;
                    
                    drawTile( _ctx, tilesheet[currentTile].x, tilesheet[currentTile].y, _x, _y );
                }
            }
            
        }
    };
    
    
    
    /* Desenha os objetos animados */
    this.drawObjectsAnimated = function( _ctx, mapBeginX, mapBeginY, screenWidth, screenHeight )
    {
        for ( var key in objectsAnimated )
        {
            /* Controle de visibilidade do tile animado para animações somente dentro do view de screen */
            if ( objectsAnimated[key].x > mapBeginX && objectsAnimated[key].x < (mapBeginX + screenWidth) &&
                  objectsAnimated[key].y > mapBeginY && objectsAnimated[key].y < (mapBeginY + screenHeight) )
            {
                objectsAnimated[key].currentFPS += 1;
                
                if ( objectsAnimated[key].currentFPS >= objectsAnimated[key].animaFPS - 1 )
                {
                    objectsAnimated[key].currentFPS = 0;
                    
                    objectsAnimated[key].visible = true;
                    
                    objectsAnimated[key].frame += 1;
                    
                    if ( objectsAnimated[key].frame >= objectsAnimated[key].tiles.length - 1 )
                        objectsAnimated[key].frame = 0;
                    
                    objectsAnimated[key].currentTile = objectsAnimated[key].tiles[objectsAnimated[key].frame]; 
                }
                
                
                _ctx.drawImage( img ,
                                  tilesheet[ objectsAnimated[key].currentTile ].x, tilesheet[ objectsAnimated[key].currentTile ].y, 
                                  Map.TILE_W, Map.TILE_H, 
                                  objectsAnimated[key].x - this.x, objectsAnimated[key].y - this.y, Map.TILE_W, Map.TILE_H );
            }
            else
            {
                objectsAnimated[key].visible = false;
                objectsAnimated[key].frame = 1;
                objectsAnimated[key].currentTile = objectsAnimated[key].tiles[0];
                objectsAnimated[key].currentTile = objectsAnimated[key].tiles[objectsAnimated[key].frame];
                objectsAnimated[key].currentFPS = 0;
            }
        }
    };
    
}