/**
* GameState
* Save the state of game
* @constructor
*/
function GameState(scene) {

    this.scene = scene;

    this.materialTile;
    this.materialTileSelected;
    this.materialWhite;
    this.materialBlack;
    this.setMaterials();

    this.radiusOfTile = 0.125;
    this.heightOfTile = 0.1;

    this.bodies = [];
    this.legs = [];
    this.pincers = [];
    this.createPieces();

    this.mainBoard = new AdaptoidBoard(scene, this, this.radiusOfTile, this.heightOfTile);
    this.auxBoardBlack = new AuxiliaryBoard(scene, this, this.radiusOfTile, this.heightOfTile, "black");
    this.auxBoardWhite = new AuxiliaryBoard(scene, this, this.radiusOfTile, this.heightOfTile, "white");
    this.initBoards();

    this.hotspots = this.getHotspots();
    this.hotspotFrom = null;
    this.hotspotTo = null;

    this.client = new Client(this);

    this.whitePlayer = new Player("w");
    this.blackPlayer = new Player("b");

    this.stateMachine = new StateMachine(states.PIECE_SELECTION_FROM, turn.WHITE);

    this.moveAnimator = new MoveAnimator(this);
    this.updateAnimator = new UpdateAnimator(this);
    this.captureAnimator = new CaptureAnimator(this);
    this.turnChangeAnimator = new TurnChangeAnimator(this);

    this.scorePrinter = new Score(scene, this);

    this.inited = false;
    this.configured = false;

    this.endGame = [];
    this.endGameSentToInterface = false;

    this.type = null; //  ['human-human', 'human-computer']
    this.botRequestMove = false;
    this.botRequestUpdate = false;

    this.undo = new Undo(this);

    this.height = 0.95;

    this.moves = [];
    this.movie = new GameMovie(this);

};

GameState.prototype.constructor = GameState;

/**
 * Create all pieces that will be used in entire game.
 */
GameState.prototype.createPieces = function() {
    for (var i = 0; i < 24; i++) {
        this.bodies.push(new Body(this.scene, this, null, this.radiusOfTile/4, this.heightOfTile/4));
        this.legs.push(new Leg(this.scene, this, null, this.radiusOfTile/15, this.radiusOfTile/2))
        this.pincers.push(new Pincer(this.scene, this, null, this.radiusOfTile/15, this.radiusOfTile/2));
    }
};

/**
 * Init the boards.
 */
GameState.prototype.initBoards = function() {
    
   /* this.mainBoard.setBodyInTile(this.bodies[0], 4, 2, "white");
    this.mainBoard.setLegsInTile([this.legs[2], this.legs[3], this.legs[4], this.legs[5]], 4, 2, "white");
    this.mainBoard.setPincersInTile([this.pincers[3], this.pincers[7]], 4, 2, "white");

    this.mainBoard.setBodyInTile(this.bodies[1], 4, 6, "black");
    this.mainBoard.setLegsInTile([this.legs[7], this.legs[8], this.legs[9], this.legs[10], this.legs[11]], 4, 6, "black");
    this.mainBoard.setPincersInTile([this.pincers[2]], 4, 6, "black");*/

    this.auxBoardWhite.setBody(this.bodies[4], "white");
    this.auxBoardWhite.setLeg(this.legs[0], "white");
    this.auxBoardWhite.setPincer(this.pincers[0], "white");

    this.auxBoardBlack.setBody(this.bodies[5], "black");
    this.auxBoardBlack.setLeg(this.legs[1], "black");
    this.auxBoardBlack.setPincer(this.pincers[1], "black");

    this.mainBoard.setBodyInTile(this.bodies[0], 4, 2, "white");
    this.mainBoard.setBodyInTile(this.bodies[1], 4, 6, "black");
};

/**
 * Display the current game according the state of game.
 * If the game is not configured, run the configuration.
 * If any animation is active, that animation is displayed.
 */
GameState.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0, this.height, 0);

    
    if (!this.configured) {
        this.scene.interface.showPlayerInfo();
        this.configured = true;
    }
    else if (this.scene.pickMode) {
        this.drawBoards();
    }
    if (this.movie.isActive()) {
        this.movie.display();
    }
    else if (this.stateMachine.currState == states.PIECE_SELECTION_FROM) {
        var colorPlayer = (this.stateMachine.turn === turn.WHITE) ? "white":"black";
        if (!this.mainBoard.playerCanMoveAndCapture(colorPlayer)) {
            this.stateMachine.currState = states.UPDATE_PIECE_FROM;
        }
        else {
            if (this.stateMachine.turn === turn.BLACK &&
                this.type === "human-computer") {
                if (this.botRequestMove == false) {
                    this.client.botRequestMove();
                    this.botRequestMove = true;
                }
            }
        }

        this.drawBoards();
    }
    else if (this.stateMachine.currState == states.UNDO) {
        this.undo.display();
    }
    else if (this.stateMachine.currState == states.ANIMATION_MOVE) {
        this.moveAnimator.display();
    }
    else if (this.stateMachine.currState == states.ANIMATION_UPDATE) {
        this.updateAnimator.display();
    }
    else if (this.stateMachine.currState == states.UPDATE_PIECE_FROM) {
        if (this.stateMachine.turn == turn.WHITE) {
            if (this.whitePlayer.stockIsExpired()) {
                this.stateMachine.currState = states.ANIMATION_CAPTURE;
            }
        }
        else {
            if (this.blackPlayer.stockIsExpired()) {
                this.stateMachine.currState = states.ANIMATION_CAPTURE;
            }
            else {
                if (this.type === "human-computer" && this.botRequestUpdate == false) {
                    this.client.botRequestUpdate();
                    this.botRequestUpdate = true;
                }
            }
        }
        this.drawBoards();
    }
    else if (this.stateMachine.currState == states.ANIMATION_CAPTURE) {
        if (this.captureAnimator.requestSent === false) {
            this.client.requestCapture(); 
            this.drawBoards();  
        }
        else {
            if (this.captureAnimator.requestReply === true) {
                this.captureAnimator.display();
            }
            else {
                this.drawBoards();
            }
        }
    }
    else if (this.stateMachine.currState == states.TURN_CHANGE) {
        this.turnChangeAnimator.display();
    }
    else if (this.stateMachine.currState == states.END_GAME) {
        if (this.endGameSentToInterface == false) {
            this.endGame['endOfGame'] = (this.stateMachine.winner == "white") ? "white wins":"black wins";
            var game = this;
            this.endGame['initMovie'] = function() {
                game.movie.prepareMovie();
            };
            this.scene.interface.gui.add(this.endGame, 'endOfGame');
            this.scene.interface.gui.add(this.endGame, 'initMovie');
            this.endGameSentToInterface = true;
        }
        this.drawBoards();
    }
    else {
        this.drawBoards();
    }

    this.scene.popMatrix();

};

/**
 * Draw main board, auxiliary boards and the score.
 */
GameState.prototype.drawBoards = function() {
   this.mainBoard.display();

   this.scene.pushMatrix();
   this.scene.translate(0, 0, this.mainBoard.widthBoard*0.7);
   this.auxBoardWhite.display();
   this.scene.popMatrix();

   this.scene.pushMatrix();
   this.scene.translate(0, 0, -this.mainBoard.widthBoard*0.7);
   this.scene.rotate(Math.PI, 0, 1, 0);
   this.auxBoardBlack.display();
   this.scene.popMatrix();

   this.scene.pushMatrix();
   this.scorePrinter.display();
   this.scene.popMatrix();
};

/**
 * Set the materials used in all game by tiles and pieces.
 */
GameState.prototype.setMaterials = function() {
    this.materialTile = new CGFappearance(this.scene);
    this.materialTile.setDiffuse( 1.0, 1.0, 1.0, 1);
    this.materialTile.setSpecular( 0.5, 0.5, 0.5, 1);
    this.materialTile.setShininess(50);
    this.materialTile.loadTexture("scenes/chessboard.jpg");

    this.materialTileSelected = new CGFappearance(this.scene);
    this.materialTileSelected.setDiffuse(0.4, 0.4, 1.0, 1);
    this.materialTileSelected.setSpecular( 0.2, 0.2, 0.5, 1);
    this.materialTileSelected.setShininess(50);
    this.materialTileSelected.loadTexture("scenes/chessboard.jpg");

    this.materialWhite = new CGFappearance(this.scene);
    this.materialWhite.setDiffuse( 1.0, 1.0, 1.0, 1);
    this.materialWhite.setSpecular( 0.5, 0.5, 0.5, 1);
    this.materialWhite.setShininess(50);

    this.materialBlack = new CGFappearance(this.scene);
    this.materialBlack.setDiffuse( 0.25, 0.5, 0.25, 1);
    this.materialBlack.setSpecular( 0.5, 0.5, 0.5, 1);
    this.materialBlack.setShininess(50);
};

/**
 * Get the hotspots of tiles of main board and auxiliary boards.
 */
GameState.prototype.getHotspots = function() {
    var hotspots = this.mainBoard.getHotspots();
    hotspots = hotspots.concat(this.auxBoardBlack.getHotspots(),
                                this.auxBoardWhite.getHotspots());
    return hotspots;
};

/**
 * Check if game is ended.
 */
GameState.prototype.isEnded = function() {


    if (this.whitePlayer.score == 5 && this.blackPlayer.score == 5) {
        if (this.stateMachine.turn == turn.WHITE)
            return "white wins";
        else
            return "black wins";
    }

    if (this.mainBoard.numPiecesOfAColorInBoard("white") === 0 && 
        this.mainBoard.numPiecesOfAColorInBoard("black") === 0) {

        if (this.whitePlayer.score > this.blackPlayer.score) {
            return "white wins";
        }
        else if (this.whitePlayer.score < this.blackPlayer.score) {
            return "black wins";
        }
        else {
            if (this.stateMachine.turn == turn.WHITE)
                return "white wins";
            else
                return "black wins";
        }
    }

    if (this.whitePlayer.score == 5) {
        return "white wins";
    }
    if (this.blackPlayer.score == 5) {
        return "black wins";  
    }

    if (this.mainBoard.numPiecesOfAColorInBoard("white") === 0) {
        return "black wins";
    }

    if (this.mainBoard.numPiecesOfAColorInBoard("black") === 0) {
        return "white wins";
    }

    return false;
};

/**
 * Process the user interaction.
 * Change the state of state machine, the tiles and hotsopts selected,
 * and request information from Client module.
 */
GameState.prototype.updatePieceSelected = function(hotspot) {

    if (this.movie.isActive()) {
        return;
    }

    if (this.hotspotFrom === null) { // first select
        this.hotspotFrom = hotspot;

        if (this.stateMachine.currState === states.PIECE_SELECTION_FROM) {
            if (hotspot.tile.gameBoard.constructor.name === "AdaptoidBoard") {
                this.hotspotFrom.tile.selected = true;
                this.stateMachine.setState(states.PIECE_SELECTION_TO);
            }
            else {
                this.hotspotFrom = null;
            }
        }
        else if (this.stateMachine.currState === states.UPDATE_PIECE_FROM) {
            if (this.stateMachine.turn === turn.WHITE) {
                if (hotspot.tile.gameBoard.constructor.name === "AuxiliaryBoard"
                    && hotspot.tile.gameBoard.color == "white") {
                    this.hotspotFrom.tile.selected = true;
                    this.stateMachine.setState(states.UPDATE_PIECE_TO);
                }
                else {
                    this.hotspotFrom = null;
                }

            }
            else {
                if (hotspot.tile.gameBoard.constructor.name === "AuxiliaryBoard"
                    && hotspot.tile.gameBoard.color == "black") {
                    this.stateMachine.setState(states.UPDATE_PIECE_TO);
                    this.hotspotFrom.tile.selected = true;
                }
                else {
                    this.hotspotFrom = null
                }
            }
        }
        else {
            this.hotspotFrom = null;
        }
    }
    else if (this.hotspotFrom === hotspot) { // unselect
        this.hotspotFrom = null;
        if (this.stateMachine.currState === states.PIECE_SELECTION_TO) {
            this.stateMachine.setState(states.PIECE_SELECTION_FROM);
        }
        else if (this.stateMachine.currState === states.UPDATE_PIECE_TO)
            this.stateMachine.setState(states.UPDATE_PIECE_FROM);
        hotspot.tile.selected = false;
    }
    else { // move a piece
        this.hotspotTo = hotspot;
        if (this.stateMachine.currState === states.PIECE_SELECTION_TO) {
            this.client.requestMove();
            this.hotspotTo.tile.selected = true;
        }
        else if (this.stateMachine.currState === states.UPDATE_PIECE_TO) {
            
            if (hotspot.tile.gameBoard.constructor.name === "AdaptoidBoard") {
                this.client.requestUpdate();
                this.hotspotTo.tile.selected = true;
            }
            else {
                this.stateMachine.setState(states.UPDATE_PIECE_FROM);
            }
        }
        else {
            this.hotspotFrom = null;
            this.hotspotTo = null;
        }
    }
};
