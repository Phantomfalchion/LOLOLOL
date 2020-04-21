			// variables
			
			var snake = new Object;
			snake['size'];
			snake['position'];
			var speed = new Object;
			speed['slow'] = 100;
			speed['medium'] = 75;
			speed['fast'] = 50;
			speed['cheetah'] = 40;
			speed['insane'] = 25;
			snake['speed'];
			var direction = new Object;
			direction['up'] = [0,-10];
			direction['down'] = [0,10];
			direction['left'] = [-10,0];
			direction['right'] = [10,0];
			snake['direction'];
			snake['dead'];
			var tail;
			var counter;
			var prey = new Object;
			prey['position'];
			prey['type'];
			prey['draw'] = function(context) {
				var image = new Image();
				image.src = prey['type']+ ".png";
				context.drawImage(image,prey['position'][0],prey['position'][1]);
			};
			prey['cherry'] = 50;
			prey['apple'] = 10;
			prey['grape'] = 5;
			prey['banana'] = 2;
			prey['onion'] = 1;
			var highscores = new Array();
			var localStorage = supports_html5_storage();
			
			// preload images
			if (document.images)
			{
				var img = new Array();
				img[0] = new Image();
				img[0].src = 'apple.png';
				img[1] = new Image();
				img[1].src = 'banana.png';
				img[2] = new Image();
				img[2].src = 'cherry.png';
				img[3] = new Image();
				img[3].src = 'grape.png';
				img[4] = new Image();
				img[4].src = 'headdown.png';
				img[5] = new Image();
				img[5].src = 'headleft.png';
				img[6] = new Image();
				img[6].src = 'headright.png';
				img[7] = new Image();
				img[7].src = 'headup.png';
				img[8] = new Image();
				img[8].src = 'leftbottom.png';
				img[9] = new Image();
				img[9].src = 'lefttop.png';
				img[10] = new Image();
				img[10].src = 'onion.png';
				img[11] = new Image();
				img[11].src = 'rightbottom.png';
				img[12] = new Image();
				img[12].src = 'righttop.png';
				img[13] = new Image();
				img[13].src = 'tailendbottom.png';
				img[14] = new Image();
				img[14].src = 'tailendleft.png';
				img[15] = new Image();
				img[15].src = 'tailendright.png';
				img[16] = new Image();
				img[16].src = 'tailendtop.png';
				img[17] = new Image();
				img[17].src = 'tailmiddle.png';
				img[18] = new Image();
				img[18].src = 'tailmiddlehorizontal.png';
			}
			
			function setup()
			{
				for(var i = 0;i<localStorage.length;i++)
				{
					highscores[i] = localStorage[i];
				}
				print_scores();
			}
			function supports_html5_storage() 
			{
				try 
				{
			    		return 'localStorage' in window && window['localStorage'] !== null;
			  	} 
			  	catch (e) 
			  	{
			    		return false;
			  	}
			}
			
			function submit()
			{
				highscores[highscores.length] = counter;
				highscores.sort(function (one, other) {
					return other - one;
				});
			}
			function check_score()
			{
				if(highscores.length < 5)
				{
					submit();
				}
				else
				{
					submit();
					highscores.pop();
				}
			}
			function print_scores()
			{
				for(var i = 0;i < highscores.length;i++)
				{
					document.getElementById("score"+ (i+1)).innerHTML = highscores[i];
					if(localStorage)
					{
						localStorage[i] = highscores[i];
					}
				}
			}
			function count()
			{
				counter += (3000 / (speed[snake['speed']]))*(prey[prey['type']]);
				document.getElementById("counter").innerHTML = counter;
			}
			function add_tail()
			{
				tail[tail.length] = [-100,100];
			}
			function move_snake()
			{
				for(var i = tail.length-1;i > 0;i--)
				{
					tail[i] = tail[i-1];
				}
				tail[0] = snake['position'].slice(0);				
				snake['position'][0] += direction[snake['direction']][0];
				snake['position'][1] += direction[snake['direction']][1];
				// too pythonic --> snake['position'] = (a+b for a, b in snake['position'], direction[snake['direction']])
			}
		
			function check_collision()
			{
				if(snake['position'][0] < 0 || 
					snake['position'][0] > 400-snake['size'] || 
					snake['position'][1] < 0 || 
					snake['position'][1] > 400-snake['size'])
				{
					snake['dead'] = true;
				}
				if(prey['position'][0] == snake['position'][0] && prey['position'][1] == snake['position'][1])
				{	
					add_tail();
					count();
					make_prey();
					
				}
				for(var i in tail)
				{
					if(snake['position'][0] == tail[i][0] && snake['position'][1] == tail[i][1])
					{
						snake['dead'] = true;
					}
				}
			}
			function check_pos_valid(pos)
			{
				if(pos === snake['position'])
				{
					return false;
				}
				for(var i = 0;i < tail.length;i++)
				{
					if(pos === tail)
					{
						return false;
					}
				}
				return true;
			}
			function make_prey()
			{
				var pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
				while(!check_pos_valid(pos))
 				{
					pos = [Math.floor(Math.random()*40),Math.floor(Math.random()*40)];
				}
				prey['position'] = new Array(pos[0]*10,pos[1]*10);
				var num = Math.floor(Math.random()*50+1);
				if(num % prey['cherry'] == 0)
				{
					prey['type'] = 'cherry';
				}
				else if(num % prey['apple'] == 0)
				{
					prey['type'] = 'apple';
				}
				else if(num % prey['grape'] == 0)
				{
					prey['type'] = 'grape';
				}
				else if(num % prey['banana'] == 0)
				{
					prey['type'] = 'banana';
				}
				else
				{
					prey['type'] = 'onion';
				}
			}
			function keyListener(e)
			{
				if(!snake['dead'])
				{
					if(!e)
					{
						e = window.event;
					}
					if(e.keyCode == 38 && (snake['direction'] == 'left' || snake['direction'] == 'right'))
					{
						snake['direction'] = 'up';
					}		
					else if(e.keyCode == 40 && (snake['direction'] == 'left' || snake['direction'] == 'right'))
					{
						snake['direction'] = 'down';
					}
					else if(e.keyCode == 37 && (snake['direction'] == 'up' || snake['direction'] == 'down'))
					{
						snake['direction'] = 'left';
					}
					else if(e.keyCode == 39 && (snake['direction'] == 'up' || snake['direction'] == 'down'))
					{
						snake['direction'] = 'right';
					}
				}
			}
			function determine_block(prev,block,next)
			{
				if (prev[1] == block[1] && block[1] == next[1])
				{
					return "tailmiddlehorizontal.png";
				}
				else if (prev[0] == block[0] && block[0] == next[0])
				{
					return "tailmiddle.png";
				}
				if (prev[0] == block[0])
				{
					if (prev[1] > block[1])
					{
						var topbottom = "bottom";
					}
					else if (prev[1] < block[1])
					{
						var topbottom = "top";
					}
					if (next[0] > block[0])
					{
						var leftright = "right";
					}
					else if (next[0] < block[0])
					{
						var leftright = "left";
					}
				}
				else if (prev[1] == block[1])
				{
					if (prev[0] > block[0])
					{
						var leftright = "right";
					}
					else if (prev[0] < block[0])
					{
						var leftright = "left";
					}
					if (next[1] > block[1])
					{
						var topbottom = "bottom";
					}
					else if (next[1] < block[1])
					{
						var topbottom = "top";
					}
				}
				return leftright + topbottom + ".png";
			}
			
			function draw()
			{
				var canvas = document.getElementById("screen");
				var context = canvas.getContext("2d");
				context.clearRect(0,0,400,400);
				var image = new Image();
				image.src = "head" + snake['direction'] + ".png";
				context.drawImage(image,snake['position'][0],snake['position'][1]);
				for (var i = 0;i < tail.length-1;i++)
				{
					var image = new Image();
					if (i == 0)
					{
						image.src = determine_block(snake['position'],tail[0],tail[1]);
					}
					else 
					{
						image.src = determine_block(tail[i-1],tail[i],tail[i+1]);
					}
					context.drawImage(image,tail[i][0],tail[i][1]);
				}
				var image = new Image();
				if (tail[tail.length-2][0] == tail[tail.length-1][0] && tail[tail.length-2][1] > tail[tail.length-1][1])
				{
					image.src = "tailendbottom.png";
				}
				else if (tail[tail.length-2][0] == tail[tail.length-1][0] && tail[tail.length-2][1] < tail[tail.length-1][1])
				{
					image.src = "tailendtop.png";
				}
				else if (tail[tail.length-2][0] > tail[tail.length-1][0] && tail[tail.length-2][1] == tail[tail.length-1][1])
				{
					image.src = "tailendright.png";
				}
				else if (tail[tail.length-2][0] < tail[tail.length-1][0] && tail[tail.length-2][1] == tail[tail.length-1][1])
				{
					image.src = "tailendleft.png";
				}
				context.drawImage(image,tail[tail.length-1][0],tail[tail.length-1][1]);
				prey['draw'](context);
			}
			function step()
			{
				move_snake();
				check_collision();
				draw();
				if(snake['dead'])
				{
					document.getElementById("result").innerHTML = "You Died!";
					document.getElementById("button").style.visibility = 'visible';
					check_score();
					print_scores();
				}
				else
				{
					wait_for_step();
				}

			}
			function wait_for_step()
			{
				setTimeout('step()',speed[snake['speed']]);
			}
			
			function game()
			{
				snake['size'] = 10;
				snake['position'] = [40,10];
				snake['speed'] = document.getElementById("speed").value;
				snake['direction'] = 'right';
				snake['dead'] = false;
				counter = 0;
				tail = new Array(new Array(30,10),new Array(20,10),new Array(10,10),new Array(0,10));
				document.getElementById("button").style.visibility = 'hidden';
				document.getElementById("result").innerHTML = "";
				document.onkeydown = keyListener;
				document.getElementById("counter").innerHTML = counter;
				make_prey();
				draw();
				wait_for_step();
			}
