/*#################################################################################################
  #                                                                                               #
  #                             Author : Julio Cesar Silva                                        #
  #                             Data : 02/12/2013                                                 #
  #                             Empresa Mstech©                                                   #
  #                                                                                               #
  #################################################################################################*/

function KeyBoard()
{
	
		/* Private PROPERTIES FOR KEYs - for get values is necessary to use methods getKey....*/
		var left  = false;
		var right = false;
		var down  = false;
		var up    = false;
		var space = false;
	
	
		// Handle keyboard controls
		var keysDown = {};
			
		window.addEventListener("keydown", function (e) 
		{
			keysDown[e.keyCode] = true;
			//window.console.log("key down");
		}, false);
			
			
		window.addEventListener("keyup", function (e) 
		{
			delete keysDown[e.keyCode];
			//window.console.log("key up");
		}, false);
			
		
		
		
		
		function upDateKeys()
		{
			
			/* config. the loop for ready class*/
			requestAnimationFrame(upDateKeys);
			
				
			// key up
			if (38 in keysDown) 
			{
				up   = true;
                down = false;
			}
			//key down
			else if (40 in keysDown)  
			{
				down = true;
				up   = false;
			}
			//none
			else
			{
				down = false;
				up   = false;
			}
			
			
			//key left
			if (37 in keysDown)
			{ 
				left  = true;
				right = false;
			}
			//key right
			else if (39 in keysDown)
			{ 
				right = true;
                left  = false;
			}
			//none
			else
			{
				left  = false;
				right = false;
			}
			
			
			/* key for player's shot*/
			if (32 in keysDown)
			{
				space = true;
			}
			else
			{
				space = false;
			}
		}
		
		
		/* methods for update status of the public keys */
		this.getKeyUp = function()
		{
			return up;
		};
		
		this.getKeyDown = function()
		{
			return down;
		};
		
		this.getKeyLeft = function()
		{
			return left;
		};
		
		this.getKeyRight = function()
		{
			return right;
		};
		
		this.getKeySpace = function()
		{
			return space;
		};
		
		
		/* first shot for method - use the same method "requestAnimationFrame()" present in the file "index.html", cuz the setTimeOut of the method is add in the high level "window"*/
		upDateKeys();
			
}/* end class*/