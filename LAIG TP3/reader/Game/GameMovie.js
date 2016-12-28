/**
* GameMovie
* @constructor
* Draw the movie of game.
*/
function GameMovie(game) {

    this.game = game;

    this.active = false;
    this.indexOfMove = 0;
    this.indexLastMove = 0;

};

GameMovie.prototype.constructor = GameMovie;

/**
 * Prepare the boards, the players and state machine.
 * This function is called when the user press the button of movie game in interface.
 */
GameMovie.prototype.prepareMovie = function() {

    this.game.mainBoard.takeAllPieces();
    this.game.auxBoardWhite.takeAllPieces();
    this.game.auxBoardBlack.takeAllPieces();

    this.initBoards();

    this.game.whitePlayer = new Player("w");
    this.game.blackPlayer = new Player("b");

    this.game.stateMachine = new StateMachine(states.PIECE_SELECTION_FROM, turn.WHITE);

    this.indexLastMove = this.game.moves.length-1;
    this.active = true;
};

/**
 * Init main boards and auxiliary boards.
 */
GameMovie.prototype.initBoards = function() {

    this.game.auxBoardWhite.setBody(this.game.bodies[4], "white");
    this.game.auxBoardWhite.setLeg(this.game.legs[0], "white");
    this.game.auxBoardWhite.setPincer(this.game.pincers[0], "white");

    this.game.auxBoardBlack.setBody(this.game.bodies[5], "black");
    this.game.auxBoardBlack.setLeg(this.game.legs[1], "black");
    this.game.auxBoardBlack.setPincer(this.game.pincers[1], "black");

    this.game.mainBoard.setBodyInTile(this.game.bodies[0], 4, 2, "white");
    this.game.mainBoard.setBodyInTile(this.game.bodies[1], 4, 6, "black");
};

/**
 * Return true if the movie is active, false otherwise.
 */
GameMovie.prototype.isActive = function() {
    return this.active;
};

/**
 * Display the movie of game.
 * When the state of state machine is 'PIECE_SELECTION_FROM' or 'UPDATE_PIECE_FROM',
 * the function selectPiece is called to inspect the next move previously saved.
 */
GameMovie.prototype.display = function() {
 
    if (this.game.scene.pickMode) {
        this.game.drawBoards();
    }
    else if (this.game.stateMachine.currState == states.PIECE_SELECTION_FROM) {
        var colorPlayer = (this.game.stateMachine.turn === turn.WHITE) ? "white":"black";
        if (!this.game.mainBoard.playerCanMoveAndCapture(colorPlayer)) {
            this.game.stateMachine.currState = states.UPDATE_PIECE_FROM;
        }
        this.selectPiece();
        this.game.drawBoards();
    }
    else if (this.game.stateMachine.currState == states.ANIMATION_MOVE) {
        this.game.moveAnimator.display();
    }
    else if (this.game.stateMachine.currState == states.ANIMATION_UPDATE) {
        this.game.updateAnimator.display();
    }
    else if (this.game.stateMachine.currState == states.UPDATE_PIECE_FROM) {
        if (this.game.stateMachine.turn == turn.WHITE) {
            if (this.game.whitePlayer.stockIsExpired()) {
                this.game.stateMachine.currState = states.ANIMATION_CAPTURE;
            }
        }
        else {
            if (this.game.blackPlayer.stockIsExpired()) {
                this.game.stateMachine.currState = states.ANIMATION_CAPTURE;
            }
        }
        this.selectPiece();
        this.game.drawBoards();
    }
    else if (this.game.stateMachine.currState == states.ANIMATION_CAPTURE) {
        if (this.game.captureAnimator.requestSent === false) {
            this.game.client.requestCapture(); 
            this.game.drawBoards();  
        }
        else {
            if (this.game.captureAnimator.requestReply === true) {
                this.game.captureAnimator.display();
            }
            else {
                this.game.drawBoards();
            }
        }
    }
    else if (this.game.stateMachine.currState == states.TURN_CHANGE) {
        this.game.turnChangeAnimator.display();
    }
    else {
        this.game.drawBoards();
    }
};

/**
 * Inspect the current move previously saved.
 * Select the tiles and hotspots corresponding to the current move,
 * and request data from Client module.
 */
GameMovie.prototype.selectPiece = function() {
    var move = this.game.moves[this.indexOfMove++];

    if (move.type == "move") {
        this.game.hotspotFrom = move.tileFrom.hotspot;
        this.game.hotspotTo = move.tileTo.hotspot;
        this.game.stateMachine.currState = states.PIECE_SELECTION_TO;
        this.game.client.requestMove();
        this.game.hotspotTo.tile.selected = true;
        this.game.hotspotFrom.tile.selected = true;
    }
    else if (move.type == "update_createAdaptoid") {
        var tileTo = move.tileTo;
        var tileFrom = (this.game.stateMachine.turn == turn.WHITE)?this.game.auxBoardWhite.bodyTile:this.game.auxBoardBlack.bodyTile;

        this.game.hotspotFrom = tileFrom.hotspot;
        this.game.hotspotTo = tileTo.hotspot;
        this.game.stateMachine.currState = states.UPDATE_PIECE_TO;
        this.game.client.requestUpdate();
        this.game.hotspotTo.tile.selected = true;
        this.game.hotspotFrom.tile.selected = true;
    }
    else if (move.type == "update_addLeg") {
        var tileTo = move.tileTo;
        var tileFrom = (this.game.stateMachine.turn == turn.WHITE)?this.game.auxBoardWhite.legTile:this.game.auxBoardBlack.legTile;

        this.game.hotspotFrom = tileFrom.hotspot;
        this.game.hotspotTo = tileTo.hotspot;
        this.game.stateMachine.currState = states.UPDATE_PIECE_TO;
        this.game.client.requestUpdate();
        this.game.hotspotTo.tile.selected = true;
        this.game.hotspotFrom.tile.selected = true;
    }
    else if (move.type == "update_addPincer") {
        var tileTo = move.tileTo;
        var tileFrom = (this.game.stateMachine.turn == turn.WHITE)?this.game.auxBoardWhite.pincerTile:this.game.auxBoardBlack.pincerTile;

        this.game.hotspotFrom = tileFrom.hotspot;
        this.game.hotspotTo = tileTo.hotspot;
        this.game.stateMachine.currState = states.UPDATE_PIECE_TO;
        this.game.client.requestUpdate();
        this.game.hotspotTo.tile.selected = true;
        this.game.hotspotFrom.tile.selected = true;
    }
};
