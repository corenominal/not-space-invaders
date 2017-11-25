$(document).on('ready',function()
{
// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady()
// {

	// Cross-browser support for requestAnimationFrame
	//var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
	//var cancelAnimationFrame  = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame;
	

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
	var asteroids = [];
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
	var time = 1000;
	var timeMod = 0;
	var timeRemaining = 0;
	var timerbar = document.getElementById('timer');
	var sprite_frame = 0;
	var laser = [];
	var stars = [];
	var bassTime = 700; //700
	var bassBeat = 3;
	var bassPlay = true;
	var bigSprite = 2;
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

	//Sprites
	var sprite = [];
	sprite[0] = new Image();
	sprite[0].src = './img/sprite1.png';
	sprite[1] = new Image();
	sprite[1].src = './img/sprite2.png';
	sprite[2] = new Image();
	sprite[2].src = './img/sprite3.png';
	sprite[3] = new Image();
	sprite[3].src = './img/sprite4.png';
	sprite[4] = new Image();
	sprite[4].src = './img/sprite5.png';
	sprite[5] = new Image();
	sprite[5].src = './img/sprite6.png';
	sprite[6] = new Image();
	sprite[6].src = './img/sprite7.png';
	sprite[7] = new Image();
	sprite[7].src = './img/sprite8.png';

	//Big Sprites
	var spriteBig = [];
	spriteBig[0] = new Image();
	spriteBig[0].src = './img/bigSprite1.png';
	spriteBig[1] = new Image();
	spriteBig[1].src = './img/bigSprite2.png';
	spriteBig[2] = new Image();
	spriteBig[2].src = './img/bigSprite3.png';
	spriteBig[3] = new Image();
	spriteBig[3].src = './img/bigSprite4.png';

	spriteDead = new Image();
	spriteDead.src = './img/spriteDead.png';

	var spriteMotherShip = [];
	spriteMotherShip[0] = new Image();
	spriteMotherShip[0].src = './img/mothership1.png';
	spriteMotherShip[1] = new Image();
	spriteMotherShip[1].src = './img/mothership2.png';

	var spriteAsteroids = [];
	spriteAsteroids[0] = new Image();
	spriteAsteroids[0].src = './img/asteroid1.png';
	spriteAsteroids[1] = new Image();
	spriteAsteroids[1].src = './img/asteroid2.png';

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

	// var sfxGameOverRobot = new Howl(
	// {
	// 	urls: ['./sfx/GameOver-Robot.mp3', './sfx/GameOver-Robot.ogg']
	// });

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
		//timerbar.style.width = (currentCountDown() / timeRemaining) * 100 + '%';
		if(currentCountDown() <= 0)
		{
			//clearInterval(timer);
			//outOfTime();
			clearInterval(renderer);

			// Remove event listens
			document.removeEventListener('mousemove', onMouseUpdate, false);
			document.removeEventListener('mouseenter', onMouseUpdate, false);
			canvas.removeEventListener('mousedown', clickywicky, false);
			document.removeEventListener('keypress', listenKeys);

			// cancelAnimationFrame(renderer)
			// renderer = undefined;
			if(!muted) sfxGameOver.play();

			bassPlay = false;
			// TODO: Game Over!
			//alert('Out of time!');
			var gameover = document.getElementById('gameover');
			var gameover_alien = document.getElementById('gameover-alien');
			var gameover_title = document.getElementById('gameover-title');

			gameover.setAttribute('class', ''); // Show game over screen
			gameover_alien.setAttribute('class', 'flash animated'); // Flashy
			gameover_title.setAttribute('class', 'flash animated'); // Flashy
			canvas.setAttribute('class', 'gameover'); // Remove reticle

			var reloadButton = document.getElementById('reloadButton');
			reloadButton.addEventListener('click', reloadGame, false);

			//location.reload();

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
	    console.clear();
	    console.log( mouseposx + ':' + mouseposy );
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
		console.log( mouseposx );
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
			currentCountDown = createCountDown(currentCountDown() + 1000);
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
		console.log('MOFO GOD SHIP');
		if(!muted) sfxMotherShip.play();
		x = 0;
		y = 100;
		motherships[motherships.length] = {'s':0,'x':x,'y':y};
	}

	function createShips()
	{
		blocks = [];
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
			sprite_frame = Math.floor((Math.random() * sprite.length));

			blocks[blocks.length] = {'spriteCount':0,'sprite':sprite_frame,'x':x,'y':y,'dx':dx,'dy':dy};
		}
	}

	function allDead()
	{
		if(blocks.length < 1 && motherships < 1)
		{
			//createBlocks();
			//sfxRoundComplete.play();
			clearInterval(renderer);
			//cancelAnimationFrame(renderer)
			//renderer = undefined;
			//alert("Score: " + score + "\nLevel: " + level);
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
			//levelboard.setAttribute('class', '');
			main();
		}
	}

	function moveShips()
	{
		for	(index = 0; index < blocks.length; index++)
		{
			// Do movement

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

			// Do sprite
			blocks[index].spriteCount++
			if(blocks[index].spriteCount == 5)
			{
				blocks[index].spriteCount = 0
			
				if(blocks[index].sprite == 0)
				{
					blocks[index].sprite = 1;
				}
				else if(blocks[index].sprite == 1)
				{
					blocks[index].sprite = 0;
				}
				else if(blocks[index].sprite == 2)
				{
					blocks[index].sprite = 3;
				}
				else if(blocks[index].sprite == 3)
				{
					blocks[index].sprite = 2;
				}
				else if(blocks[index].sprite == 4)
				{
					blocks[index].sprite = 5;
				}
				else if(blocks[index].sprite == 5)
				{
					blocks[index].sprite = 4;
				}
				else if(blocks[index].sprite == 6)
				{
					blocks[index].sprite = 7;
				}
				else if(blocks[index].sprite == 7)
				{
					blocks[index].sprite = 6;
				}
			}
		}

	}

	function moveMotherShip()
	{
		for	(index = 0; index < motherships.length; index++)
		{
			motherships[index].x += mothershipSpeed;
			if(motherships[index].s == 0)
			{
				motherships[index].s = 1;
			}
			else
			{
				motherships[index].s = 0;
			}
			if(motherships[index].x > w)
			{
				motherships.splice(index, 1);
				sfxMotherShip.stop();
				console.log('mothership removed!');
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

	function createAsteroid()
	{
		asteroids = [];
		i = Math.floor((Math.random() * 5));
		if(i < 2)
		{
			x = Math.floor((Math.random() * (w - 150)) - 60);
			y = Math.floor((Math.random() * (h - 250)) + 60);
			asteroids[asteroids.length] = {'s':i,'x':x,'y':y};
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
		for	(index = 0; index < asteroids.length; index++)
		{
			c.drawImage(spriteAsteroids[asteroids[index].s], asteroids[index].x,asteroids[index].y);
		}

		// render ships
		for	(index = 0; index < blocks.length; index++)
		{
			c.drawImage(sprite[blocks[index].sprite], blocks[index].x,blocks[index].y,shipSize,shipSize);
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
			  //Left Laser. PEW!
			  c.beginPath();
		      c.moveTo(0, ((h / 2) - 2));
		      c.lineTo(laser[0].x, laser[0].y);
		      c.stroke();
		      c.beginPath();
		      c.moveTo(0, ((h / 2) + 2));
		      c.lineTo(laser[0].x, laser[0].y);
		      c.stroke();
		      //Right Laser. PEW!
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
		//Left Laser. PEW!
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
		bigSprite++;
		if(bigSprite == 4)
		{
			bigSprite = 0;
		}
		pc.drawImage(spriteBig[bigSprite], (pc.w / 2) - 75,(pc.h / 2) - 75);
	}

	

	var main = function()
	{
		
		createShips();
		createStars();
		createAsteroid();
		if(!muted) sfxNextLevel.play();
		//TODO: fix this,  levels too long when there are lots of ships
		timeRemaining = (time * ships) - (timeMod * ships);
		
		// Not like this, needs to have a better formula
		if( ships > 1)
			timeRemaining = (time * (ships/2)) - (timeMod * ships);

		if( ships > 5)
			timeRemaining = (time * (ships/3)) - (timeMod * ships);

		if( ships > 10)
			timeRemaining = (time * (ships/5)) - (timeMod * ships);
		
		timeMod += 100;
		console.log(timeRemaining);
		currentCountDown = createCountDown(timeRemaining);
		
		//doRender();
		render();
		renderer = setInterval(function()
		{
			render();
		}, 40); // 40
	}

	// function doRender()
	// {
	// 	render();
	// 	renderer = requestAnimationFrame(doRender);
	// }

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
        		mothershipSpeed = 5;
        		shipSize = 50;
        		break;
        	case 'medium':
        		time = 3000;
        		mothershipSpeed = 10;
        		shipSize = 40;
        		break;
        	default:
        		time = 2000;
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
//}