/**
 * MyInterface
 * @constructor
 */


function MyInterface(scene) {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	var text = new initInterface(this.scene);

	this.gui.add(text, 'initGame');
	var gameCtrl = this.gui.add(text, 'modeGame', ['human-human', 'human-computer']);

	var game = this.scene.game;
	gameCtrl.onChange(function(value) {
	  	// Fires on every change, drag, keypress, etc.
	});
	gameCtrl.onFinishChange(function(value) {
		// Fires when a controller loses focus.
		if (game.configured == false)
			game.type = value;
	});

	return true;
};

var initInterface = function(scene) {
	this.initGame = function() {
		scene.game.inited = true;
	};
	this.modeGame = "human-human";
};

var sceneOption = function() {
	this.scene = '1';
};

MyInterface.prototype.showSceneOption = function() {
	var optionScene = new sceneOption();
	var sceneCtrl = this.gui.add(optionScene, 'scene', ['1', '2']);
	var scene = this.scene;
	sceneCtrl.onChange(function(value) {
	  	// Fires on every change, drag, keypress, etc.
	});
	sceneCtrl.onFinishChange(function(value) {
		// Fires when a controller loses focus.
		scene.currAmbient = value;
	});

};

var putInformationOfPlayerOnInterface = function(Score, Adaptoids, Legs, Pincers) {
    this.score = Score;
    this.adaptoids = Adaptoids;
    this.legs = Legs;
    this.pincers = Pincers;
};

var configWhite = new putInformationOfPlayerOnInterface(0, 11, 12, 12);
var configBlack = new putInformationOfPlayerOnInterface(0, 11, 12, 12);

var setUndo = function(scene) {
    this.undoGame = function() {
    	var state = scene.game.stateMachine.currState;
    	if (state !== states.ANIMATION_MOVE &&
    		state !== states.ANIMATION_UPDATE &&
    		state !== states.ANIMATION_CAPTURE &&
    		state !== states.TURN_CHANGE &&
    		state !== states.UNDO &&
    		state !== states.END_GAME &&
    		!(scene.game.type === 'human-computer' && scene.game.stateMachine.turn == turn.BLACK)) {
    		if (scene.game.undo.isPossibleExecuteUndo()) {
			scene.game.undo.executeUndo();
    		}
    	}
	};
};

MyInterface.prototype.showPlayerInfo = function() {
	var gui = this.gui;
    var whitePlayer = gui.addFolder('White Player');
    var blackPlayer = gui.addFolder('black Player');
    whitePlayer.add(configWhite, 'score').listen();
    whitePlayer.add(configWhite, 'adaptoids').listen();
    whitePlayer.add(configWhite, 'legs').listen();
    whitePlayer.add(configWhite, 'pincers').listen();
    blackPlayer.add(configBlack, 'score').listen();
    blackPlayer.add(configBlack, 'adaptoids').listen();
    blackPlayer.add(configBlack, 'legs').listen();
    blackPlayer.add(configBlack, 'pincers').listen();	

    var scene = this.scene;
    var update = function() {
		requestAnimationFrame(update);
		configWhite.score = scene.game.whitePlayer.score;
		configWhite.adaptoids = scene.game.whitePlayer.numBodies;
		configWhite.legs = scene.game.whitePlayer.numLegs;
		configWhite.pincers = scene.game.whitePlayer.numPincers;
		configBlack.score = scene.game.blackPlayer.score;
		configBlack.adaptoids = scene.game.blackPlayer.numBodies;
		configBlack.legs = scene.game.blackPlayer.numLegs;
		configBlack.pincers = scene.game.blackPlayer.numPincers;
	};

    update();

    var undo = new setUndo(this.scene);
	this.gui.add(undo, 'undoGame');

};

/**
 * processKeyUp
 * @param event {Event}
 */
MyInterface.prototype.processKeyUp = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyUp.call(this,event);

};

/**
 * processKeyDown
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyDown.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	var receiveCommand = false;
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
        case(86): // V
        case(118): // v
            this.scene.changeCamera();
            break;
        case(77): //  M
        case(109): // m
            this.scene.graph.materialIndex++;
            break;
        default:
            break
	};


};
