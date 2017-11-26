$(document).on('ready',function()
{
	// Preview canvas
	var w = window.innerWidth;
	var h = window.innerHeight;
	var wb = w - 50;
	var hb = h - 110;

	var preview = document.getElementById('preview');
	preview.innerHTML += '<canvas id="sprites" width="'+w+'" height="'+(h / 2)+'"></canvas>';
	var previewCanvas = document.getElementById('sprites');
	var pc = previewCanvas.getContext('2d');

	// Vars
	var scoreboard = document.getElementById('score');
	var levelboard = document.getElementById('level');
	var scoreboard_multiplier = document.getElementById('multiplier');
	
	// Space canvas
	var space = document.getElementById('space');
	space.innerHTML += '<canvas id="surface" width="'+w+'" height="'+h+'"></canvas>';
	var canvas = document.getElementById('surface');
	var c = canvas.getContext('2d');
	
	var blocks = [];
	var spaceObjects = [];
	var motherships = [];
	var mothershipSpeed = 10;
	var deads = [];
	var debris = [];
	var velocity = 0; // not currently used
	var velocityModifier = 1;
	canvas.addEventListener('mousedown', clickywicky, false);
	var canvas_position = canvas.getBoundingClientRect();
	var score = 0;
	var score_multiplier = 0; // for recording consecutive hits
	var level = 1;
	var ships = 1; // number of shipsat start
	var shipSize = 60;
	var time = 0; // starting time
	var timeDifficulty = 0; // time per ship
	var timeRemaining = 0;
	var timerbar = document.getElementById('timer');
	var sprite_frame = 0;
	var sprite_animation_count = 0; // used for determining if alien sprite should flip to next frame
	var laser = [];
	var stars = [];
	var bassTime = 700; //700
	var bassBeat = 3;
	var bassPlay = true;
	var bigAlienSpriteCount = 2;
	var muted = false;
	var mouseposx = null;
	var mouseposy = null;

	//localStorage.clear();
	
	if (localStorage.getItem('muted') === null)
	{
		localStorage.setItem('muted', false);
		muted = false;
	}
	else
	{
		muted = localStorage.getItem('muted');
		muted = JSON.parse(muted); // local storage does not like data!
	}

	// Handle keypress events
	document.addEventListener('keypress', listenKeys);

	// Keypress switch
	function listenKeys(e)
	{
		switch(e.key){
			// Mute all sounds
			case 'm':
				muted = !muted;
				localStorage.setItem('muted',muted);
				break;
			// Fire!
			case 'f':
				clickywicky( e );
				break;
			default:
				break;
		}
		
	}

	// Alien sprites
	var spriteAlien1 = [];
	spriteAlien1[0] = new Image();
	spriteAlien1[0].src = './img/sprite1.png';
	spriteAlien1[1] = new Image();
	spriteAlien1[1].src = './img/sprite2.png';
	
	var spriteAlien2 = [];
	spriteAlien2[0] = new Image();
	spriteAlien2[0].src = './img/sprite3.png';
	spriteAlien2[1] = new Image();
	spriteAlien2[1].src = './img/sprite4.png';
	
	var spriteAlien3 = [];
	spriteAlien3[0] = new Image();
	spriteAlien3[0].src = './img/sprite5.png';
	spriteAlien3[1] = new Image();
	spriteAlien3[1].src = './img/sprite6.png';
	
	var spriteAlien4 = [];
	spriteAlien4[0] = new Image();
	spriteAlien4[0].src = './img/sprite7.png';
	spriteAlien4[1] = new Image();
	spriteAlien4[1].src = './img/sprite8.png';

	//Big Sprites
	var spriteBigAlien = [];
	spriteBigAlien[0] = new Image();
	spriteBigAlien[0].src = './img/bigSprite1.png';
	spriteBigAlien[1] = new Image();
	spriteBigAlien[1].src = './img/bigSprite2.png';
	spriteBigAlien[2] = new Image();
	spriteBigAlien[2].src = './img/bigSprite3.png';
	spriteBigAlien[3] = new Image();
	spriteBigAlien[3].src = './img/bigSprite4.png';

	spriteDead = new Image();
	spriteDead.src = './img/spriteDead.png';

	var spriteMotherShip = [];
	spriteMotherShip[0] = new Image();
	spriteMotherShip[0].src = './img/mothership1.png';
	spriteMotherShip[1] = new Image();
	spriteMotherShip[1].src = './img/mothership2.png';

	var spriteSpaceObjects = [];
	spriteSpaceObjects[0] = new Image();
	spriteSpaceObjects[0].src = './img/asteroid1.png';
	spriteSpaceObjects[1] = new Image();
	spriteSpaceObjects[1].src = './img/asteroid2.png';

	// Audio
	var explosions = [];
	explosions[0] = new Howl(
	{
		urls: ['./sfx/Explosion1.mp3', './sfx/Explosion1.ogg']
	});
	explosions[1] = new Howl(
	{
		urls: ['./sfx/Explosion2.mp3', './sfx/Explosion2.ogg']
	});
	explosions[2] = new Howl(
	{
		urls: ['./sfx/Explosion3.mp3', './sfx/Explosion3.ogg']
	});
	explosions[3] = new Howl(
	{
		urls: ['./sfx/Explosion4.mp3', './sfx/Explosion4.ogg']
	});

	var bass = [];
	bass[0] = new Howl(
	{
		urls: ['./sfx/SpaceBass1.mp3', './sfx/SpaceBass1.ogg']
	});
	bass[1] = new Howl(
	{
		urls: ['./sfx/SpaceBass2.mp3', './sfx/SpaceBass2.ogg']
	});
	bass[2] = new Howl(
	{
		urls: ['./sfx/SpaceBass3.mp3', './sfx/SpaceBass3.ogg']
	});
	bass[3] = new Howl(
	{
		urls: ['./sfx/SpaceBass4.mp3', './sfx/SpaceBass4.ogg']
	});

	var sfxRoundComplete = new Howl(
	{
		urls: ['./sfx/RoundComplete.mp3', './sfx/RoundComplete.ogg']
	});

	var sfxNextLevel = new Howl(
	{
		urls: ['./sfx/NextLevel.mp3', './sfx/NextLevel.ogg']
	});

	var sfxGameOver = new Howl(
	{
		urls: ['./sfx/GameOver-Combined.mp3', './sfx/GameOver-Combined.ogg']
	});

	var sfxLaser = new Howl(
	{
		urls: ['./sfx/Laser.mp3', './sfx/Laser.ogg']
	});

	var sfxMotherShip = new Howl(
	{
		urls: ['./sfx/mothership.mp3', './sfx/mothership.ogg']
	});

	var sfxMotherShipExplosion = new Howl(
	{
		urls: ['./sfx/mothershipExplosion.mp3', './sfx/mothershipExplosion.ogg']
	});
	
	// Initial Canvas fills
	c.fillStyle = 'rgba(17, 20, 20, 1)';
	c.fillRect(0,0,w,h);
	pc.fillStyle = 'rgba(17, 20, 20, 1)';
	pc.fillRect(0,0,w,h);

	function createCountDown(timeRemaining)
	{
	    var startTime = Date.now();
	    return function()
	    {
	       return timeRemaining - ( Date.now() - startTime );
	    }
	}

	function doTimeBar()
	{
		if(currentCountDown() <= 0)
		{
			clearInterval(renderer);

			// Remove event listens
			document.removeEventListener('mousemove', onMouseUpdate, false);
			document.removeEventListener('mouseenter', onMouseUpdate, false);
			canvas.removeEventListener('mousedown', clickywicky, false);
			document.removeEventListener('keypress', listenKeys);

			// renderer = undefined;
			if(!muted) sfxGameOver.play();

			bassPlay = false;

			var gameover = document.getElementById('gameover');
			var gameover_alien = document.getElementById('gameover-alien');
			var gameover_title = document.getElementById('gameover-title');

			gameover.setAttribute('class', ''); // Show game over screen
			gameover_alien.setAttribute('class', 'flash animated'); // Flashy
			gameover_title.setAttribute('class', 'flash animated'); // Flashy
			canvas.setAttribute('class', 'gameover'); // Remove reticle

			var reloadButton = document.getElementById('reloadButton');
			reloadButton.addEventListener('click', reloadGame, false);

		}
	}

	// Reload the game
	function reloadGame()
	{
		location.reload();
	}

	// Update the scoreboard
	function updateScoreBoard()
	{
		var s = score.toString();
		while (s.length < 5) s = "0" + s;
		scoreboard.innerHTML = s;
	}

	// Update the multiplier scoreboard
	function updateScoreMultiplier()
	{
		scoreboard_multiplier.innerHTML = "X" + score_multiplier.toString();
	}

	document.addEventListener('mousemove', onMouseUpdate, false);
	document.addEventListener('mouseenter', onMouseUpdate, false);

	function onMouseUpdate(e)
	{
	    mouseposx = e.pageX;
	    mouseposy = e.pageY;
	}

	function getMouseX()
	{
	    return mouseposx;
	}

	function getMouseY()
	{
	    return mouseposy;
	}

	function clickywicky(e)
	{
		if( e.pageX == undefined || e.pageX == 0 )
		{
			canvas_x = getMouseX();
			canvas_y = getMouseY();
		}
		else
		{
			canvas_x = e.pageX - canvas_position.left;
			canvas_y = e.pageY - canvas_position.top;
		}

		laser[0] = {'x':canvas_x,'y':canvas_y}
		if(!muted) sfxLaser.play();
		var hit = false;
		// block hit?
		for	(index = 0; index < blocks.length; index++)
		{
			if (canvas_x <= (blocks[index].x + shipSize)
				&& blocks[index].x <= (canvas_x + 0)
				&& canvas_y <= (blocks[index].y + shipSize)
				&& blocks[index].y <= (canvas_y + 0)
				)
			{
				if (index > -1) {
					// Create dead sprite
					deads[deads.length] = {'x':blocks[index].x,'y':blocks[index].y}
					// Create debris
					createDebris('block');
					i = Math.floor((Math.random() * explosions.length));
					if(!muted) explosions[i].play();
					blocks.splice(index, 1);
					
					// Increase score
					if( score_multiplier > 1 )
					{
						score = score + ( level * score_multiplier );
					}
					else
					{
						score = score + level;	
					}
					
					var hit = true;

					// Random chance of mother ship
					var a = [3, 6, 9, 12, 15, 18];
    				if( a.indexOf( blocks.length ) != -1 )
					{
						i = Math.floor((Math.random() * 2) + 1);
						if(i == 2)
						{
							createMotherShip();
						}
					}
				}
			}
		}
		for	(index = 0; index < motherships.length; index++)
		{
			if (canvas_x <= (motherships[index].x + 75)
				&& motherships[index].x <= (canvas_x + 0)
				&& canvas_y <= (motherships[index].y + 30)
				&& motherships[index].y <= (canvas_y + 0)
				)
			{
				if (index > -1)
				{
					deads[deads.length] = {'x':motherships[index].x,'y':motherships[index].y}
					sfxMotherShip.stop();
					if(!muted) sfxMotherShipExplosion.play();
					createDebris('mothership');
					motherships.splice(index, 1);
					
					// Increase score
					if( score_multiplier > 1 )
					{
						score = score + (10 * ( level * score_multiplier ) );
					}
					else
					{
						score = score + (10 * level);
					}
					
					
					var hit = true;
				}
			}
		}

		if(hit)
		{
			currentCountDown = createCountDown(currentCountDown() + 500);
			score_multiplier++;
			updateScoreBoard();
			updateScoreMultiplier();
		}
		else
		{
			currentCountDown = createCountDown(currentCountDown() - 500);
			score_multiplier = 0;
			updateScoreMultiplier();
		}
	}

	function createDebris(type)
	{
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'n','l':i,'t':0,'x':canvas_x,'y':canvas_y}
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'ne','l':i,'t':0,'x':canvas_x,'y':canvas_y}
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'e','l':i,'t':0,'x':canvas_x,'y':canvas_y}
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'se','l':i,'t':0,'x':canvas_x,'y':canvas_y}
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'s','l':i,'t':0,'x':canvas_x,'y':canvas_y}
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'sw','l':i,'t':0,'x':canvas_x,'y':canvas_y}
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'w','l':i,'t':0,'x':canvas_x,'y':canvas_y}
		i = Math.floor((Math.random() * 400) + 150);
		debris[debris.length] = {'w':type,'d':'nw','l':i,'t':0,'x':canvas_x,'y':canvas_y}
	}

	function createMotherShip()
	{
		if(!muted) sfxMotherShip.play();
		x = 0;
		y = 100;
		y = Math.floor((Math.random() * ( h - 175 )) + 75 )
		motherships[motherships.length] = {'s':0,'x':x,'y':y};
	}

	function createShips()
	{
		blocks = [];
		var sprite_no = 1;
		for(i = 0; i < ships; i++)
		{
			x = Math.floor((Math.random() * wb));
			if(x < 50)
			{
				x = 50;
			}
			else if(x > (w - 100))
			{
				x = w - 100;
			}
			y = Math.floor((Math.random() * hb));
			if(y < 50)
			{
				y = 50;
			}
			else if(y > (h - 100))
			{
				y = h - 100;
			}

			dx = Math.floor((Math.random() * 2) + velocityModifier);
			dy = Math.floor((Math.random() * 2) + velocityModifier);
			if(Math.floor((Math.random() * 2)) == 1 )
			{
				dx =- dx;
			}
			if(Math.floor((Math.random() * 2)) == 1 )
			{
				dy =- dy;
			}

			blocks[blocks.length] = {'sprite_no':sprite_no,'sprite_frame':0,'x':x,'y':y,'dx':dx,'dy':dy};

			sprite_no++;

			if( sprite_no > 4 ) sprite_no = 1;
		}
	}

	function allDead()
	{
		if(blocks.length < 1 && motherships < 1)
		{
			clearInterval(renderer);
			level++;
			levelboard.innerHTML = 'LEVEL: ' + level;
			levelboard.setAttribute('class', 'flash animated');
			setTimeout(function()
			{
				levelboard.setAttribute('class', '');
			}, 1000);
			ships++;
			if(velocityModifier < 3)
			{
				velocityModifier++;
			}
			if(bassTime > 150)
			{
				bassTime -= 25;
			}
			if(mothershipSpeed < 20)
			{
				mothershipSpeed++;
			}
			createShips();
			main();
		}
	}

	function moveShips()
	{
		for	(index = 0; index < blocks.length; index++)
		{

			changed_direction = false;
			r = Math.floor((Math.random() * 2) + 1);

			if( blocks[index].x <= 30 || blocks[index].x >= (wb) )
			{
				changed_direction = true;
				blocks[index].dx =- blocks[index].dx;
				if(r == 2)
				{
					blocks[index].dy =- blocks[index].dy;
				}
			}

			if( blocks[index].y <= 0 || blocks[index].y >= (hb) )
			{
				changed_direction = true;
				blocks[index].dy =- blocks[index].dy;
				if(r == 2)
				{
					blocks[index].dx =- blocks[index].dx;
				}
			}

			r = Math.floor((Math.random() * 100) + 1);
			
			if(r <= 3 && !changed_direction)
			{
				blocks[index].dy =- blocks[index].dy;
			}

			if(r >= 97 && !changed_direction)
			{
				blocks[index].dx =- blocks[index].dx;
			}

			blocks[index].x+=blocks[index].dx; 
			blocks[index].y+=blocks[index].dy;

			// Do ship sprite
			if( sprite_animation_count == 0 )
				blocks[index].sprite_frame = ( blocks[index].sprite_frame == 0 ? 1 : 0 );

		}

		sprite_animation_count++;
		if( sprite_animation_count > 5 ) sprite_animation_count = 0;

	}

	function moveMotherShip()
	{
		for	(index = 0; index < motherships.length; index++)
		{
			// Move along x axis
			motherships[index].x += mothershipSpeed;

			// Toggle sprite
			motherships[index].s = ( motherships[index].s == 0 ? 1 : 0 );

			// Test if moved off canvas
			if(motherships[index].x > w)
			{
				motherships.splice(index, 1);
				sfxMotherShip.stop();
			}
		}
	}

	function doDebris()
	{
		var velocity = 10;
		for	(index = 0; index < debris.length; index++)
		{
			debris[index].t += velocity;
			if(debris[index].t > debris[index].l)
			{
				debris.splice(index, 1);
			}
			else
			{
				switch(debris[index].d)
				{	
					case 'n':
						debris[index].y -= velocity;
						break;

					case 'ne':
						debris[index].y -= velocity;
						debris[index].x += velocity;
						break;

					case 'e':
						debris[index].x += velocity;
						break;

					case 'se':
						debris[index].y += velocity;
						debris[index].x += velocity;
						break;

					case 's':
						debris[index].y += velocity;
						break;

					case 'sw':
						debris[index].y += velocity;
						debris[index].x -= velocity;
						break;

					case 'w':
						debris[index].x -= velocity;
						break;

					case 'nw':
						debris[index].y -= velocity;
						debris[index].x -= velocity;
						break;
					
					default:
						break;
				}
			}
		}
	}

	function createStars()
	{
		stars = [];
		for (i = 0; i < 20; i++)
		{
			x = Math.floor((Math.random() * w));
			y = Math.floor((Math.random() * h));
			s = Math.floor((Math.random() * 4) + 1);
			stars[stars.length] = {'s':s,'x':x,'y':y};
		}
	}

	function createSpaceObjects()
	{
		spaceObjects = [];
		i = Math.floor((Math.random() * 5));
		if(i < 2)
		{
			x = Math.floor((Math.random() * (w - 150)) - 60);
			y = Math.floor((Math.random() * (h - 250)) + 60);
			spaceObjects[spaceObjects.length] = {'s':i,'x':x,'y':y};
		}
	}

	var render = function()
	{
		doTimeBar();
		doDebris();
		moveShips();
		moveMotherShip();

		c.fillStyle = 'rgba(35, 39, 41, 0.6)'; // set alpha opacity so stars fade out
		c.fillRect(0,0,w,h);

		// render stars
		for	(index = 0; index < stars.length; index++)
		{
			opacity = (Math.random() * (0.9 - 0.1) + 0.1).toFixed(1);
			c.fillStyle = 'rgba(255,255,255, ' + opacity + ')';
		 	c.fillRect(stars[index].x,stars[index].y,stars[index].s,stars[index].s);
		}

		// render asteroid
		for	(index = 0; index < spaceObjects.length; index++)
		{
			c.drawImage(spriteSpaceObjects[spaceObjects[index].s], spaceObjects[index].x,spaceObjects[index].y);
		}

		// render ships
		for	(index = 0; index < blocks.length; index++)
		{
			switch( blocks[index].sprite_no)
			{
		    case 1:
		        c.drawImage(spriteAlien1[blocks[index].sprite_frame], blocks[index].x,blocks[index].y,shipSize,shipSize);
		        break;
		    case 2:
		        c.drawImage(spriteAlien2[blocks[index].sprite_frame], blocks[index].x,blocks[index].y,shipSize,shipSize);
		        break;
		    case 3:
		        c.drawImage(spriteAlien3[blocks[index].sprite_frame], blocks[index].x,blocks[index].y,shipSize,shipSize);
		        break;
		    default:
		        c.drawImage(spriteAlien4[blocks[index].sprite_frame], blocks[index].x,blocks[index].y,shipSize,shipSize);
			}
				
		}

		// render motherships
		for	(index = 0; index < motherships.length; index++)
		{
			c.drawImage(spriteMotherShip[motherships[index].s], motherships[index].x,motherships[index].y);
		}

		// render lasers
		if(laser.length > 0)
		{
			  c.strokeStyle = 'rgba(255,255,255, 1)';
			  c.lineWidth = 4;
			  
			  // left Laser. PEW! PEW!
			  c.beginPath();
		      c.moveTo(0, ((h / 2) - 2));
		      c.lineTo(laser[0].x, laser[0].y);
		      c.stroke();
		      c.beginPath();
		      c.moveTo(0, ((h / 2) + 2));
		      c.lineTo(laser[0].x, laser[0].y);
		      c.stroke();
		      
		      // right Laser. PEW! PEW!
		      c.beginPath();
		      c.moveTo(w, ((h / 2) - 2));
		      c.lineTo(laser[0].x, laser[0].y);
		      c.stroke();
		      c.beginPath();
		      c.moveTo(w, ((h / 2) + 2));
		      c.lineTo(laser[0].x, laser[0].y);
		      c.stroke();

		      laser.splice(0, 1);
		}

		// render deads and remove
		for	(index = 0; index < deads.length; index++)
		{
			c.drawImage(spriteDead, deads[index].x,deads[index].y);
			deads.splice(index, 1);
		}

		// render debris
		for	(index = 0; index < debris.length; index++)
		{
			debrisSize = 6;
			if(debris[index].w == 'mothership')
			{
				debrisSize = 12;
			}
			c.fillStyle = 'rgba(255,255,255, 1)';
			c.fillRect(debris[index].x,debris[index].y,debrisSize,debrisSize);
		}

		// render timebar
		perc = (currentCountDown() / timeRemaining) * 100;
		perc = (perc / 100) * h;
		c.strokeStyle = 'rgba(255,255,255, 1)';
		c.lineWidth = 30;
		c.beginPath();
		c.moveTo(0, h);
		c.lineTo(0, (h - perc));
		c.stroke();

		// have we killed everything?
		allDead();

	}

	function renderPreview()
	{
		pc.fillStyle = 'rgba(35, 39, 41, 1)';
		pc.fillRect(0,0,w,h);
		pc.w = previewCanvas.width;
		pc.h = previewCanvas.height;
		bigAlienSpriteCount++;
		if(bigAlienSpriteCount == 4)
		{
			bigAlienSpriteCount = 0;
		}
		pc.drawImage(spriteBigAlien[bigAlienSpriteCount], (pc.w / 2) - 75,(pc.h / 2) - 75);
	}

	

	var main = function()
	{
		
		createShips();
		createStars();
		createSpaceObjects();
		if(!muted) sfxNextLevel.play();
		
		//TODO: keep playing with this		
		if( ships > 1)
			time = timeDifficulty;

		timeRemaining = ( time * ships );
		
		console.log( timeRemaining );
		currentCountDown = createCountDown(timeRemaining);
		
		//doRender();
		render();
		renderer = setInterval(function()
		{
			render();
		}, 40); // 40
	}

	function SpaceBass()
	{
		if(bassPlay)
		{
			setTimeout(function()
			{
				if(bassBeat == 3)
				{
					bassBeat = 0;
				}
				else
				{
					bassBeat++;
				}
				if(!muted) bass[bassBeat].play();
				SpaceBass();
			}, bassTime);
		}
	}

	var startButtons = document.getElementsByClassName('startButton');

    var startEmUp = function() {
        var difficulty = this.getAttribute("data-difficulty");
        clearInterval(showPreview);
        switch(difficulty)
        {
        	case 'easy':
        		time = 5000;
        		timeDifficulty = 1500;
        		mothershipSpeed = 5;
        		shipSize = 50;
        		break;
        	case 'medium':
        		time = 3000;
        		timeDifficulty = 1500;
        		mothershipSpeed = 10;
        		shipSize = 40;
        		break;
        	default:
        		time = 2000;
        		timeDifficulty = 1500;
        		mothershipSpeed = 12;
        		shipSize = 30
        		break;
        }

        $('#intro').remove();
        main();
    }

    for(var i=0;i<startButtons.length;i++){
        startButtons[i].addEventListener('click', startEmUp, false);
    }
	
	SpaceBass();
	renderPreview();
	var showPreview = setInterval(function()
	{
		renderPreview();
	}, 700);

});
