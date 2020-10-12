function Enimy( _x, _y )
{
    /* const vars */
    Enimy.DIREITA      = 8;
    Enimy.ESQUERDA     = 4;
    Enimy.CIMA         = 12;
    Enimy.BAIXO        = 0;
    Enimy.TILE_PURSUIT = 6;
    
    
    /* publics vars: métodos para acesso GET and SET */
    var x             = _x != null ? _x : 0;
    var y             = _y != null ? _y : 0;
    var dir           = Enimy.BAIXO;
    var sprites       = new Array();
    var isready       = false;
    var json          = null;
    var img           = null;
    var currentSprite = null;
    var speed         = 2;
    var hlf           = { x:x, y:y };
    var respawn       = { x:hlf.x, y:hlf.y };
    var currentTile   = { x:x, y:y };
      
    
    /* privates vars: sem métodos de acesso GET and SET */
    var imgloaded     = false;
    var jsonloaded    = false;
    var fixedTime     = 0;
    var ani_right     = Enimy.DIREITA;
    var ani_left      = Enimy.ESQUERDA;
    var ani_up        = Enimy.CIMA;
    var ani_down      = Enimy.BAIXO;
    var isTweening    = false;
    var tweenerPos    = {x:x,y:y};
    
    
    /* Vars para pathfinding do M.I.T */
    var grid;
    var playerPos = { x:-1, y:-1 }
    var cameraView;
    var finder = new PF.BestFirstFinder();
    var pathToPlayer  = [];
    var pathToRespawn = [];
    
    
    /* Controle de Tween */
    var stage = new createjs.Stage("canvas");
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.setFPS(33);
    
    
    
    
    
    /* Get and Set propriedade "x" */
    this.getX    = function()
    {
        return x;
    };
    this.setX  = function(update)
    {
        x = update;
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
    
    
    
    
    /* Iniciar o objeto */
    this.init = function()
    {
        loadImage();
        loadJSON();
    };
    
    
    
    /* Load básico de img */
    function loadImage () 
    {
        img = new Image();
        img.onload = function() { 
            imgloaded = true; 
            if ( jsonloaded && imgloaded) 
                isready = true;
          
        };
        img.src = "img/enemy.png";
    };
    
  
    
    /* Load básico de json */
    function loadJSON( )
    {
        json = new XMLHttpRequest();
       
        json.onload = function(){
            jsonloaded = true;
            
            sliceImage(json);
            
            if ( jsonloaded && imgloaded )
                 isready = true;
        };
        
        json.open("GET", "json/enemy.json", true);
        json.send();
    };
    
    
   
    
    /* Corte lógico de sprites */
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
        
        currentSprite = sprites[Enimy.BAIXO];
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
    
    
    
    
    
    /* Controlando as animações dado a direção */
    function  animate()
    {
        fixedTime += 1;
            
        if ( (fixedTime%8) == 0)
        {
            if ( dir == Enimy.DIREITA )
                animaRight();
            else if ( dir == Enimy.ESQUERDA )
               animaLeft()
            else if ( dir == Enimy.CIMA )
               animaUp();
            else if ( dir == Enimy.BAIXO )
               animaDown();
       }   
    };
    
    
    
    
    
    /* Troca de sprites para animação */
    function animaRight()
    {
        ani_right += 1;
                
        if ( ani_right > ( Enimy.DIREITA + 3) )
            ani_right = Enimy.DIREITA;
        
        currentSprite = sprites[ani_right];
        
        ani_down = Enimy.BAIXO;
        ani_left = Enimy.ESQUERDA;
        ani_up   = Enimy.CIMA;
    };
    
    
    
    
    
    /* Troca de sprites para animação */
    function animaLeft()
    {
        ani_left += 1;
                
        if ( ani_left > ( Enimy.ESQUERDA + 3) ) 
            ani_left = Enimy.ESQUERDA;
        
        currentSprite = sprites[ani_left];
        
        ani_down  = Enimy.BAIXO;
        ani_right = Enimy.DIREITA;
        ani_up    = Enimy.CIMA;
    };
    
    
    
    
    
    /* Troca de sprites para animação */
    function animaUp()
    {
        ani_up += 1;
                
        if ( ani_up > ( Enimy.CIMA + 3) ) 
            ani_up = Enimy.CIMA;
        
        currentSprite = sprites[ani_up];
        
        ani_down  = Enimy.BAIXO;
        ani_left  = Enimy.ESQUERDA;
        ani_right = Enimy.DIREITA;
    };
    
    
    
    
    
    /* Troca de sprites para animação */
    function animaDown()
    {
        ani_down += 1;
                
        if ( ani_down > ( Enimy.BAIXO + 3) ) 
            ani_down = Enimy.BAIXO;
        
        currentSprite = sprites[ani_down];
        
        ani_up    = Enimy.CIMA;
        ani_left  = Enimy.ESQUERDA;
        ani_right = Enimy.DIREITA;
    };
    
    
    
    
    
    /* Definindo o estado idle */
    function idle()
    {
       if ( dir == Enimy.DIREITA )
           currentSprite = sprites[Enimy.DIREITA];
       else if ( dir == Enimy.ESQUERDA )
           currentSprite = sprites[Enimy.ESQUERDA];
       else if ( dir == Enimy.CIMA )
           currentSprite = sprites[Enimy.CIMA];
       else if ( dir == Enimy.BAIXO )
           currentSprite = sprites[Enimy.BAIXO];
    };
    
    
    
    
    
    
    
    /* Controles internos (animação, movimentação e renderização) */
    this.engine = function( _map, _size, _player )
    {
        animate();
        AIcore( _map, _size, _player )
        tweenerAnimation( _player, _map );
    };
    
  
    
    
    this.render = function( _map )
    {
         drawThis( _map );
    };
    
    
    
    
    
    
    /* Núcleo de A.I */
    function AIcore( _map, _size, _player  )
    {
        /* Ativar a A.I para os inimigos somente se estes estão no perimetro válido ao view da câmera em pixels */    
        if ( isActivedAI( _map, _size  ) )
        {
           /* Controle lógico entre distância para ínicio de perseguição e limite 
              para perseguição dado max. de tile distante do respawn */
           if ( getDistanceFromPlayerInTile( _player ) < Enimy.TILE_PURSUIT  )
           {
               getPathToPlayer( _map, _size, _player );
               
                  if( pathToPlayer.length > 0 && !isTweening  )
                        executePath(  pathToPlayer );
           }
        }
    };
    
    
    
    
    
    
    
    /* Aplica os nós do caminho obtido pelo pathfinding */
    function executePath( _pathToPlayer )
    {
        tweenStart ( getNodeForWalk( _pathToPlayer ), 400 );
    };
    
    
    
    
    
    
    
    
    /* Retorna as coordenadas (x,y) do nó destino: aplicado o tween "andar" */
    function getNodeForWalk( _path )
    {
        
        /* Sempre 1º nó a ser percorrido */
        var tempNode    = _path[_path.length-1]
        
        
        /* A posição de destino que o inimigo deve se deslocar */
        var destineNode = { x: parseInt( ((tempNode[0]*Map.TILE_W)+(Map.TILE_W*.5)) ),
                            y: parseInt( ((tempNode[1]*Map.TILE_H)+(Map.TILE_H*.5)) ) 
                };
        
        /* Remover o nó já computado da lista de tiles "walkeables" */
        _path.pop();
        
        
        return destineNode;
    };
    
    
    
    
    
    
    /* Aplica o Tween ao nó selecionado */
    function tweenStart( _destineNode, time )
    {
         isTweening = true;
        
         var tween = createjs.Tween.get( tweenerPos, {loop:false} )
         /*.to( { x: _destineNode.x, y: _destineNode.y }, time, createjs.Ease.bounceOut)*/
         .to( { x: _destineNode.x, y: _destineNode.y }, time)
         .wait(0).call(tweenStop);
        
         lookAt( _destineNode );
    }
    
    
    
    
    /* Para o Tween */
    function tweenStop()
    {
        isTweening = false;
    };
    
    
    
    
    
    /* Olhar para o player */
    function  lookAt( _destineNode )
    {
        if ( parseInt(_destineNode.x/Map.TILE_W) < parseInt(hlf.x/Map.TILE_W) )
            dir = Enimy.ESQUERDA;
        else if ( parseInt(_destineNode.x/Map.TILE_W) > parseInt(hlf.x/Map.TILE_W) )
             dir = Enimy.DIREITA;
        else if ( parseInt(_destineNode.y/Map.TILE_H) < parseInt(hlf.y/Map.TILE_H) )
             dir = Enimy.CIMA;
        else if ( parseInt(_destineNode.y/Map.TILE_H) > parseInt(hlf.y/Map.TILE_H) )
             dir = Enimy.BAIXO;
            
    };
    
    
    
    
    /* Lerp application: os pontos entre um nó e outro são aplicados por esta function */
    function tweenerAnimation( _player, _map )
    {
        
        if ( isTweening && !_player.getIsMoving() )
        {
            x = tweenerPos.x;
            y = tweenerPos.y;
            
            tweenerPos.x = x;
            tweenerPos.y = y;
        }
         else
        {
            dir = Enimy.BAIXO;
        }
       
    }
    
    
    
    
    
    
    /* Quando fora da cameraView, posição do inimigo(this) é "resetada" */
    function resetToRespawn()
    {
        hlf.x = respawn.x;
        hlf.y = respawn.y;
        
        x = hlf.x;
        y = hlf.y;
    }
    
    
    
    
    
    
    /* Busca por caminho até o player: matriz com nós de tiles */
    function getPathToPlayer( _map, _size, _player  )
    {
        /* Pathfinding é atualizado somente se houver mudança na posição em tile relativa do personagem ao mapa total */
        if ( playerPos.x != parseInt((_player.getGlobalX()/Map.TILE_W)) || 
           playerPos.y != parseInt((_player.getGlobalY()/Map.TILE_H)))
        {
            getCurrentTileOnMap()
            
            playerPos.x = parseInt((_player.getGlobalX()/Map.TILE_W));
            playerPos.y = parseInt((_player.getGlobalY()/Map.TILE_H));
                
            /* Obtem-se a matrix do perimetro do mapa visível na tela */
            cameraView = getCameraViewTiles( _map, _size );
            
            /* Tamanho da matrix de busca: e os tiles de colisão */
            grid = new PF.Grid( cameraView.width, cameraView.height, cameraView.matrix );
            
            /* Obtem-se um array com os tiles do path traçado pela lib M.I.T para o player */
            pathToPlayer = finder.findPath( parseInt((_player.getGlobalX()/Map.TILE_W)), 
                                            parseInt((_player.getGlobalY()/Map.TILE_H)), 
                                            (parseInt((x)/Map.TILE_W)), 
                                            (parseInt((y)/Map.TILE_H)), grid);
           
        }
    };
    
    
    
    
    
    
    
    
    /* Busca por caminho até o respawn: matriz com nós de tiles */
    function getPathToRespawn( _map, _size  )
    {
        if ( pathToRespawn.length <= 0 )
        { 
            getCurrentTileOnMap();
            
            /* Obtem-se a matrix do perimetro do mapa visível na tela */
            cameraView = getCameraViewTiles( _map, _size );
            
            /* Tamanho da matrix de busca: e os tiles de colisão */
            grid = new PF.Grid( cameraView.width, cameraView.height, cameraView.matrix );
            
            /* Obtem-se um array com os tiles do path traçado pela lib M.I.T para o player */
            pathToRespawn = finder.findPath( parseInt((respawn.x/Map.TILE_W)), 
                                            parseInt((respawn.y/Map.TILE_H)), 
                                            (parseInt((x)/Map.TILE_W)), 
                                            (parseInt((y)/Map.TILE_H)), grid);
        }
    };
    
    
    
    
    
    
    
    /* Retorna os limites da tela referentes ao tiles e a matrix com os tiles de colisão */
    function getCameraViewTiles( _map, _size )
    {
        /* Objeto armazenador */
        var obj = { minX: parseInt( (_map.x/Map.TILE_W) ),
                    minY: parseInt( (_map.y/Map.TILE_H) ),
                    maxX: parseInt( ( (_map.x + _size.w) / Map.TILE_W) ),
                    maxY: parseInt( ( (_map.y + _size.h) / Map.TILE_H) ),
                    width: 0,
                    height: 0,
                    matrix: null
        };
        
        /* Rastreamento dos tiles de colisão na matriz json */  
        var matrix = new Array();
        for ( var j = 0; j < Map.TILES_VERTICAL; j++ )
        {
            var coluna = new Array();
            
            for ( var i = 0; i < Map.TILES_HORIZONTAL; i++ )
            {
                var arrCollider = _map.getCollisionSprites();
                
                var jsonTile    = (j * Map.TILES_HORIZONTAL) + i;
            
                coluna.push( (arrCollider[jsonTile] - 1) > 0 ? 1: 0 );
            }
            
            matrix.push( coluna );
        }
        
        /* Size do view da câmera: os tiles visiveis na tela */
        obj.width  = matrix[0].length;
        obj.height = matrix.length;
        
        /* atualizando a matriz a ser retornada */
        obj.matrix = matrix;
        
        return obj;
    };
    
    
    
    
    
    
    /* Inimigos ativos somente se dentro do rect de view da câmera */
    function isActivedAI( _map, _size )
    {
        var state = false;
        
        if (hlf.x > 0 && hlf.x < _size.w && hlf.y > 0 && hlf.y <  _size.h )
            state = true;
        
        return state;
    };
    
    
    
    
    
    /* Obtem-se o tile referente ao map no qual o inimigo está situado */
    function getCurrentTileOnMap()
    {
        currentTile.x = parseInt( (hlf.x/Map.TILE_W) );
        currentTile.y = parseInt( (hlf.y/Map.TILE_H) );
    };
    
    
    
    
    
    
    /* Obtem-se a ditância até o player */
    function getDistanceFromPlayerInTile( _player )
    {
        var xs = 0;
        var ys = 0;
         
        xs = x - _player.getGlobalX();
        xs = xs * xs;
         
        ys = y - _player.getGlobalY();
        ys = ys * ys;
            
        return parseInt( (Math.sqrt(xs + ys))/Map.TILE_W );
    };
    
    
    
    
    
    /* Obtem-se a ditância até o respawn */
    function getDistanceFromRespawInTile(  )
    {
        var xs = 0;
        var ys = 0;
         
        xs = x - respawn.x;
        xs = xs * xs;
         
        ys = y - respawn.y;
        ys = ys * ys;
            
        return parseInt( (Math.sqrt(xs + ys))/Map.TILE_W );
    };
    
    
    
    
    
    
    /* Somente se a classe estiver loaded */
    function drawThis( _map )
    {
        if ( isready )
            _drawImage( _map, img, currentSprite, x, y );
    };


    
    
    

    /* Renderização no canvas */
    function _drawImage( _map, img, spt, posX, posY )
    {
        /* centralização do sprite e correção da posição relativa ao map in scrolling */
        hlf.x = (spt.cx + posX) - _map.x;
        hlf.y = (spt.cy + posY) - _map.y;
        
        
        ctx.drawImage( img,
                      spt.x, spt.y, spt.w, spt.h, /* origem */
                      hlf.x, hlf.y, spt.w, spt.h /* destino */ );
        
        getCurrentTileOnMap();
    };
    
    
   
    
    
    
   
    

}