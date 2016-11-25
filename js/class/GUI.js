(function(){ 
    
    GUI = function() { };
    
    /* Vars da const */
    GUI.coins = 0;
    GUI.lifes  = 3;
    
    GUI.drawGUI = function( _ctx )
    { 
         if ( _ctx != null )
         {
             /* Format for coins */
            _ctx.fillStyle = '#01ff1f';
            _ctx.font = 'italic bold 30px sans-serif';
            _ctx.textBaseline = 'bottom';
            _ctx.fillText('Coins: ' + GUI.coins, 250, 40);
             
              /* Format for life */
            _ctx.fillStyle = '#ebff01';
            _ctx.font = 'italic bold 30px sans-serif';
            _ctx.textBaseline = 'bottom';
            _ctx.fillText('Lifes: ' + GUI.lifes, 450, 40);
             
         }
    };
        
})();