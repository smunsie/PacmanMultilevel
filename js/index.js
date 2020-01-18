


$(window).keydown(function(e) {
	console.log(e.keyCode);
	if (e.keyCode == 37) {
		lefts();
	}
	if (e.keyCode == 38) {
		ups();
	}
	if (e.keyCode == 39) {
		rights();
	}
	if (e.keyCode == 40) {
		downs();
	}
	//Jumping is not useful on this level
	if (e.keyCode == 32 && jumping == false) {
		jump();
		jumping = true;
	}
	
	//This is for pause
	/*if (e.keyCode == 80) {
		if (pause == false) {
			pause = true;
			Ticker.setPaused(true);
		} else if (pause == true) {
			pause = false;
			Ticker.setPaused(false);
		}
	}*/
});

//Shouldnt be used here but useful for testing.
$(window).keyup(function(e) {
	if (e.keyCode == 37) {
		stop();
	}
	if (e.keyCode == 39) {
		stop();
	}
	if (e.keyCode == 38) {
		stop();
	}
	if (e.keyCode == 40) {
		stop();
	}
});

var destroy_list = [];
var lastTimestamp = Date.now();
var fixedTimestepAccumulator = 0;
var pacmanE, pacman, ghost, ghostE, deltaS;

var SCALE = 30; STEP = 20; TIMESTEP = 1/STEP;

function init() {
	easelCanvas = document.getElementById('easelCanvas');
	box2dCanvas = document.getElementById('box2dCanvas');
	easelContext = easelCanvas.getContext('2d');
	box2dContext = box2dCanvas.getContext('2d');
	stage = new createjs.Stage(easelCanvas);
	stage.snapPixelsEnabled = true;
	
	console.log(stage.canvas.getContext('2d'));
	
	w = stage.canvas.width;
	h = stage.canvas.height;
	cw = $('#cover').width();
	ch = $('#cover').height();
	dw = w;
	dh = h;
	
	CANVAS_WIDTH = w;
	CANVAS_HEIGHT = h;
	
	//This should be your assets, not manic miner
	manifest = [
		{src: "pacman.png", id: "pacman"},
		{src: "blinky.png", id: "blinky"},
		{src: "maze.png", id: "maze"},
		{src: "pacdot.png", id: "pacdot"},
		{src: "solid.png", id: "solid"},
		{src: "spikes.png", id: "spikes"},	
		{src: "door.png", id: "door"},	
		{src: "grass.png", id: "grass"},
		{src: "road.png", id: "road"},
		{src: "water.png", id: "water"},	
		{src: "vehicle1.png", id: "vehicle1"},	
		{src: "vehicle2.png", id: "vehicle2"},	
		{src: "log.png", id: "log"},			


	];

	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", function() { loaded(); });
	loader.loadManifest(manifest, true, "assets/");
	
}

function loaded() {
	nextLevel(currentLevel);
	pause = false;
}

function nextLevel(currentLevel) {
	console.log("Current Level "+currentLevel);
	if (pause == false && currentLevel >= 0) {
		Ticker.setPaused(false);
		world = null;
		stage.removeAllChildren();
		stage.update();
   		// Store the current transformation matrix
		//easelContext.save();

		// Use the identity matrix while clearing the canvas
		//easelContext.setTransform(1, 0, 0, 1, 0, 0);
		//easelContext.clearRect(0, 0, w, h);
		//stage.x = 0
		//stage.y = -333 //Test this
		//score = score + (timeLeft*10);
		//timeLeft = 200;
	}
	console.log(gameData.levels.length);

	
	//translateX = 0;
	//translateY = -333; 
	//easelContext.translate(translateX, translateY);
	stage.x = 0
	stage.y = 0
	
	//number_of_letters = gameData.levels[currentLevel].letters.length;
	
	//world = new b2World(new b2Vec2(0, 0), false);
/* 	
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(box2dContext);
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);
	 */
	/*These things are for manic miner! Change them!*/
	var mazeImg = loader.getResult("maze");
	var pacdotImg = loader.getResult("pacdot");
	//var treeImg = loader.getResult("bush");
	var solidImg = loader.getResult("solid");
	var spikeImg = loader.getResult("spikes");
	var doorImg = loader.getResult("door");
	var grassImg = loader.getResult("grass");
	var roadImg = loader.getResult("road");
	var waterImg = loader.getResult("water");
	var vehicle1Img = loader.getResult("vehicle1");
	var vehicle2Img = loader.getResult("vehicle2");
	var logImg = loader.getResult("log");

	
	var spriteSheet = new createjs.SpriteSheet({
				framerate: 30,
				"images": [loader.getResult("pacman")],
				"frames": {"regX": 8, "height": 16, "count": 12, "regY": 8, "width": 15, "spacing":0},
				// define two animations, run (loops, 1.5x speed) and jump (returns to run):
				"animations": {
					"stand": [0, 0, "stand", 0.5],
					"run": [0, 2, "run", 0.5],
					"down": [9, 11, "down", 0.5],
					"up": [6, 8, "up", 0.5]
				}
			});
	pacmanE = new createjs.Sprite(spriteSheet, "stand");
	pacmanE.scaleX = 1.8;
	pacmanE.scaleY = 1.8;
 	
	var spriteSheet2 = new createjs.SpriteSheet({
				framerate: 30,
				"images": [loader.getResult("blinky")],
				"frames": {"regX": 8, "height": 16, "count": 8, "regY": 8, "width": 16, "spacing":0},
				// define two animations, run (loops, 1.5x speed) and jump (returns to run):
				"animations": {
					"run": [0, 1, "run",0.4]
				}
			}); 
	
	ghostE = new createjs.Sprite(spriteSheet2, "run");
	ghostE.scaleX = 1.5;
	ghostE.scaleY = 1.5; 
	
		ghostplat1E = new createjs.Sprite(spriteSheet2, "run");
	ghostplat1E.scaleX = 1.5;
	ghostplat1E.scaleY = 1.5; 
	
		ghostplat2E = new createjs.Sprite(spriteSheet2, "run");
	ghostplat2E.scaleX = 1.5;
	ghostplat2E.scaleY = 1.5; 
	
		ghostplat3E = new createjs.Sprite(spriteSheet2, "run");
	ghostplat3E.scaleX = 1.5;
	ghostplat3E.scaleY = 1.5; 
	
		ghost1E = new createjs.Sprite(spriteSheet2, "run");
	ghost1E.scaleX = 1.5;
	ghost1E.scaleY = 1.5;
		ghost2E = new createjs.Sprite(spriteSheet2, "run");
	ghost2E.scaleX = 1.5;
	ghost2E.scaleY = 1.5;
		ghost3E = new createjs.Sprite(spriteSheet2, "run");
	ghost3E.scaleX = 1.5;
	ghost3E.scaleY = 1.5;
		ghost4E = new createjs.Sprite(spriteSheet2, "run");
	ghost4E.scaleX = 1.5;
	ghost4E.scaleY = 1.5;
	
	

	Ticker.setFPS(30);
	Ticker.timingMode = createjs.Ticker.RAF;
	Ticker.addEventListener("tick", tick);
	
	var interval = setInterval(function(){ 
							if (timeLeft > 0) {
								timeLeft = timeLeft-1;
								console.log(timeLeft);
								if (endgame) {
									console.log("endgame: " + endgame);
									clearInterval(interval);
								}
							} else {
								pause = true;
								endOfGame(false);
								clearInterval(interval);
							}
							 
							},1000);
							
							
	if (gameData.levels[currentLevel].type == "grid") {
	  grid = gameData.levels[currentLevel].pacdots;
	  world = new b2World(new b2Vec2(0, 0), false);	
	  
	  console.log("world left" +worldleft)
	  
	  if (worldleft == 0){
		pacmanstart();
	  } else if (worldleft == 1) {
		  pacmanleft();
	  } else if (worldleft == 2) {
		  pacmanright();
	  }
		
		
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	var fixDef = new b2FixtureDef;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox((3/SCALE), (5/SCALE));   //  half width, half height
	fixDef.density = 1.0;
	fixDef.friction = 0;
	fixDef.restitution = 0.001;
	fixDef.isSensor = true;
	bodyDef.position.x = (110)/SCALE; 
	bodyDef.position.y = (30)/SCALE;
	sensor1 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor1.GetBody().SetUserData({id: "1"});
	
	bodyDef.position.x = (110)/SCALE; 
	bodyDef.position.y = (480)/SCALE;
	sensor2 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor2.GetBody().SetUserData({id: "2"});
	
	bodyDef.position.x = (358)/SCALE; 
	bodyDef.position.y = (30)/SCALE;
	sensor3 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor3.GetBody().SetUserData({id: "3"});
	
	bodyDef.position.x = (358)/SCALE; 
	bodyDef.position.y = (480)/SCALE;
	sensor4 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor4.GetBody().SetUserData({id: "4"});
	
	bodyDef.position.x = (30)/SCALE; 
	bodyDef.position.y = (175)/SCALE;
	sensor5 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor5.GetBody().SetUserData({id: "5"});
	
	bodyDef.position.x = (30)/SCALE; 
	bodyDef.position.y = (305)/SCALE;
	sensor6 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor6.GetBody().SetUserData({id: "6"});
	
	bodyDef.position.x = (440)/SCALE; 
	bodyDef.position.y = (175)/SCALE;
	sensor7 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor7.GetBody().SetUserData({id: "7"});
	
	bodyDef.position.x = (440)/SCALE; 
	bodyDef.position.y = (305)/SCALE;
	sensor8 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	sensor8.GetBody().SetUserData({id: "8"});
		
		
	var bodyDefghost = new b2BodyDef;
	bodyDefghost.type = b2Body.b2_dynamicBody;
	var fixDefghost = new b2FixtureDef;
	fixDefghost.shape = new b2PolygonShape;
	fixDefghost.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefghost.density = 1.0;
	fixDefghost.friction = 0;
	fixDefghost.restitution = 0;
	fixDefghost.isSensor = true;
	bodyDefghost.position.x = (110) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (200)/SCALE;
	ghost1 = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghost1.GetBody().SetUserData({id: "ghost1"});
	ghost1.GetBody().SetLinearVelocity(new b2Vec2(ghost1.GetBody().GetLinearVelocity().x, -2.4));
	
	bodyDefghost.position.x = (358) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (250)/SCALE;
	ghost2 = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghost2.GetBody().SetUserData({id: "ghost2"});
	ghost2.GetBody().SetLinearVelocity(new b2Vec2(ghost2.GetBody().GetLinearVelocity().x, -2.4));
	
	
	bodyDefghost.position.x = (30) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (250)/SCALE;
	ghost3 = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghost3.GetBody().SetUserData({id: "ghost3"});
	ghost3.GetBody().SetLinearVelocity(new b2Vec2(ghost3.GetBody().GetLinearVelocity().x, -1.5));
	
	bodyDefghost.position.x = (440) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (250)/SCALE;
	ghost4 = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghost4.GetBody().SetUserData({id: "ghost4"});
	ghost4.GetBody().SetLinearVelocity(new b2Vec2(ghost4.GetBody().GetLinearVelocity().x, -1.5));
	
	
	
	
	




	  
	  for (var i = 0; i < (grid.length); i++) {
	    for (j = 0; j < (grid[0].length); j++) {
	        if (grid[i][j] == 1) {
			  createDots(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*25+8) + '/SCALE', (i*23.5+8) + '/SCALE', {"id" : "pacdots"}, false)
		    }  
		}
	  }
	} 
	
		function createDots(density, friction, restitution, wi, hi, static, x, y, userdata, sensor) {
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2CircleShape(0.1); 
		//fixDef.shape.SetAsBox(eval(wi), eval(hi)); 
		fixDef.isSensor = true;
	
		var bodyDef = new b2BodyDef;
		if (static) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			//TODO: handle dynamic	
		}
		//console.log("x");
		bodyDef.position.x = eval(x);
		bodyDef.position.y = eval(y);
		
		var body;
		
		userDataJSON = {};
		
			if (userdata.hasOwnProperty('id')) {
			userDataJSON["id"] = userdata.id;
			pacdotE = new createjs.Shape();
			pacdotE.graphics.beginBitmapFill(pacdotImg).drawRect(0, 0, eval(wi)*SCALE-3, eval(hi)*SCALE-3);
			pacdotE.tileW = pacdotImg.width;
			pacdotE.y = eval(y)*SCALE-eval(hi)*SCALE+4;
			pacdotE.x = eval(x)*SCALE-eval(wi)*SCALE+5.5;
			pacdotsGen = world.CreateBody(bodyDef).CreateFixture(fixDef);
			pacdotsGen.GetBody().SetUserData({id:"pacdots"});
			stage.addChild(pacdotE);
			console.log(pacdotsGen.GetBody().GetUserData().id);
			
		}
	

	}
							
						
							
	
	if (gameData.levels[currentLevel].type == "grid") {
	  grid = gameData.levels[currentLevel].level;
	  console.log(w,h);
	  	mazeE = new createjs.Shape();
		mazeE.graphics.beginBitmapFill(loader.getResult("maze"), "no-repeat").drawRect(0,0,w,h);
		mazeE.scaleX = 2;
		mazeE.scaleY = 2;
		stage.addChild(mazeE);
	  for (var i = 0; i < (grid.length); i++) {
	    for (j = 0; j < (grid[0].length); j++) {
	        if (grid[i][j] == 1) {
			  createBodies(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16+8) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "ground"}, false)
		    } else if (grid[i][j] == 2) {
		      createBodies(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "left"}, true)
		    } else if (grid[i][j] == 3) {
		      createBodies(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16+16) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "right"}, true)
		    } 
		}
	  }
	} 
		
	function createBodies(density, friction, restitution, wi, hi, static, x, y, userdata, sensor) {
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape; 
		fixDef.shape.SetAsBox(eval(wi), eval(hi)); 
		fixDef.isSensor = sensor;
	
		var bodyDef = new b2BodyDef;
		if (static) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			//TODO: handle dynamic	
		}
		//console.log("x");
		bodyDef.position.x = eval(x);
		bodyDef.position.y = eval(y);
		
		var body;
		
		userDataJSON = {};
		
		
	
		if (userdata.hasOwnProperty('id')) {
			userDataJSON["id"] = userdata.id;
			body = world.CreateBody(bodyDef).CreateFixture(fixDef);
		}

		if (userdata.hasOwnProperty('pos')) {
			userDataJSON["pos"] = userdata.pos;
		}
		if (body != undefined) {
			body.GetBody().SetUserData(userDataJSON);
		} else if (movingB2W[movIt] != undefined) {
			movingB2W[movIt].GetBody().SetUserData(userDataJSON);
			movIt++;
		}
	}
	 
	 
	 // PLATFORM LEVELS
	 
	 
	 if (gameData.levels[currentLevel].type == "platform") {
		 platform = gameData.levels[currentLevel].level;
		 world = new b2World(new b2Vec2(0, 9.81), false);
		 console.log(world);
		 pacmanplatform();
		 
		 	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	var fixDef = new b2FixtureDef;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox((3/SCALE), (5/SCALE));   //  half width, half height
	fixDef.density = 1.0;
	fixDef.friction = 0;
	fixDef.restitution = 0.001;
	fixDef.isSensor = true;
	bodyDef.position.x = (250)/SCALE; 
	bodyDef.position.y = (60)/SCALE;
	left1 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	left1.GetBody().SetUserData({id: "left1"});
	
	bodyDef.position.x = (440)/SCALE; 
	bodyDef.position.y = (60)/SCALE;
	right1 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	right1.GetBody().SetUserData({id: "right1"});
	
	bodyDef.position.x = (60)/SCALE; 
	bodyDef.position.y = (260)/SCALE;
	left2 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	left2.GetBody().SetUserData({id: "left2"});
	
	bodyDef.position.x = (245)/SCALE; 
	bodyDef.position.y = (260)/SCALE;
	right2 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	right2.GetBody().SetUserData({id: "right2"});
	
	bodyDef.position.x = (120)/SCALE; 
	bodyDef.position.y = (440)/SCALE;
	left3 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	left3.GetBody().SetUserData({id: "left3"});
	
	bodyDef.position.x = (310)/SCALE; 
	bodyDef.position.y = (440)/SCALE;
	right3 = world.CreateBody(bodyDef).CreateFixture(fixDef);
	right3.GetBody().SetUserData({id: "right3"});
	
	
		var bodyDefghost = new b2BodyDef;
	bodyDefghost.type = b2Body.b2_dynamicBody;
	var fixDefghost = new b2FixtureDef;
	fixDefghost.shape = new b2PolygonShape;
	fixDefghost.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefghost.density = 1.0;
	fixDefghost.friction = 0;
	fixDefghost.restitution = 0;
	bodyDefghost.position.x = (290) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (50)/SCALE;
	ghostplat1 = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghostplat1.GetBody().SetUserData({id: "ghostplat1"});
	ghostplat1.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat1.GetBody().GetLinearVelocity().y));
	
	bodyDefghost.position.x = (200) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (250)/SCALE;
	ghostplat2 = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghostplat2.GetBody().SetUserData({id: "ghostplat2"});
	ghostplat2.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat2.GetBody().GetLinearVelocity().y));
	
	
	bodyDefghost.position.x = (200) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (430)/SCALE;
	ghostplat3 = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghostplat3.GetBody().SetUserData({id: "ghostplat3"});
	ghostplat3.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat3.GetBody().GetLinearVelocity().y));
	
	
	
	
	
		 
		 
		 
		 
		 
		 	  for (var i = 0; i < (platform.length); i++) {
	    for (j = 0; j < (platform[0].length); j++) {
	        if (platform[i][j] == 1) {
			  createBodies2(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16+8) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "ground"}, false)
		    } else if (platform[i][j] == 2) {
		      createBodies3(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16+8) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "spike"}, true)
		    } 
		}
	  }
	  

	} 
		
	function createBodies2(density, friction, restitution, wi, hi, static, x, y, userdata, sensor) {
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape; 
		fixDef.shape.SetAsBox(eval(wi), eval(hi)); 
		fixDef.isSensor = sensor;
	
		var bodyDef = new b2BodyDef;
		if (static) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			//TODO: handle dynamic	
		}
		//console.log("x");
		bodyDef.position.x = eval(x);
		bodyDef.position.y = eval(y);
		
		var body;
		
		userDataJSON = {};
	
		if (userdata.hasOwnProperty('id')) {
			userDataJSON["id"] = userdata.id;
			groundE = new createjs.Shape();
			groundE.graphics.beginBitmapFill(solidImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
			groundE.tileW = solidImg.width;
			groundE.y = eval(y)*SCALE-eval(hi)*SCALE*2 + 12;
			groundE.x = eval(x)*SCALE-eval(wi)*SCALE;
			body = world.CreateBody(bodyDef).CreateFixture(fixDef);
			stage.addChild(groundE);
		}
		if (userdata.hasOwnProperty('class')) {
			userDataJSON["class"] = userdata.class;
			if (userdata.class == "moving") {
				moving[movIt] = new createjs.Shape();
				moving[movIt].graphics.beginBitmapFill(solidImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
				moving[movIt].tileH = solidImg.height;
				moving[movIt].y = eval(y)*SCALE-eval(hi)*SCALE*2;
				moving[movIt].x = eval(x)*SCALE-eval(wi)*SCALE;
				stage.addChild(moving[movIt]);
				movingB2W[movIt] = world.CreateBody(bodyDef).CreateFixture(fixDef);
				userDataJSON["val"] = movIt;
			}
		}
		if (userdata.hasOwnProperty('pos')) {
			userDataJSON["pos"] = userdata.pos;
		}
		if (body != undefined) {
			body.GetBody().SetUserData(userDataJSON);
		} else if (movingB2W[movIt] != undefined) {
			movingB2W[movIt].GetBody().SetUserData(userDataJSON);
			movIt++;
		}
	}
	
		function createBodies3(density, friction, restitution, wi, hi, static, x, y, userdata, sensor) {
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape; 
		fixDef.shape.SetAsBox(eval(wi), eval(hi)); 
		fixDef.isSensor = sensor;
	
		var bodyDef = new b2BodyDef;
		if (static) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			//TODO: handle dynamic	
		}
		//console.log("x");
		bodyDef.position.x = eval(x);
		bodyDef.position.y = eval(y);
		
		var body;
		
		userDataJSON = {};
	
		if (userdata.hasOwnProperty('id')) {
			userDataJSON["id"] = userdata.id;
			groundE = new createjs.Shape();
			groundE.graphics.beginBitmapFill(spikeImg).drawRect(0,0, 20, 20);
			groundE.tileW = spikeImg.width;
			groundE.y = eval(y)*SCALE-eval(hi)*SCALE*2 + 12;
			groundE.x = eval(x)*SCALE-eval(wi)*SCALE;
			body = world.CreateBody(bodyDef).CreateFixture(fixDef);
			stage.addChild(groundE);
		}
		if (userdata.hasOwnProperty('class')) {
			userDataJSON["class"] = userdata.class;
			if (userdata.class == "moving") {
				moving[movIt] = new createjs.Shape();
				moving[movIt].graphics.beginBitmapFill(spikeImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
				moving[movIt].tileH = spikeImg.height;
				moving[movIt].y = eval(y)*SCALE-eval(hi)*SCALE*2;
				moving[movIt].x = eval(x)*SCALE-eval(wi)*SCALE;
				stage.addChild(moving[movIt]);
				movingB2W[movIt] = world.CreateBody(bodyDef).CreateFixture(fixDef);
				userDataJSON["val"] = movIt;
			}
		}
		if (userdata.hasOwnProperty('pos')) {
			userDataJSON["pos"] = userdata.pos;
		}
		if (body != undefined) {
			body.GetBody().SetUserData(userDataJSON);
		} else if (movingB2W[movIt] != undefined) {
			movingB2W[movIt].GetBody().SetUserData(userDataJSON);
			movIt++;
		}
	} 
	

	
	// Frogger stuff
	
		 if (gameData.levels[currentLevel].type == "topdown") {
		 platform = gameData.levels[currentLevel].level;
		 world = new b2World(new b2Vec2(0, 0), false);
		 console.log(world);
		 
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	var fixDef = new b2FixtureDef;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox((5/SCALE), (600/SCALE));   //  half width, half height
	fixDef.density = 1.0;
	fixDef.friction = 0;
	fixDef.restitution = 0.001;
	bodyDef.position.x = (0)/SCALE; 
	bodyDef.position.y = (500)/SCALE;
	topdownLeft = world.CreateBody(bodyDef).CreateFixture(fixDef);
	topdownLeft.GetBody().SetUserData({id: "topdownLeft"});
	
	bodyDef.position.x = (460)/SCALE; 
	bodyDef.position.y = (500)/SCALE;
	topdownRight = world.CreateBody(bodyDef).CreateFixture(fixDef);
	topdownRight.GetBody().SetUserData({id: "topdownRight"});
		 
		 
		 
		 

	

	pacmantopdown();
	
		 
		 
	vehiclespawn();
	
	logspawn1();
	logspawn3();
	logspawn5();
	logspawn7();

		

		
		 
		 	  for (var i = 0; i < (platform.length); i++) {
	    for (j = 0; j < (platform[0].length); j++) {
	        if (platform[i][j] == 1) {
			  createBodies4(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16+8) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "ground"}, true)
		    } else if (platform[i][j] == 2) {
			  createBodies5(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16+8) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "road"}, true)
			} else if (platform[i][j] == 3) {
				createBodies6(1, 0, 0, '8/SCALE', '8/SCALE', true, (j*16+8) + '/SCALE', (i*16+8) + '/SCALE', {"id" : "water"}, true)
			}
		}
	  }
	} 
	
			function createBodies4(density, friction, restitution, wi, hi, static, x, y, userdata, sensor) {
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape; 
		fixDef.shape.SetAsBox(eval(wi), eval(hi)); 
		fixDef.isSensor = sensor;
	
		var bodyDef = new b2BodyDef;
		if (static) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			//TODO: handle dynamic	
		}
		//console.log("x");
		bodyDef.position.x = eval(x);
		bodyDef.position.y = eval(y);
		
		var body;
		
		userDataJSON = {};
	
		if (userdata.hasOwnProperty('id')) {
			userDataJSON["id"] = userdata.id;
			grassE = new createjs.Shape();
			grassE.graphics.beginBitmapFill(grassImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
			grassE.tileW = spikeImg.width;
			grassE.y = eval(y)*SCALE-eval(hi)*SCALE*2 + 12;
			grassE.x = eval(x)*SCALE-eval(wi)*SCALE;
			body = world.CreateBody(bodyDef).CreateFixture(fixDef);
			stage.addChild(grassE);
		}
		if (userdata.hasOwnProperty('class')) {
			userDataJSON["class"] = userdata.class;
			if (userdata.class == "moving") {
				moving[movIt] = new createjs.Shape();
				moving[movIt].graphics.beginBitmapFill(grassImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
				moving[movIt].tileH = grassImg.height;
				moving[movIt].y = eval(y)*SCALE-eval(hi)*SCALE*2;
				moving[movIt].x = eval(x)*SCALE-eval(wi)*SCALE;
				stage.addChild(moving[movIt]);
				movingB2W[movIt] = world.CreateBody(bodyDef).CreateFixture(fixDef);
				userDataJSON["val"] = movIt;
			}
		}
		if (userdata.hasOwnProperty('pos')) {
			userDataJSON["pos"] = userdata.pos;
		}
		if (body != undefined) {
			body.GetBody().SetUserData(userDataJSON);
		} else if (movingB2W[movIt] != undefined) {
			movingB2W[movIt].GetBody().SetUserData(userDataJSON);
			movIt++;
		}
		

	
	} 
	
		function createBodies5(density, friction, restitution, wi, hi, static, x, y, userdata, sensor) {
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape; 
		fixDef.shape.SetAsBox(eval(wi), eval(hi)); 
		fixDef.isSensor = sensor;
	
		var bodyDef = new b2BodyDef;
		if (static) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			//TODO: handle dynamic	
		}
		//console.log("x");
		bodyDef.position.x = eval(x);
		bodyDef.position.y = eval(y);
		
		var body;
		
		userDataJSON = {};
	
		if (userdata.hasOwnProperty('id')) {
			userDataJSON["id"] = userdata.id;
			roadE = new createjs.Shape();
			roadE.graphics.beginBitmapFill(roadImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
			roadE.tileW = roadImg.width;
			roadE.y = eval(y)*SCALE-eval(hi)*SCALE*2 + 12;
			roadE.x = eval(x)*SCALE-eval(wi)*SCALE;
			body = world.CreateBody(bodyDef).CreateFixture(fixDef);
			stage.addChild(roadE);
		}
		if (userdata.hasOwnProperty('class')) {
			userDataJSON["class"] = userdata.class;
			if (userdata.class == "moving") {
				moving[movIt] = new createjs.Shape();
				moving[movIt].graphics.beginBitmapFill(roadImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
				moving[movIt].tileH = roadImg.height;
				moving[movIt].y = eval(y)*SCALE-eval(hi)*SCALE*2;
				moving[movIt].x = eval(x)*SCALE-eval(wi)*SCALE;
				stage.addChild(moving[movIt]);
				movingB2W[movIt] = world.CreateBody(bodyDef).CreateFixture(fixDef);
				userDataJSON["val"] = movIt;
			}
		}
		if (userdata.hasOwnProperty('pos')) {
			userDataJSON["pos"] = userdata.pos;
		}
		if (body != undefined) {
			body.GetBody().SetUserData(userDataJSON);
		} else if (movingB2W[movIt] != undefined) {
			movingB2W[movIt].GetBody().SetUserData(userDataJSON);
			movIt++;
		}
	} 
	
			function createBodies6(density, friction, restitution, wi, hi, static, x, y, userdata, sensor) {
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape; 
		fixDef.shape.SetAsBox(eval(wi), eval(hi)); 
		fixDef.isSensor = sensor;
	
		var bodyDef = new b2BodyDef;
		if (static) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			//TODO: handle dynamic	
		}
		//console.log("x");
		bodyDef.position.x = eval(x);
		bodyDef.position.y = eval(y);
		
		var body;
		
		userDataJSON = {};
	
		if (userdata.hasOwnProperty('id')) {
			userDataJSON["id"] = userdata.id;
			waterE = new createjs.Shape();
			waterE.graphics.beginBitmapFill(waterImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
			waterE.tileW = waterImg.width;
			waterE.y = eval(y)*SCALE-eval(hi)*SCALE*2 + 12;
			waterE.x = eval(x)*SCALE-eval(wi)*SCALE;
			body = world.CreateBody(bodyDef).CreateFixture(fixDef);
			stage.addChild(waterE);
		}
		if (userdata.hasOwnProperty('class')) {
			userDataJSON["class"] = userdata.class;
			if (userdata.class == "moving") {
				moving[movIt] = new createjs.Shape();
				moving[movIt].graphics.beginBitmapFill(waterImg).drawRect(0, 0, eval(wi)*SCALE*2, eval(hi)*SCALE*2);
				moving[movIt].tileH = waterImg.height;
				moving[movIt].y = eval(y)*SCALE-eval(hi)*SCALE*2;
				moving[movIt].x = eval(x)*SCALE-eval(wi)*SCALE;
				stage.addChild(moving[movIt]);
				movingB2W[movIt] = world.CreateBody(bodyDef).CreateFixture(fixDef);
				userDataJSON["val"] = movIt;
			}
		}
		if (userdata.hasOwnProperty('pos')) {
			userDataJSON["pos"] = userdata.pos;
		}
		if (body != undefined) {
			body.GetBody().SetUserData(userDataJSON);
		} else if (movingB2W[movIt] != undefined) {
			movingB2W[movIt].GetBody().SetUserData(userDataJSON);
			movIt++;
		}
	} 
	
	function vehiclespawn() {

	
	

				 	var bodyDefvehicle = new b2BodyDef;
					bodyDefvehicle.type = b2Body.b2_dynamicBody;
					var fixDefvehicle = new b2FixtureDef;
					fixDefvehicle.shape = new b2PolygonShape;
					fixDefvehicle.shape.SetAsBox((40/SCALE), (20/SCALE));   //  half width, half height
					fixDefvehicle.density = 1.0;
					fixDefvehicle.friction = 0;
					fixDefvehicle.restitution = 0.001;
					fixDefvehicle.isSensor = true;
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (440)/SCALE;
					vehicle1 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					vehicle1.GetBody().SetUserData({id: "vehicle1"});
					vehicle1.GetBody().SetLinearVelocity(new b2Vec2(-2, vehicle1.GetBody().GetLinearVelocity().y));
					vehicle1E = new createjs.Shape();
					vehicle1E.graphics.beginBitmapFill(vehicle1Img).drawRect(0, 0, 86,41);
				
					
					
					bodyDefvehicle.position.x = (0)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (380)/SCALE;
					vehicle2 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					vehicle2.GetBody().SetUserData({id: "vehicle"});
					vehicle2.GetBody().SetLinearVelocity(new b2Vec2(2, vehicle2.GetBody().GetLinearVelocity().y));
					vehicle2E = new createjs.Shape();
					vehicle2E.graphics.beginBitmapFill(vehicle2Img).drawRect(0, 0, 86,40);
					
					
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (330)/SCALE;
					vehicle3 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					vehicle3.GetBody().SetUserData({id: "vehicle"});
					vehicle3.GetBody().SetLinearVelocity(new b2Vec2(-2, vehicle3.GetBody().GetLinearVelocity().y));
					vehicle3E = new createjs.Shape();
					vehicle3E.graphics.beginBitmapFill(vehicle1Img).drawRect(0, 0, 86,41);
					
					
				
								 
			 
	}
	

		
		
		// creating logs
		
		function logspawn1() {
					var bodyDefvehicle = new b2BodyDef;
					bodyDefvehicle.type = b2Body.b2_dynamicBody;
					var fixDefvehicle = new b2FixtureDef;
					fixDefvehicle.shape = new b2PolygonShape;
					fixDefvehicle.shape.SetAsBox((60/SCALE), (15/SCALE));   //  half width, half height
					fixDefvehicle.density = 1.0;
					fixDefvehicle.friction = 0;
					fixDefvehicle.restitution = 0.001;
					fixDefvehicle.isSensor = true;
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (80)/SCALE;
					log1 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log1.GetBody().SetUserData({id: "log1"});
					log1.GetBody().SetLinearVelocity(new b2Vec2(-1.5, log1.GetBody().GetLinearVelocity().y));
					log1E = new createjs.Shape();
				    log1E.graphics.beginBitmapFill(logImg).drawRect(0, 0, 126,31);
				
		}
		


		function logspawn3() {
					var bodyDefvehicle = new b2BodyDef;
					bodyDefvehicle.type = b2Body.b2_dynamicBody;
					var fixDefvehicle = new b2FixtureDef;
					fixDefvehicle.shape = new b2PolygonShape;
					fixDefvehicle.shape.SetAsBox((60/SCALE), (15/SCALE));   //  half width, half height
					fixDefvehicle.density = 1.0;
					fixDefvehicle.friction = 0;
					fixDefvehicle.restitution = 0.001;
					fixDefvehicle.isSensor = true;
					bodyDefvehicle.position.x = (0)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (120)/SCALE;
					log3 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log3.GetBody().SetUserData({id: "log3"});
					log3.GetBody().SetLinearVelocity(new b2Vec2(1.5, log3.GetBody().GetLinearVelocity().y));
					log3E = new createjs.Shape();
				    log3E.graphics.beginBitmapFill(logImg).drawRect(0, 0, 126,31);
				
		}


		function logspawn5() {
							 	var bodyDefvehicle = new b2BodyDef;
					bodyDefvehicle.type = b2Body.b2_dynamicBody;
					var fixDefvehicle = new b2FixtureDef;
					fixDefvehicle.shape = new b2PolygonShape;
					fixDefvehicle.shape.SetAsBox((60/SCALE), (15/SCALE));   //  half width, half height
					fixDefvehicle.density = 1.0;
					fixDefvehicle.friction = 0;
					fixDefvehicle.restitution = 0.001;
					fixDefvehicle.isSensor = true;
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (170)/SCALE;
					log5 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log5.GetBody().SetUserData({id: "log5"});
					log5.GetBody().SetLinearVelocity(new b2Vec2(-1.5, log5.GetBody().GetLinearVelocity().y));
					log5E = new createjs.Shape();
				    log5E.graphics.beginBitmapFill(logImg).drawRect(0, 0, 126,31);
				
		}
		

		function logspawn7() {
					var bodyDefvehicle = new b2BodyDef;
					bodyDefvehicle.type = b2Body.b2_dynamicBody;
					var fixDefvehicle = new b2FixtureDef;
					fixDefvehicle.shape = new b2PolygonShape;
					fixDefvehicle.shape.SetAsBox((60/SCALE), (15/SCALE));   //  half width, half height
					fixDefvehicle.density = 1.0;
					fixDefvehicle.friction = 0;
					fixDefvehicle.restitution = 0.001;
					fixDefvehicle.isSensor = true;
					bodyDefvehicle.position.x = (0)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (210)/SCALE;
					log7 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log7.GetBody().SetUserData({id: "log7"});
					log7.GetBody().SetLinearVelocity(new b2Vec2(1.5, log7.GetBody().GetLinearVelocity().y));
					log7E = new createjs.Shape();
				    log7E.graphics.beginBitmapFill(logImg).drawRect(0, 0, 126,31);
				
		}



		
	 if (gameData.levels[currentLevel].type == "platform") {	
	var bodyDefdoor = new b2BodyDef;
	bodyDefdoor.type = b2Body.b2_staticBody;
	var fixDefdoor = new b2FixtureDef;
	fixDefdoor.shape = new b2PolygonShape;
	fixDefdoor.shape.SetAsBox((10/SCALE), (14/SCALE));   //  half width, half height
	bodyDefdoor.position.x = (567)/SCALE; //positions the center of the object (not upper left);
	bodyDefdoor.position.y = (420)/SCALE;
	door = world.CreateBody(bodyDefdoor).CreateFixture(fixDefdoor);
	door.GetBody().SetUserData({id: "doorplatform"});
	door.GetBody().SetFixedRotation(true);
	
	doorE = new createjs.Shape();
	doorE.graphics.beginBitmapFill(doorImg).drawRect(0, 0, 35,35);
	doorE.y = door.GetBody().GetPosition().y*SCALE - 20;
	doorE.x = door.GetBody().GetPosition().x*SCALE-25;
	stage.addChild(doorE);
	 	
	 }
	 	 if (gameData.levels[currentLevel].type == "topdown") {	
	var bodyDefdoor = new b2BodyDef;
	bodyDefdoor.type = b2Body.b2_staticBody;
	var fixDefdoor = new b2FixtureDef;
	fixDefdoor.shape = new b2PolygonShape;
	fixDefdoor.shape.SetAsBox((10/SCALE), (14/SCALE));   //  half width, half height
	bodyDefdoor.position.x = (240)/SCALE; //positions the center of the object (not upper left);
	bodyDefdoor.position.y = (20)/SCALE;
	door = world.CreateBody(bodyDefdoor).CreateFixture(fixDefdoor);
	door.GetBody().SetUserData({id: "doortopdown"});
	door.GetBody().SetFixedRotation(true);
	
	door2E = new createjs.Shape();
	door2E.graphics.beginBitmapFill(doorImg).drawRect(0, 0, 39,35);
	door2E.y = door.GetBody().GetPosition().y*SCALE - 20;
	door2E.x = door.GetBody().GetPosition().x*SCALE-25;
	stage.addChild(door2E);
	 	
	 }
	 
	if (gameData.levels[currentLevel].type == "topdown") {
	stage.addChild( ghostE, log1E, log3E, log5E, log7E, vehicle1E, vehicle2E, vehicle3E);
	}
	
	if (gameData.levels[currentLevel].type == "platform") {
	stage.addChild( ghostplat1E,ghostplat2E,ghostplat3E);
	}
	 
	 if (gameData.levels[currentLevel].type == "grid") {
	stage.addChild( ghost1E,ghost2E,ghost3E,ghost4E);
	}
	 
	 
	 
/* 	var bodyDefpacman = new b2BodyDef;
	bodyDefpacman.type = b2Body.b2_dynamicBody;
	var fixDefpacman = new b2FixtureDef;
	fixDefpacman.shape = new b2PolygonShape;
	fixDefpacman.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefpacman.density = 1.0;
	fixDefpacman.friction = 0;
	fixDefpacman.restitution = 0.001;
	bodyDefpacman.position.x = (40)/SCALE; //positions the center of the object (not upper left);
	bodyDefpacman.position.y = (32)/SCALE;
	pacman = world.CreateBody(bodyDefpacman).CreateFixture(fixDefpacman);
	pacman.GetBody().SetUserData({id: "pacman", lives: player_life});
	pacman.GetBody().SetFixedRotation(true); 
	
	posArrayX = [];
	posArrayY = [];
	posArrayX[0] = pacman.GetBody().GetWorldCenter().x*SCALE;
	posArrayY[0] = pacman.GetBody().GetWorldCenter().y*SCALE;
	
	var bodyDefghost = new b2BodyDef;
	bodyDefghost.type = b2Body.b2_dynamicBody;
	var fixDefghost = new b2FixtureDef;
	fixDefghost.shape = new b2PolygonShape;
	fixDefghost.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefghost.density = 1.0;
	fixDefghost.friction = 0;
	fixDefghost.restitution = 0;
	bodyDefghost.position.x = (350) / SCALE; //positions the center of the object (not upper left);
	bodyDefghost.position.y = (32)/SCALE;
	ghost = world.CreateBody(bodyDefghost).CreateFixture(fixDefghost);
	ghost.GetBody().SetUserData({id: "ghost"});
	ghost.GetBody().SetFixedRotation(true);
	
	stage.addChild( ghostE); */

		var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(box2dContext);
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);
	
	
	
	
	
	var listener = new Box2D.Dynamics.b2ContactListener;

	listener.BeginContact = function(contact) {
		if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			elementAId = contact.GetFixtureA().GetBody().GetUserData().id;
			elementBId = contact.GetFixtureB().GetBody().GetUserData().id;
			console.log(elementAId + " - " + elementBId)
			elementAclass = contact.GetFixtureA().GetBody().GetUserData().class;
			elementBclass = contact.GetFixtureB().GetBody().GetUserData().class;
			elementAPosY = contact.GetFixtureA().GetBody().GetPosition().y*SCALE;
			elementBPosY = contact.GetFixtureB().GetBody().GetPosition().y*SCALE;
			
		if (contact.GetFixtureA().GetBody().GetUserData().id == "pacman" && contact.GetFixtureB().GetBody().GetUserData().id == "pacdots"){
		destroy_list.push(contact.GetFixtureB().GetBody());
		score = score + 10;
		} else if ((contact.GetFixtureB().GetBody().GetUserData().id == "pacman" && contact.GetFixtureA().GetBody().GetUserData().id == "pacdots")) {
		destroy_list.push(contact.GetFixtureA().GetBody());
		}
		
			if (elementAId == "spike" && elementBId == "pacman" && contact.GetFixtureB().GetBody().GetUserData().lives > 0) {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
			} else if (elementBId == "spike" && elementAId == "pacman" && contact.GetFixtureA().GetBody().GetUserData().lives > 0) {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
			} else if (elementAId == "spike" && elementBId == "pacman" && contact.GetFixtureB().GetBody().GetUserData().lives == 0) {
				console.log("game end 1");
				//console.log(world);
				endOfGame(false);
			} else if (elementBId == "spike" && elementAId == "pacman" && contact.GetFixtureA().GetBody().GetUserData().lives == 0) {
				console.log("game end 2");
				//console.log(world);
				endOfGame(false);
			}
		    
		    //Could be used for collecting pills, see manic miner
			/*if (elementAId == "key" && elementBId == "pacman") {
				key_list.push(contact.GetFixtureA().GetBody())
				number_of_letters = number_of_letters - 1;
				score = score + 100;
				//console.log(score);
			} else if (elementBId == "key" && elementAId == "pacman") {
				key_list.push(contact.GetFixtureB().GetBody());
				number_of_letters = number_of_letters - 1;
				score = score + 100;
				
			}*/
			
			if (elementAId == "doortopdown" && elementBId == "pacman") {
					currentLevel = 0;
					nextLevel(currentLevel);
					stage.removeChild(log1E, log3E, log5E, log7E, vehicle1E, vehicle2E, vehicle3E);
					currentWorld = 0;
					topdowncomplete = true;
					worldleft = 2;

					
			} else if (elementBId == "doortopdown" && elementAId == "pacman") {
					currentLevel = 0;
					nextLevel(currentLevel);
					stage.removeChild(log1E, log3E, log5E, log7E, vehicle1E, vehicle2E, vehicle3E);
					currentWorld = 0;
					topdowncomplete = true;
					worldleft = 2;

			}
			
			if (elementAId == "doorplatform" && elementBId == "pacman") {
					currentLevel = 0;
					nextLevel(currentLevel);
					currentWorld = 0;
					scrollable = false;
					platformcomplete = true;
					worldleft = 1;

					
			} else if (elementBId == "doorplatform" && elementAId == "pacman") {
					currentLevel = 0;
					nextLevel(currentLevel);
					currentWorld = 0;
					scrollable = false;
					platformcomplete = true;
					worldleft = 1;

			}
			
			
			
		
			if (elementAId == "left" && elementBId == "pacman") {
					currentLevel = 1;
					nextLevel(currentLevel);
					scrollable = true;
					currentWorld = 1;
			} else if (elementBId == "left" && elementAId == "pacman") {
					currentLevel = 1;
					nextLevel(currentLevel);
					scrollable = true;
					currentWorld = 1;
				
			}
			
			if (elementAId == "right" && elementBId == "pacman") {
					currentLevel = 2;
					nextLevel(currentLevel);
					currentWorld = 2;
			} else if (elementBId == "right" && elementAId == "pacman") {
					currentLevel = 2;
					nextLevel(currentLevel);
					currentWorld = 2;
			}
			
			if (elementAId == "pacman" && elementBId == "ground") {
				jumping = false;
			} else if (elementBId == "ground" && elementAId == "pacman") {
					jumping = false;
			}
			

		    if (elementAId == "log1" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingleft = true;
			
					
			} else if (elementBId == "log1" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingleft = true;
				
				
			}
			
		    if (elementAId == "log3" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingright = true;
				
					
			} else if (elementBId == "log3" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingright = true;
			
				
			}
			
			 if (elementAId == "log5" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingleft = true;
					
			} else if (elementBId == "log5" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingleft = true;
				
			}
			
			if (elementAId == "log7" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingright = true;
					
			} else if (elementBId == "log7" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingright = true;
				
			}
			
			
			if (elementAId == "pacman" && elementBId == "water") {
				watercontact = true;
			} else if (elementBId == "pacman" && elementAId == "water") {
				watercontact = true;
			}
			
			if (elementAId == "pacman" && elementBId == "ground") {
				groundcontact = true;
			} else if (elementBId == "pacman" && elementAId == "ground") {
				groundcontact = true;
			}
			
			if (elementAId == "pacman" && elementBId == "log1") {
				log1contact = true;
			} else if (elementBId == "pacman" && elementAId == "log1") {
				log1contact = true;
			}
			if (elementAId == "pacman" && elementBId == "log3") {
				log3contact = true;
			} else if (elementBId == "pacman" && elementAId == "log3") {
				log3contact = true;
			}
			if (elementAId == "pacman" && elementBId == "log5") {
				log5contact = true;
			} else if (elementBId == "pacman" && elementAId == "log5") {
				log5contact = true;
			}
			if (elementAId == "pacman" && elementBId == "log7") {
				log7contact = true;
			} else if (elementBId == "pacman" && elementAId == "log7") {
				log7contact = true;
			}
			
			
			
			
			
			
			if (elementAId == "ghostplat1" && elementBId == "left1") {
				ghostplat1.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat1.GetBody().GetLinearVelocity().y));
					
			} else if (elementBId == "ghostplat1" && elementAId == "left1") {
				ghostplat1.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat1.GetBody().GetLinearVelocity().y));
			}
			
			if (elementAId == "ghostplat1" && elementBId == "right1") {
				ghostplat1.GetBody().SetLinearVelocity(new b2Vec2(-1, ghostplat1.GetBody().GetLinearVelocity().y));
					
			} else if (elementBId == "ghostplat1" && elementAId == "right1") {
				ghostplat1.GetBody().SetLinearVelocity(new b2Vec2(-1, ghostplat1.GetBody().GetLinearVelocity().y));
			}
			
			
			if (elementAId == "ghostplat2" && elementBId == "left2") {
				ghostplat2.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat2.GetBody().GetLinearVelocity().y));
					
			} else if (elementBId == "ghostplat2" && elementAId == "left2") {
				ghostplat2.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat2.GetBody().GetLinearVelocity().y));
			}
			
			if (elementAId == "ghostplat2" && elementBId == "right2") {
				ghostplat2.GetBody().SetLinearVelocity(new b2Vec2(-1, ghostplat2.GetBody().GetLinearVelocity().y));
					
			} else if (elementBId == "ghostplat2" && elementAId == "right2") {
				ghostplat2.GetBody().SetLinearVelocity(new b2Vec2(-1, ghostplat2.GetBody().GetLinearVelocity().y));
			}
			
			
						if (elementAId == "ghostplat3" && elementBId == "left3") {
				ghostplat3.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat3.GetBody().GetLinearVelocity().y));
					
			} else if (elementBId == "ghostplat3" && elementAId == "left3") {
				ghostplat3.GetBody().SetLinearVelocity(new b2Vec2(1, ghostplat3.GetBody().GetLinearVelocity().y));
			}
			
			if (elementAId == "ghostplat3" && elementBId == "right3") {
				ghostplat3.GetBody().SetLinearVelocity(new b2Vec2(-1, ghostplat3.GetBody().GetLinearVelocity().y));
					
			} else if (elementBId == "ghostplat3" && elementAId == "right3") {
				ghostplat3.GetBody().SetLinearVelocity(new b2Vec2(-1, ghostplat3.GetBody().GetLinearVelocity().y));
			}
			
			
			if (elementAId == "ghost1" && elementBId == "1") {
				ghost1.GetBody().SetLinearVelocity(new b2Vec2(ghost1.GetBody().GetLinearVelocity().x, 2.4));
			} else if (elementBId == "ghost1" && elementAId == "1") {
				ghost1.GetBody().SetLinearVelocity(new b2Vec2(ghost1.GetBody().GetLinearVelocity().x, 2.4));
			}
			if (elementAId == "ghost1" && elementBId == "2") {
				ghost1.GetBody().SetLinearVelocity(new b2Vec2(ghost1.GetBody().GetLinearVelocity().x, -2.4));
			} else if (elementBId == "ghost1" && elementAId == "2") {
				ghost1.GetBody().SetLinearVelocity(new b2Vec2(ghost1.GetBody().GetLinearVelocity().x, -2.4));
			}
			
			
			if (elementAId == "ghost2" && elementBId == "3") {
				ghost2.GetBody().SetLinearVelocity(new b2Vec2(ghost2.GetBody().GetLinearVelocity().x, 3));
			} else if (elementBId == "ghost2" && elementAId == "3") {
				ghost2.GetBody().SetLinearVelocity(new b2Vec2(ghost2.GetBody().GetLinearVelocity().x, 3));
			}
			if (elementAId == "ghost2" && elementBId == "4") {
				ghost2.GetBody().SetLinearVelocity(new b2Vec2(ghost2.GetBody().GetLinearVelocity().x, -3));
			} else if (elementBId == "ghost2" && elementAId == "4") {
				ghost2.GetBody().SetLinearVelocity(new b2Vec2(ghost2.GetBody().GetLinearVelocity().x, -3));
			}
			
			if (elementAId == "ghost3" && elementBId == "5") {
				ghost3.GetBody().SetLinearVelocity(new b2Vec2(ghost3.GetBody().GetLinearVelocity().x, 1.5));
			} else if (elementBId == "ghost3" && elementAId == "5") {
				ghost3.GetBody().SetLinearVelocity(new b2Vec2(ghost3.GetBody().GetLinearVelocity().x, 1.5));
			}
			if (elementAId == "ghost3" && elementBId == "6") {
				ghost3.GetBody().SetLinearVelocity(new b2Vec2(ghost3.GetBody().GetLinearVelocity().x, -1.5));
			} else if (elementBId == "ghost3" && elementAId == "6") {
				ghost3.GetBody().SetLinearVelocity(new b2Vec2(ghost3.GetBody().GetLinearVelocity().x, -1.5));
			}
			
			if (elementAId == "ghost4" && elementBId == "7") {
				ghost4.GetBody().SetLinearVelocity(new b2Vec2(ghost4.GetBody().GetLinearVelocity().x, 1.5));
			} else if (elementBId == "ghost4" && elementAId == "7") {
				ghost4.GetBody().SetLinearVelocity(new b2Vec2(ghost4.GetBody().GetLinearVelocity().x, 1.5));
			}
			if (elementAId == "ghost4" && elementBId == "8") {
				ghost4.GetBody().SetLinearVelocity(new b2Vec2(ghost4.GetBody().GetLinearVelocity().x, -1.5));
			} else if (elementBId == "ghost4" && elementAId == "8") {
				ghost4.GetBody().SetLinearVelocity(new b2Vec2(ghost4.GetBody().GetLinearVelocity().x, -1.5));
			}



			
		    
		    
		    //Not used here but have a think about it
			/*if (elementAId == "ghost" && elementBId == "leftChange") {
				e_right = true;
			} else if (elementBId == "ghost" && elementAId == "leftChange") {
				e_right = true;
			}
		
			if (elementAId == "ghost" && elementBId == "rightChange") {
				e_right = false;
			} else if (elementBId == "ghost" && elementAId == "rightChange") {
				e_right = false;
			}*/
		
			if (elementAId == "ghostplat1" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
				pacmanplatforms = true;
			} else if (elementBId == "ghostplat1" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
				pacmanplatforms = true;
			}
				if (elementAId == "ghostplat2" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
				pacmanplatforms = true;
			} else if (elementBId == "ghostplat2" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
				pacmanplatforms = true;
			}
				if (elementAId == "ghostplat3" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
				pacmanplatforms = true;
			} else if (elementBId == "ghostplat3" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
				pacmanplatforms = true;
			}
			
			
			if (elementAId == "vehicle" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
				pacmantopdowns = true;
			} else if (elementBId == "vehicle" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
				pacmantopdowns = true;
			}
			
			if (elementAId == "vehicle1" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
					pacmantopdowns = true;
			} else if (elementBId == "vehicle1" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
					pacmantopdowns = true;
			}
			
			
			if (elementAId == "ghost1" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			} else if (elementBId == "ghost1" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			}
			
			if (elementAId == "ghost2" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			} else if (elementBId == "ghost2" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			}
			
			if (elementAId == "ghost3" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			} else if (elementBId == "ghost3" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			}
			if (elementAId == "ghost4" && elementBId == "pacman") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			} else if (elementBId == "ghost4" && elementAId == "pacman") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				player_life = player_life-1;
					pacmangrids = true;
			}
		
		
		
		}
	};
	
		listener.EndContact = function(contact) {
			if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			elementAId = contact.GetFixtureA().GetBody().GetUserData().id;
			elementBId = contact.GetFixtureB().GetBody().GetUserData().id;
			//console.log(elementAId + " - " + elementBId)
			elementAclass = contact.GetFixtureA().GetBody().GetUserData().class;
			elementBclass = contact.GetFixtureB().GetBody().GetUserData().class;
			elementAPosY = contact.GetFixtureA().GetBody().GetPosition().y*SCALE;
			elementBPosY = contact.GetFixtureB().GetBody().GetPosition().y*SCALE;
			

			
		    if (elementAId == "log1" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingleft = false;
			
					
			} else if (elementBId == "log1" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingleft = false;
				
				
			}
			
		    if (elementAId == "log3" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingright = false;
				
					
			} else if (elementBId == "log3" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingright = false;
			
				
			}
			
			 if (elementAId == "log5" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingleft = false;
					
			} else if (elementBId == "log5" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingleft = false;
				
			}
			
			if (elementAId == "log7" && elementBId == "pacman") {
				console.log("CONTACT");
				logmovingright = false;
					
			} else if (elementBId == "log7" && elementAId == "pacman") {
				console.log("CONTACT");
				logmovingright = false;
				
			}
			
		    }
			
			if (elementAId == "log1" && elementBId == "topdownLeft") {
				destroy_list.push(contact.GetFixtureA().GetBody(), log3.GetBody(),log5.GetBody(),log7.GetBody());
				spawnlog1 = true;
					
			} else if (elementBId == "log1" && elementAId == "topdownLeft") {
				destroy_list.push(contact.GetFixtureB().GetBody(),log3.GetBody(),log5.GetBody(),log7.GetBody());
				spawnlog1 = true;
			}
			
				if (elementAId == "vehicle1" && elementBId == "topdownLeft") {
				destroy_list.push(contact.GetFixtureA().GetBody(),vehicle2.GetBody(),vehicle3.GetBody());
				spawnvehicle1 = true;
					
			} else if (elementBId == "vehicle1" && elementAId == "topdownLeft") {
				destroy_list.push(contact.GetFixtureB().GetBody(),vehicle2.GetBody(),vehicle3.GetBody());
				spawnvehicle1 = true;
			}
			
			
			
			
			if (elementAId == "pacman" && elementBId == "water") {
				watercontact = false;
			} else if (elementBId == "pacman" && elementAId == "water") {
				watercontact = false;
			}
			
			if (elementAId == "pacman" && elementBId == "ground") {
				groundcontact = false;
			} else if (elementBId == "pacman" && elementAId == "ground") {
				groundcontact = false;
			}
			
			if (elementAId == "pacman" && elementBId == "log1") {
				log1contact = false;
			} else if (elementBId == "pacman" && elementAId == "log1") {
				log1contact = false;
			}
			if (elementAId == "pacman" && elementBId == "log3") {
				log3contact = false;
			} else if (elementBId == "pacman" && elementAId == "log3") {
				log3contact = false;
			}
			if (elementAId == "pacman" && elementBId == "log5") {
				log5contact = false;
			} else if (elementBId == "pacman" && elementAId == "log5") {
				log5contact = false;
			}
			if (elementAId == "pacman" && elementBId == "log7") {
				log7contact = false;
			} else if (elementBId == "pacman" && elementAId == "log7") {
				log7contact = false;
			}
			
			
			

			
		}

	listener.PreSolve = function(contact) {
		if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			elementAId = contact.GetFixtureA().GetBody().GetUserData().id;
			elementBId = contact.GetFixtureB().GetBody().GetUserData().id;
			elementAclass = contact.GetFixtureA().GetBody().GetUserData().class;
			elementBclass = contact.GetFixtureB().GetBody().GetUserData().class;
			elementAPosY = contact.GetFixtureA().GetBody().GetPosition().y*SCALE;
			elementBPosY = contact.GetFixtureB().GetBody().GetPosition().y*SCALE;
			//TODO: come stuff, see manic miner example
		}
	};

	this.world.SetContactListener(listener);
	
	
}





function tick(event) {
	//console.log(event.paused);
	if (!event.paused) {
		update();
		stage.update(event);
	} else {
		//TODO: Something
	}
}

function update() {
	world.Step(TIMESTEP, 10, 10);
	console.log(player_life);
	//console.log(pacman.GetBody().GetPosition().x*SCALE);
	pacmanE.x = pacman.GetBody().GetPosition().x*SCALE;
	pacmanE.y = pacman.GetBody().GetPosition().y*SCALE;
	
	//ghostE.x = ghost.GetBody().GetPosition().x*SCALE;
	//ghostE.y = ghost.GetBody().GetPosition().y*SCALE; 
	
	if (currentWorld == 2){
	vehicle1E.x = vehicle1.GetBody().GetPosition().x*SCALE-50;
	vehicle1E.y = vehicle1.GetBody().GetPosition().y*SCALE-15; 
	vehicle2E.x = vehicle2.GetBody().GetPosition().x*SCALE-50;
	vehicle2E.y = vehicle2.GetBody().GetPosition().y*SCALE-15; 
	vehicle3E.x = vehicle3.GetBody().GetPosition().x*SCALE-50;
	vehicle3E.y = vehicle3.GetBody().GetPosition().y*SCALE-15; 

	
	log1E.x = log1.GetBody().GetPosition().x*SCALE-65;
	log1E.y = log1.GetBody().GetPosition().y*SCALE-15; 
	

	
	log3E.x = log3.GetBody().GetPosition().x*SCALE-65;
	log3E.y = log3.GetBody().GetPosition().y*SCALE-15; 
	

	
	log5E.x = log5.GetBody().GetPosition().x*SCALE-65;
	log5E.y = log5.GetBody().GetPosition().y*SCALE-15; 
	

	
	log7E.x = log7.GetBody().GetPosition().x*SCALE-65;
	log7E.y = log7.GetBody().GetPosition().y*SCALE-15; 
	}
	
	if (currentWorld == 1){
		ghostplat1E.x = ghostplat1.GetBody().GetPosition().x*SCALE;
		ghostplat1E.y = ghostplat1.GetBody().GetPosition().y*SCALE; 
		ghostplat2E.x = ghostplat2.GetBody().GetPosition().x*SCALE;
		ghostplat2E.y = ghostplat2.GetBody().GetPosition().y*SCALE;
		ghostplat3E.x = ghostplat3.GetBody().GetPosition().x*SCALE;
		ghostplat3E.y = ghostplat3.GetBody().GetPosition().y*SCALE; 		
	}
	
		if (currentWorld == 0){
		ghost1E.x = ghost1.GetBody().GetPosition().x*SCALE;
		ghost1E.y = ghost1.GetBody().GetPosition().y*SCALE; 
		ghost2E.x = ghost2.GetBody().GetPosition().x*SCALE;
		ghost2E.y = ghost2.GetBody().GetPosition().y*SCALE;
		ghost3E.x = ghost3.GetBody().GetPosition().x*SCALE;
		ghost3E.y = ghost3.GetBody().GetPosition().y*SCALE; 
		ghost4E.x = ghost4.GetBody().GetPosition().x*SCALE;
		ghost4E.y = ghost4.GetBody().GetPosition().y*SCALE; 
	}
	

	stage.addChild(pacmanE);
	
	if (watercontact == true && groundcontact == false && log1contact == false && log3contact == false && log5contact == false && log7contact == false)
	{
		destroy_list.push(pacman.GetBody(),vehicle2.GetBody(),vehicle3.GetBody());
		player_life = player_life-1;
		pacmantopdown();
	}
	
	
	if (spawnlog1 == true) {
		spawninglog1();
		spawnlog1 = false;
	}
	
		if (spawnvehicle1 == true) {
		spawningvehicles();
		spawnvehicle1 = false;
	}
	
	if (pacmantopdowns == true) {
		pacmantopdown();
		pacmantopdowns = false;
	}
	
	if (pacmanplatforms == true) {
		pacmanplatform();
		pacmanplatforms = false;
	}
	
		
	if (pacmangrids == true) {
		pacmanstart();
		pacmangrids = false;
	}
	
	//console.log(scrollable);
	
	 	for (var i in destroy_list) {
		world.DestroyBody(destroy_list[i]);
	}
	
	if (logmovingright == true) {
		//console.log("HERE");
		pacman.GetBody().SetLinearVelocity(new b2Vec2(1, pacman.GetBody().GetLinearVelocity().y));
	}
	
	if (logmovingleft == true) {
		//console.log("HERE");
		pacman.GetBody().SetLinearVelocity(new b2Vec2(-1, pacman.GetBody().GetLinearVelocity().y));
	}

	//console.log(gameData.levels[currentLevel].type);
	//console.log(currentLevel);
	


	if (scrollable == true) {
	
	pX = pacman.GetBody().GetWorldCenter().x*SCALE;
	pY = pacman.GetBody().GetWorldCenter().y*SCALE;
	posArrayX.push(pX);
	posArrayY.push(pY);
	var length = posArrayX.length;
	
	var sX = (posArrayX[length-1]-posArrayX[length-2]);
	var sY = (posArrayY[length-1]-posArrayY[length-2]);
	
	//These values here are for the manic miner example watch the videos etc.
	if (pX > 333.5 && pX < 666.5) {
		stage.x = stage.x-sX;
	}
	if (pY > 187.5 && pY < 512.5) {
		//easelContext.translate(0, -sY);
		stage.y = stage.y-sY;
	}
	};
	
	// End Part 4
/*	
	if (e_right) {
		enemyRight(); 
	} else {
		enemyLeft(); 
	}
	 
 	//This is perhaps useless here but watch the pacman videos
	var edge = pacman.GetBody().GetContactList();
	while (edge) {
		var other = edge.other;
		if (other.GetUserData().class == "moving") {
			posX = other.GetPosition().x;
			posY = other.GetPosition().y;
			pos = other.GetUserData().pos;
			movId = other.GetUserData().id;
			movVal = other.GetUserData().val;
			if (pacman.GetBody().GetPosition().y + (40/SCALE) < (posY - (15/SCALE))) {
				if (movVal != undefined) {
					console.log("movVal: " + movVal);
				}
				world.DestroyBody(other);
				if (pos > 0) {
					movingSpawn(posX, posY, pos, movId, movVal);
				} else {
					stage.removeChild(moving[movVal]);
				}
			}
		}
		edge = edge.next;
	} 
	 */
	for (var i in die_list) {
		player_life = die_list[i].GetUserData().lives;
		world.DestroyBody(die_list[i]);
	}
	
	for (var j in key_list) {
		keyId = key_list[j].GetUserData().val;
		stage.removeChild(lettersE[keyId]);
		world.DestroyBody(key_list[j]);
	}
	
	if (posArrayY[posArrayY.length-1]-512.5 < 0) {
		//console.log(posArrayY[posArrayY.length-1]-512.5)
	}
	if (respawn == true) {
		spawn(player_life-1);
		//stage.x = 0
		//stage.y = -333
		respawn = false;
	}
	
	if (die_list.length > 0) {
		die_list.length = 0;
		respawn = true;
	}
	
	key_list.length = 0;
	
/* 	if (pause == true) {
		Ticker.setPaused(true);
		
		//window.cancelAnimationFrame(anim);
    	//anim = undefined;
    } else {
    	Ticker.setPaused(false);
    	//$('#background')[0].play();
		//anim = window.requestAnimationFrame(update);
	} */
	
	if (topdowncomplete == true && platformcomplete == true && score >= 300) {
		endgame = true;
		alert("You Win!!");
	}
	
	if (player_life == 0) {
		endgame = true;
		alert("You Lose! You have run out of lives.");
	}
	
	
	if (endgame == true) {
		Ticker.setPaused(true)
		//$('#background')[0].pause();
		//world = null;
		// Store the current transformation matrix
		//easelContext.save();

		// Use the identity matrix while clearing the canvas
		//easelContext.setTransform(1, 0, 0, 1, 0, 0);
		//easelContext.clearRect(0, 0, easelCanvas.width, easelCanvas.height);
    } 
	
	var scoredisplay = document.getElementById("score").innerHTML = score;
	var timeleft = document.getElementById("timeleft").innerHTML = timeLeft;
	var lives = document.getElementById("lives").innerHTML = player_life;
	if (platformcomplete == true) {
		var platformcompletehtml = document.getElementById("platform").innerHTML = "YES";
	} else {
		var platformcompletehtml = document.getElementById("platform").innerHTML = "NO";
	}
	
		if (topdowncomplete == true) {
		var topdowncompletehtml = document.getElementById("topdown").innerHTML = "YES";
	} else {
		var topdowncompletehtml = document.getElementById("topdown").innerHTML = "NO";
	}
	 
	$('#scores').empty();
	$('#scores').append(score);
	$('#players').empty();
	$('#players').append(player_life);
	
	world.ClearForces();
	world.m_debugDraw.m_sprite.graphics.clear();
	world.DrawDebugData();
}

//stage.removeChild(birdBMP);

init();

function lefts() {
	left = true;
	pacmanE.gotoAndPlay("run");
	pacmanE.scaleX = -1.8;
	pacman.GetBody().SetLinearVelocity(new b2Vec2(-2.4, pacman.GetBody().GetLinearVelocity().y));
	//pacman.GetBody().SetPosition(new b2Vec2(pacman.GetBody().GetPosition().x-(16/SCALE), pacman.GetBody().GetPosition().y))
}

function rights() {
	right = true;
	pacmanE.gotoAndPlay("run");
	pacmanE.scaleX = 1.8;
	pacman.GetBody().SetLinearVelocity(new b2Vec2(2.4, pacman.GetBody().GetLinearVelocity().y));
	//pacman.GetBody().SetPosition(new b2Vec2(pacman.GetBody().GetPosition().x+(16/SCALE), pacman.GetBody().GetPosition().y))
}

function ups() {
	up = true;
	pacmanE.gotoAndPlay("up");
	pacmanE.scaleX = 1.8;
	pacman.GetBody().SetLinearVelocity(new b2Vec2(pacman.GetBody().GetLinearVelocity().x, -2.4));

}

function downs() {
	down = true;
	pacmanE.gotoAndPlay("down");
	pacmanE.scaleX = 1.8;
	pacman.GetBody().SetLinearVelocity(new b2Vec2(pacman.GetBody().GetLinearVelocity().x, 2.4));
}

function jump() {
	pacman.GetBody().SetLinearVelocity(new b2Vec2(pacman.GetBody().GetLinearVelocity().x, -6));
}

function stop() {
	right = left = up = down = false;
	pacmanE.gotoAndPlay("stand");
	pacman.GetBody().SetLinearVelocity(new b2Vec2(0, 0));
}

function enemyLeft() {
	//ghostE.gotoAndPlay("run");
	ghostE.scaleX = -5;
	ghost.GetBody().SetLinearVelocity(new b2Vec2(-2.4, ghost.GetBody().GetLinearVelocity().y));
}

function enemyRight() {
	ghostE.scaleX = 5;
	ghost.GetBody().SetLinearVelocity(new b2Vec2(2.4, ghost.GetBody().GetLinearVelocity().y));
}



/* function spawn(p_lives) {
	player_lives = p_lives;
	bodyDefpacman = new b2BodyDef;
	bodyDefpacman.type = b2Body.b2_dynamicBody;
	fixDefpacman = new b2FixtureDef;
	fixDefpacman.shape = new b2PolygonShape;
	fixDefpacman.shape.SetAsBox((10/SCALE), (10/SCALE));    //  half width, half height
	fixDefpacman.density = 1.0;
	fixDefpacman.friction = 0;
	fixDefpacman.restitution = 0;
	bodyDefpacman.position.x = (40)/SCALE; //positions the center of the object (not upper left);
	bodyDefpacman.position.y = (32)/SCALE;
	pacman = world.CreateBody(bodyDefpacman).CreateFixture(fixDefpacman);
	pacman.GetBody().SetUserData({id: "pacman", lives: player_lives});
	pacman.GetBody().SetFixedRotation(true);
} */

function pacmantopdown() {
	var bodyDefpacman = new b2BodyDef;
	bodyDefpacman.type = b2Body.b2_dynamicBody;
	var fixDefpacman = new b2FixtureDef;
	fixDefpacman.shape = new b2PolygonShape;
	fixDefpacman.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefpacman.density = 1.0;
	fixDefpacman.friction = 0;
	fixDefpacman.restitution = 0.001;
	bodyDefpacman.position.x = (200)/SCALE; //positions the center of the object (not upper left);
	bodyDefpacman.position.y = (500)/SCALE;
	pacman = world.CreateBody(bodyDefpacman).CreateFixture(fixDefpacman);
	pacman.GetBody().SetUserData({id: "pacman", lives: player_life});
	pacman.GetBody().SetFixedRotation(true);
	pacmantopdowns = false;
	
}

function pacmanplatform() {
	var bodyDefpacman = new b2BodyDef;
	bodyDefpacman.type = b2Body.b2_dynamicBody;
	var fixDefpacman = new b2FixtureDef;
	fixDefpacman.shape = new b2PolygonShape;
	fixDefpacman.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefpacman.density = 1.0;
	fixDefpacman.friction = 0;
	fixDefpacman.restitution = 0.001;
	bodyDefpacman.position.x = (50)/SCALE; //positions the center of the object (not upper left);
	bodyDefpacman.position.y = (20)/SCALE;
	pacman = world.CreateBody(bodyDefpacman).CreateFixture(fixDefpacman);
	pacman.GetBody().SetUserData({id: "pacman", lives: player_life});
	pacman.GetBody().SetFixedRotation(true);
	pacmantopdowns = false;
	
}

function pacmanstart() {
		var bodyDefpacman = new b2BodyDef;
	bodyDefpacman.type = b2Body.b2_dynamicBody;
	var fixDefpacman = new b2FixtureDef;
	fixDefpacman.shape = new b2PolygonShape;
	fixDefpacman.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefpacman.density = 1.0;
	fixDefpacman.friction = 0;
	fixDefpacman.restitution = 0.001;
	bodyDefpacman.position.x = (230)/SCALE; //positions the center of the object (not upper left);
	bodyDefpacman.position.y = (285)/SCALE;
	pacman = world.CreateBody(bodyDefpacman).CreateFixture(fixDefpacman);
	pacman.GetBody().SetUserData({id: "pacman", lives: player_life});
	pacman.GetBody().SetFixedRotation(true);
}

function pacmanleft() {
		var bodyDefpacman = new b2BodyDef;
	bodyDefpacman.type = b2Body.b2_dynamicBody;
	var fixDefpacman = new b2FixtureDef;
	fixDefpacman.shape = new b2PolygonShape;
	fixDefpacman.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefpacman.density = 1.0;
	fixDefpacman.friction = 0;
	fixDefpacman.restitution = 0.001;
	bodyDefpacman.position.x = (80)/SCALE; //positions the center of the object (not upper left);
	bodyDefpacman.position.y = (240)/SCALE;
	pacman = world.CreateBody(bodyDefpacman).CreateFixture(fixDefpacman);
	pacman.GetBody().SetUserData({id: "pacman", lives: player_life});
	pacman.GetBody().SetFixedRotation(true);
}

function pacmanright() {
		var bodyDefpacman = new b2BodyDef;
	bodyDefpacman.type = b2Body.b2_dynamicBody;
	var fixDefpacman = new b2FixtureDef;
	fixDefpacman.shape = new b2PolygonShape;
	fixDefpacman.shape.SetAsBox((10/SCALE), (10/SCALE));   //  half width, half height
	fixDefpacman.density = 1.0;
	fixDefpacman.friction = 0;
	fixDefpacman.restitution = 0.001;
	bodyDefpacman.position.x = (400)/SCALE; //positions the center of the object (not upper left);
	bodyDefpacman.position.y = (240)/SCALE;
	pacman = world.CreateBody(bodyDefpacman).CreateFixture(fixDefpacman);
	pacman.GetBody().SetUserData({id: "pacman", lives: player_life});
	pacman.GetBody().SetFixedRotation(true);
}

function movingSpawn(posX, posY, pos, id, value) {
	var fixDefMoving = new b2FixtureDef;
	fixDefMoving.density = 1.0;
	fixDefMoving.friction = 0.5;
	fixDefMoving.restitution = 0.1;
	fixDefMoving.shape = new b2PolygonShape;
	fixDefMoving.shape.SetAsBox((28/SCALE)/2, (30/SCALE)/2);   //  half width, half height

	var bodyDefMoving = new b2BodyDef;
	bodyDefMoving.type = b2Body.b2_staticBody;
	bodyDefMoving.position.x = posX;
	bodyDefMoving.position.y = posY + (1/SCALE);
	pos = pos - 1;

	movingB2W[value] = world.CreateBody(bodyDefMoving).CreateFixture(fixDefMoving);
	movingB2W[value].GetBody().SetUserData({id: movId, class: "moving", pos: pos, val: value});
}

//stage.removeChild(birdBMP);

function endOfGame(win) {
	if (win) {
		endgame = true;
		alert("you win");
	} else {
		endgame = true;
		alert("you lose");
	}	
	clearInterval(interval);
}

/*function orderScores(hs) {
	hs.sort(function(a, b){return b-a});
	return hs;
}*/


		function spawninglog1() {
					var bodyDefvehicle = new b2BodyDef;
					bodyDefvehicle.type = b2Body.b2_dynamicBody;
					var fixDefvehicle = new b2FixtureDef;
					fixDefvehicle.shape = new b2PolygonShape;
					fixDefvehicle.shape.SetAsBox((60/SCALE), (15/SCALE));   //  half width, half height
					fixDefvehicle.density = 1.0;
					fixDefvehicle.friction = 0;
					fixDefvehicle.restitution = 0.001;
					fixDefvehicle.isSensor = true;
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (80)/SCALE;
					log1 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log1.GetBody().SetUserData({id: "log1"});
					log1.GetBody().SetLinearVelocity(new b2Vec2(-1, log1.GetBody().GetLinearVelocity().y));
					
					bodyDefvehicle.position.x = (0)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (120)/SCALE;
					log3 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log3.GetBody().SetUserData({id: "log3"});
					log3.GetBody().SetLinearVelocity(new b2Vec2(1, log3.GetBody().GetLinearVelocity().y));
					
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (170)/SCALE;
					log5 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log5.GetBody().SetUserData({id: "log5"});
					log5.GetBody().SetLinearVelocity(new b2Vec2(-1, log5.GetBody().GetLinearVelocity().y));
					
					bodyDefvehicle.position.x = (0)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (210)/SCALE;
					log7 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					log7.GetBody().SetUserData({id: "log7"});
					log7.GetBody().SetLinearVelocity(new b2Vec2(1, log7.GetBody().GetLinearVelocity().y));

		}
		
		function spawningvehicles() {
							 	var bodyDefvehicle = new b2BodyDef;
					bodyDefvehicle.type = b2Body.b2_dynamicBody;
					var fixDefvehicle = new b2FixtureDef;
					fixDefvehicle.shape = new b2PolygonShape;
					fixDefvehicle.shape.SetAsBox((40/SCALE), (20/SCALE));   //  half width, half height
					fixDefvehicle.density = 1.0;
					fixDefvehicle.friction = 0;
					fixDefvehicle.restitution = 0.001;
					fixDefvehicle.isSensor = true;
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (440)/SCALE;
					vehicle1 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					vehicle1.GetBody().SetUserData({id: "vehicle1"});
					vehicle1.GetBody().SetLinearVelocity(new b2Vec2(-3, vehicle1.GetBody().GetLinearVelocity().y));

				
					
					
					bodyDefvehicle.position.x = (0)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (380)/SCALE;
					vehicle2 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					vehicle2.GetBody().SetUserData({id: "vehicle"});
					vehicle2.GetBody().SetLinearVelocity(new b2Vec2(3, vehicle2.GetBody().GetLinearVelocity().y));

					
					
					bodyDefvehicle.position.x = (500)/SCALE; //positions the center of the object (not upper left);
					bodyDefvehicle.position.y = (330)/SCALE;
					vehicle3 = world.CreateBody(bodyDefvehicle).CreateFixture(fixDefvehicle);
					vehicle3.GetBody().SetUserData({id: "vehicle"});
					vehicle3.GetBody().SetLinearVelocity(new b2Vec2(-3, vehicle3.GetBody().GetLinearVelocity().y));

					
					
				
			
		}