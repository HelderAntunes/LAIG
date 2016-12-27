/**
* Undo
* @constructor
*/
function Undo(game) {
    this.game = game;
    this.previousBoard = null;
    this.previousWhitePlayer = null;
    this.previousBlackPlayer = null;
    this.previousState = null;
    this.previousTurn = null;

    // pieces used
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;
};

Undo.prototype.constructor = Undo;

Undo.prototype.executeUndo = function() {
    
    this.game.mainBoard.takeAllPieces();
    this.game.auxBoardWhite.takeAllPieces();
    this.game.auxBoardBlack.takeAllPieces();
    this.setNumPiecesUsedToZero();

    this.game.whitePlayer.update(this.previousWhitePlayer[0], this.previousWhitePlayer[1], 
                                this.previousWhitePlayer[2], this.previousWhitePlayer[3]);
    this.game.blackPlayer.update(this.previousBlackPlayer[0], this.previousBlackPlayer[1], 
                                this.previousBlackPlayer[2], this.previousBlackPlayer[3]);
    this.updateAuxsBoards();
    this.updateMainBoard();

    this.restartClock();

    if (this.game.stateMachine.turn !== this.previousTurn) {
        this.game.stateMachine.currState = states.UNDO;
    }
    else {
        this.game.stateMachine.currState = this.previousState;
        this.game.stateMachine.turn = this.previousTurn;
    }
    
    this.game.hotspotFrom = null;
    this.game.hotspotTo = null;

    this.durationOfAnimation = 1;


};

Undo.prototype.display = function() {

    var time = this.game.scene.currTime;

    if (time > this.durationOfAnimation) {
        this.game.stateMachine.currState = this.previousState;
        this.game.stateMachine.turn = this.previousTurn;
        this.game.drawBoards();
        return;
    }

    if (this.game.stateMachine.turn !== this.previousTurn) {
        var perc = time / this.durationOfAnimation, ang;
        if (this.game.stateMachine.turn == turn.WHITE) {
            ang = -Math.PI/4 + perc * Math.PI;
        }
        else {
            ang = 3*Math.PI/4 - perc * Math.PI;
        }
        this.game.scene.camera.setPosition(vec3.fromValues(5 * Math.cos(ang), 10, -5 * Math.sin(ang)));
    }
    
    this.game.drawBoards();
};

Undo.prototype.restartClock = function() {
    this.game.scene.firstTime = null;
    this.game.scene.currTime = 0;
};

Undo.prototype.isPossibleExecuteUndo = function() {
    if (this.previousBoard !== null) {
        return true;
    }
    return false;
};

Undo.prototype.setNumPiecesUsedToZero = function() {
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;
};

Undo.prototype.updateAuxsBoards = function() {
    if (this.game.whitePlayer.numBodies > 0)
        this.game.auxBoardWhite.setBody(this.game.bodies[this.indexBody++], "white");
    if (this.game.whitePlayer.numLegs > 0)
        this.game.auxBoardWhite.setLeg(this.game.legs[this.indexLeg++], "white");
    if (this.game.whitePlayer.numPincers > 0)
        this.game.auxBoardWhite.setPincer(this.game.pincers[this.indexPincer++], "white");

    if (this.game.blackPlayer.numBodies > 0)
        this.game.auxBoardBlack.setBody(this.game.bodies[this.indexBody++], "black");
    if (this.game.blackPlayer.numLegs > 0)
        this.game.auxBoardBlack.setLeg(this.game.legs[this.indexLeg++], "black");
    if (this.game.blackPlayer.numPincers > 0)
        this.game.auxBoardBlack.setPincer(this.game.pincers[this.indexPincer++], "black");
};

Undo.prototype.updateMainBoard = function() {

    for (var r = 0; r < this.previousBoard.length; r++) {
        for (var c = 0; c < this.previousBoard[r].length; c++) {
            var piece = this.previousBoard[r][c];
            if (piece !== 0) {
                var color = (piece[0] === 0) ? "white" : "black";
                var numLegs = piece[1], numPincers = piece[2];

                var legs = [];
                for (var j = 0; j < numLegs; j++) {
                    legs.push(this.game.legs[this.indexLeg++]);
                }
                var pincers = [];
                for (var j = 0; j < numPincers; j++) {
                    pincers.push(this.game.pincers[this.indexPincer++]);
                }

                this.game.mainBoard.setBodyInTile(this.game.bodies[this.indexBody++],
                                                    r + 1, c + 1, color);
                this.game.mainBoard.setLegsInTile(legs, r + 1, c + 1, color);
                this.game.mainBoard.setPincersInTile(pincers, r + 1, c + 1, color);
            }
        }
    }
};


