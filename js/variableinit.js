var easelCanvas, easelContext, box2dCanvas, box2dContext, loader, stage, w, h;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var world;
var currentLevel = 0;
var currentWorld = 0;
var worldleft = 0;
var player_life = 3;
var moving = [];
var scrollable = false;

var logmovingright = false;
var logmovingleft = false;

var spawnlog1 = false;
var spawnvehicle1 = false;

var pacmantopdowns = false;
var pacmanplatforms = false;
var pacmangrids = false;

var topdowncomplete = false;
var platformcomplete = false;

var watercontact = false;
var log1contact = false;
var log3contact = false;
var log5contact = false;
var log7contact = false;
var groundcontact = false;


var movingB2W = [];
var letters = [];
var lettersE = [];
var movIt = 0;
var letterIt = 0;
var timeLeft = 200;
var cw = w;
var ch = h;
var dw = w;
var dh = h;

var translateX;
var translateY;

var interval;

var endgame = false;
var pause = true;
var anim; 
var left = false;
var right = false;
var up = false;
var down = false;
var jumping = false;
var number_of_levels = gameData.levels.length;
var die_list = [];
var key_list = []; 
var respawn = false;
var e_right = true;
var posArrayX = [];
var posArrayY = [];
var score = 0;


var Ticker = createjs.Ticker;