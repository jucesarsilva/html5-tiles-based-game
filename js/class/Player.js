function Player()
{
    /* const vars */
    Player.DIREITA    = 8;
    Player.ESQUERDA   = 4;
    Player.CIMA       = 12;
    Player.BAIXO      = 0;
    
    
    /* publics vars: métodos para acesso GET and SET */
    var x             = 32;
    var y             = 32;
    var dir           = 20;
    var sprites       = new Array();
    var isready       = false;
    var json          = null;
    var img           = null;
    var currentSprite = null;
    var speed         = 2;
    var globalX       = x;
    var globalY       = y;
    var ismoving      = false;
    var hlf           = {x:x,y:y};
    
    /* privates vars: sem métodos de acesso GET and SET */
    var imgloaded     = false;
    var jsonloaded    = false;
    var fixedTime     = 0;
    var ani_right     = Player.DIREITA;
    var ani_left      = Player.ESQUERDA;
    var ani_up        = Player.CIMA;
    var ani_down      = Player.BAIXO;
    var keyboard      = new KeyBoard();
    var ptEsqSup      = 0;
    var ptCentSup     = 0;
    var ptDirSup      = 0;
    var ptEsqMid      = 0;
    var ptDirMid      = 0;
    var ptEsqInf      = 0;
    var ptCentInf     = 0;
    var ptDirInf      = 0;
    var isScrollingX  = false;
    var isScrollingY  = false;
    
    
    
    
    /* Get and Set propriedade "x" */
    this.getX    = function()
    {
        return x;
    };
    this.setX  = function(update)
    {
        x = update;
    };
    
     /* Get and Set propriedade "globalX and Y" */
    this.getGlobalX    = function()
    {
        return globalX;
    };
    this.getGlobalY    = function()
    {
        return globalY;
    };
    
    /* Get and Set propriedade "y" */
    this.getY = function()
    {
        return y;
    };
    this.setY  = function(update)
    {
        y = update;
    };
    
    /* Get and Set propriedade "dir" */
    this.getDir = function()
    {
        return dir;
    };
    this.setDir  = function(update)
    {
        dir = update;
    };
    
    /* Get and Set propriedade "speed" */
    this.getSpeed = function()
    {
        return speed;
    };
    this.setSpeed  = function(update)
    {
        speed = update;
    };
    
    /* Get booleana "isScrollingX" */
    this.getIsScrollingX = function( )
    {
        return isScrollingX;
    };
    
    /* Get booleana "isScrollingY" */
    this.getIsScrollingY = function( )
    {
        return isScrollingY;
    };
    
    /* Get booleana "ismoving" */
    this.getIsMoving = function( )
    {
        return ismoving;
    };
    
    /* Get booleana "ismoving" */
    this.getHLF = function( )
    {
        return hlf;
    };
    
    
    
    /* Get propriedades "sprites" */
    this.getSprite = function( id )
    {
        return sprites[id];
    };
    this.getArraySprite = function( )
    {
        return sprites;
    };
    this.getArraySpriteLength = function( )
    {
        return sprites.length;
    };
    this.getCurrentSprite = function( )
    {
        return currentSprite;
    };
    
   
    
    
    
    
    
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
               isready = true;
        };
        img.src = "img/player.png";
    };
    
    
    
    function loadJSON( )
    {
        json = new XMLHttpRequest();
       
        json.onload = function(){
            jsonloaded = true;
            
            sliceImage(json);
            
            if ( jsonloaded && imgloaded )
                 isready = true;
        };
        
        json.open("GET", "json/player.json", true);
        json.send();
    };
    
    
   
    function sliceImage(_json)
    {
        var parsed = JSON.parse(_json.responseText);
           
        for (var key in parsed.frames )
        {  
            var spt = parsed.frames[key];
            var regeX  = -spt.frame.w * 0.5;
            var regeY  = -spt.frame.h * 0.5;
            
            if ( spt.trimmed )
            {
                regeX = spt.spriteSourceSize.x - (spt.sourceSize.w * 0.5);
                regeY = spt.spriteSourceSize.y - (spt.sourceSize.h * 0.5);
            }
            
            defSprite( spt.filename, key, spt.frame.x, spt.frame.y, spt.frame.w, spt.frame.h, regeX, regeY );
        }
        
        currentSprite = sprites[Player.BAIXO];
    };
    
    
    
    /* Definindo um object com as propriedades de um sprite */
    function defSprite ( name, id, x, y, w, h, cx, cy ) 
    {
        var spt = {
            "name": name,
            "id": id,
            "x": x,
            "y": y,
            "w": w,
            "h": h,
            "cx": cx == null ? 0 : cx,
            "cy": cy == null ? 0 : cy
        }; 
        
        sprites.push( spt );
    };
    
    
    
    
    /* Controlando as animações do player dado a direção */
    function  animate()
    {
        fixedTime += 1;
            
        if ( (fixedTime%8) == 0)
        {
            if ( dir == Player.DIREITA )
                animaRight();
            else if ( dir == Player.ESQUERDA )
               animaLeft()
            else if ( dir == Player.CIMA )
               animaUp();
            else if ( dir == Player.BAIXO )
               animaDown();
       }   
    };
    
    
    
    
    /* Troca de sprites para animação */
    function animaRight()
    {
        ani_right += 1;
                
        if ( ani_right > ( Player.DIREITA + 3) )
            ani_right = Player.DIREITA;
        
        currentSprite = sprites[ani_right];
        
        ani_down = Player.BAIXO;
        ani_left = Player.ESQUERDA;
        ani_up   = Player.CIMA;
    };
    
    
    
    /* Troca de sprites para animação */
    function animaLeft()
    {
        ani_left += 1;
                
        if ( ani_left > ( Player.ESQUERDA + 3) ) 
            ani_left = Player.ESQUERDA;
        
        currentSprite = sprites[ani_left];
        
        ani_down  = Player.BAIXO;
        ani_right = Player.DIREITA;
        ani_up    = Player.CIMA;
    };
    
    
    
    /* Troca de sprites para animação */
    function animaUp()
    {
        ani_up += 1;
                
        if ( ani_up > ( Player.CIMA + 3) ) 
            ani_up = Player.CIMA;
        
        currentSprite = sprites[ani_up];
        
        ani_down  = Player.BAIXO;
        ani_left  = Player.ESQUERDA;
        ani_right = Player.DIREITA;
    };
    
    
    
    /* Troca de sprites para animação */
    function animaDown()
    {
        ani_down += 1;
                
        if ( ani_down > ( Player.BAIXO + 3) ) 
            ani_down = Player.BAIXO;
        
        currentSprite = sprites[ani_down];
        
        ani_up    = Player.CIMA;
        ani_left  = Player.ESQUERDA;
        ani_right = Player.DIREITA;
    };
    
    
    
    
    /* Definindo o estado idle */
    function idle()
    {
       if ( dir == Player.DIREITA )
           currentSprite = sprites[Player.DIREITA];
       else if ( dir == Player.ESQUERDA )
           currentSprite = sprites[Player.ESQUERDA];
       else if ( dir == Player.CIMA )
           currentSprite = sprites[Player.CIMA];
       else if ( dir == Player.BAIXO )
           currentSprite = sprites[Player.BAIXO];
    };
    
    
    
    
    
    /* Controles internos (animação, movimentação e renderização) */
    this.engine = function( _map, _size )
    {
        input( _map );  
    };
    
    
    
    
    /* Renderização */
    this.render = function()
    {
        drawThis();
    }
    
    
    
    
    /* Controle de input interno */
    function input( _map )
    {  
        
        ismoving = false;
        
        scrollingMap( _map );
        
        defineHitArea( );
        
        if( keyboard.getKeyLeft() && ptEsqMid.x > 0 &
          !_map.getColliderTile("", ptEsqSup.x - speed, ptEsqSup.y) &
          !_map.getColliderTile("", ptEsqMid.x - speed, ptEsqMid.y) &
          !_map.getColliderTile("", ptEsqInf.x - speed, ptEsqInf.y) )
        {
            if (!isScrollingX)
                x += -speed;
            else
               _map.x += -speed;
            
            globalX += -speed;
            
            dir = Player.ESQUERDA;
            ismoving = true;
        }
        else if(keyboard.getKeyRight() && ptDirMid.x < (Map.TILES_HORIZONTAL * Map.TILE_W)  &
          !_map.getColliderTile("ptDirSup", ptDirSup.x + speed, ptDirSup.y) &
          !_map.getColliderTile("ptDirMid", ptDirMid.x + speed, ptDirMid.y) &
          !_map.getColliderTile("ptDirInf", ptDirInf.x + speed, ptDirInf.y) )
        {
            if (!isScrollingX)
                x += speed;
            else
               _map.x += speed;
            
            globalX += speed;
            
            dir = Player.DIREITA;
            ismoving = true;
        }
                
        
         defineHitArea( );
        
        if(keyboard.getKeyUp() && ptCentSup.y > 0 &
          !_map.getColliderTile("ptEsqSup", ptEsqSup.x, ptEsqSup.y - speed) &
          !_map.getColliderTile("ptCentSup", ptCentSup.x, ptCentSup.y - speed) &
          !_map.getColliderTile("ptDirSup", ptDirSup.x, ptDirSup.y - speed) )
        {
           if (!isScrollingY)
               y += -speed;
           else
               _map.y += -speed;
           
            globalY += -speed;
            
            dir = Player.CIMA;
           ismoving = true;
        }
        else if(keyboard.getKeyDown() && ptEsqInf.y < (Map.TILES_VERTICAL * Map.TILE_H)  &
          !_map.getColliderTile("ptEsqInf", ptEsqInf.x, ptEsqInf.y + speed) &
          !_map.getColliderTile("ptCentInf", ptCentInf.x, ptCentInf.y + speed) &
          !_map.getColliderTile("ptDirInf", ptDirInf.x, ptDirInf.y + speed) )
        {
            if (!isScrollingY)
                y += speed; 
             else
               _map.y += speed;
            
            globalY += speed;
            
            dir = Player.BAIXO;
            ismoving = true; 
        }
        
        
        if ( ismoving )
            animate();
        else
            idle();
    };
    
    
    
    
    
    /* Controle de scrolling do mapa, determinado pala posição relativa do
       player em relaçã a matriz do mapa */
    function scrollingMap( _map )
    {
        
        var hlfScreenX   = parseInt( (size.w / Map.TILE_W) * 0.5 );
        var hlfScreenY   = parseInt( (size.h / Map.TILE_H) * 0.5 );
        
        var currentTileX = (globalX/Map.TILE_W);
        var currentTileY = (globalY/Map.TILE_H);
        
        
        var maxTilesLimitX = 0;
        var maxTilesLimitY = 0;
        
        
        /* Correção para scrolling mínimo em Y */
        if (   (Map.TILES_HORIZONTAL * Map.TILE_W) - size.w >= Map.TILE_W )
            maxTilesLimitX = (Map.TILES_HORIZONTAL - 1);
        else
            maxTilesLimitX = Map.TILES_HORIZONTAL;
        
        
        /* Correção para scrolling mínimo em Y */
        if (   (Map.TILES_VERTICAL * Map.TILE_H) - size.h >= Map.TILE_H )
            maxTilesLimitY = Map.TILES_VERTICAL;
        else
            maxTilesLimitY = (Map.TILES_VERTICAL - 1);
        
        
        /* Scrolling (deslocamento) para a direita e esquerda permitido */
        if ( currentTileX >= hlfScreenX && currentTileX <= ( maxTilesLimitX - hlfScreenX) )
        {
            isScrollingX = true;
        }
        else
        {
            isScrollingX = false;
            normalizeX( _map, hlfScreenX );
        }
        
        
        /* Scrolling (deslocamento) para a baixo e cima permitido  */
        if ( currentTileY >= hlfScreenY && currentTileY <= (maxTilesLimitY - hlfScreenY) ) 
        {
             isScrollingY = true;
        }
        else
        {
            isScrollingY = false;
            normalizeY( _map, hlfScreenY );
        }
    };
    
    
    
    
    
    /* Correção na posição do scrolling X e na posição do player X */
    function normalizeX( _map, hlfScreenX )
    {
        if ( _map.x < 0 )
        {    
            _map.x = 0;
            x = hlfScreenX * Map.TILE_W;
        }
        if ( _map.x > (Map.TILES_HORIZONTAL * Map.TILE_W) - size.w )
        {
            _map.x = (Map.TILES_HORIZONTAL * Map.TILE_W)  - size.w;
            x = hlfScreenX * Map.TILE_W;
        }
    };
    
    
    
    
    
    /* Correção na posição do scrolling Y e na posição do player Y*/
    function normalizeY( _map, hlfScreenY )
    {
        if ( _map.y < 0 )
        {
            _map.y = 0;
            y = hlfScreenY * Map.TILE_H;
        }
        if ( _map.y > (Map.TILES_VERTICAL * Map.TILE_H) - size.h)
        {
            _map.y = (Map.TILES_VERTICAL * Map.TILE_H) - size.h;
            y = hlfScreenY * Map.TILE_H;
        }
    };
    
    
    
    
    
    /* Somente se a classe estiver loaded */
    function drawThis()
    {
        if ( isready )
            _drawImage( img, currentSprite, x, y );
    };


    
    
    

    /* Renderização no canvas */
    function _drawImage( img, spt, posX, posY )
    {
        hlf = {
            x: (spt.cx + posX),
            y: (spt.cy + posY)
        };
        
        ctx.drawImage( img,
                      spt.x, spt.y, spt.w, spt.h, /* origem */
                      hlf.x, hlf.y, spt.w, spt.h /* destino */ );
    };
    
    
   
    
    
    
    /* obtem-se os pontos de colisão do tronco do player */
    function defineHitArea( )
    {
       var correctHalfWidth  = 12;
       var correctHalfHeight = 6;
        
       /* PONTOS SUPERIORES */
       ptEsqSup = {
           "x": (globalX - correctHalfWidth ),
           "y": (globalY - correctHalfHeight)
       };
       
       ptCentSup = {
           "x": globalX,
           "y": (globalY - correctHalfHeight)
       };
       
       ptDirSup = {
           "x": (globalX + correctHalfWidth ),
           "y": (globalY - correctHalfHeight)
       };
        
        
       /* PONTOS CENTRAIS */    
       ptEsqMid = {
           "x": (globalX - correctHalfWidth ),
           "y": (globalY - correctHalfHeight) + (Map.TILE_H * 0.5)
       };
        
       ptDirMid = {
           "x": (globalX + correctHalfWidth ),
           "y": (globalY - correctHalfHeight) + (Map.TILE_H * 0.5)
       };
       
        
        
       /* PONTOS INFERIORES */
       ptEsqInf = {
           "x": ( globalX - correctHalfWidth ),
           "y": ( (globalY - correctHalfHeight) + Map.TILE_H - 2 )
       };
       
       ptCentInf = {
           "x": globalX,
           "y": ( (globalY - correctHalfHeight ) + Map.TILE_H - 2 )
       };
       
       ptDirInf = {
           "x": ( globalX + correctHalfWidth ),
           "y": ( (globalY - correctHalfHeight) + Map.TILE_H - 2 )
       };  
    };
    
    
    
    this.debug = function()
    {
        ctx.fillStyle="#FF0000";
        ctx.fillRect(ptEsqSup.x,ptEsqSup.y,2,2);
        ctx.fillRect(ptCentSup.x,ptCentSup.y,2,2);
        ctx.fillRect(ptDirSup.x,ptDirSup.y,2,2);
        
        
        ctx.fillRect(ptEsqMid.x,ptEsqMid.y,2,2);
        ctx.fillRect(ptDirMid.x,ptDirMid.y,2,2);
        
        
        ctx.fillRect(ptEsqInf.x,ptEsqInf.y,2,2);
        ctx.fillRect(ptCentInf.x,ptCentInf.y,2,2);
        ctx.fillRect(ptDirInf.x,ptDirInf.y,2,2);
    };
    

}