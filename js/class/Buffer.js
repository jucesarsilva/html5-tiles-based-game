(function(){ 
    
    /* construtor */
    Buffer = function() { };
    
    
    /* Armazenamento dos buffers */
    var arrBuffers = new Array(); 
    
    
    
    /* Adiciona um buffer */
    Buffer.addBuffer = function( bufferName, width, height )
    {
        /* Caso não def. um bufferName, esse será 'setado' */
        bufferName = typeof bufferName !== 'undefined' ? bufferName : "bufferName_" + arrBuffers.length;
        
        var objBuffer = createBuffer( bufferName, width, height );
        
        arrBuffers.push ( objBuffer );
    };
    
    
    
    
    
    /* Retorna um array com os objetos Buffers {bufferName, buffer}*/
    Buffer.getArrObjBuffers = function()
    {
        return arrBuffers;
    };
    
    
    /* Retorna um buffer (canvas) pelo id */
    Buffer.getBufferByID = function( id )
    {
        if ( arrBuffers[id] !== undefined ) return arrBuffers[id];
        
        return null;
    };
    
    /* Retorna um buffer (canvas) pelo id */
    Buffer.getBufferByName = function( bufferName )
    {
        for ( var key in arrBuffers )
            if ( arrBuffers[key].bufferName === bufferName ) 
                return arrBuffers[key];
        
        return null;
    };
    
    
    
    
    
    /* Atualização dos canvas de buffer dado o size */
    Buffer.update = function( width, height )
    {
        for ( var key in arrBuffers )
        {
            destroyCanvas( arrBuffers[key].bufferName )
            createCanvas( arrBuffers[key].bufferName );
        }      
    };
    
    
    
    
    
    /* Criar (canvas,context) para buffer */
    function createBuffer( bufferName, width, height )
    {
        var bufferCanvas = document.createElement( "canvas" );
        bufferCanvas.setAttribute("width", width);
        bufferCanvas.setAttribute("height", height);
        bufferCanvas.setAttribute("id", bufferName );
        //content.appendChild(bufferCanvas);
        var bufferContext = bufferCanvas.getContext("2d");
        
        
        var objBuffer = { 
            "bufferName": bufferName,
            "buffer": bufferCanvas,
            "context": bufferContext
        };
        
        return objBuffer;
    };
    

})();