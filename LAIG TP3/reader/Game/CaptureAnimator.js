/**
* CaptureAnimator
* @constructor
*/
function CaptureAnimator(game) {

    this.requestSent = false;
    this.requestReply = false;

    this.game = game;
    this.board = null;
    this.currPlayer = null;
    this.moveToExecute = null;

    // pieces used
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;

    this.durationOfEachAnimation = 1;

    this.untouchablePieces = [];
    this.capturedPieces = [];
    this.movingAnimationsOfCapturesPieces = [];

    this.posLegAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_legTile();
    this.posBodyAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_bodyTile();
    this.posPincerAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_PincerTile();
    this.posLegAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_legTile();
    this.posBodyAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_bodyTile();
    this.posPincerAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_PincerTile();

    this.inited = false;
};

CaptureAnimator.prototype.constructor = CaptureAnimator;

CaptureAnimator.prototype.init = function() {
    this.setNumPiecesUsedToZero();
    this.getCapturedAndNonCapturedPieces(); 
    this.game.mainBoard.takeAllPieces();
    this.game.auxBoardWhite.takeAllPieces();
    this.game.auxBoardBlack.takeAllPieces(); 
    this.setNonCapturedPiecesInMainBoard(); 
    this.updateAuxsBoards(); 
    this.restartClock();

    this.setAnimationsOfCapturedPieces();

    this.inited = true;
};

CaptureAnimator.prototype.setAnimationsOfCapturedPieces = function() {

    this.movingAnimationsOfCapturesPieces = [];

    for (var i = 0; i < this.capturedPieces.length; i++) {
        var piece = this.capturedPieces[i];
        var pos = this.game.mainBoard.getRealCoords_XZ(piece.row, piece.col);
        var movAnim = this.createEndAnimationOfSubPiecesOfPiece(piece.color, pos);
        this.movingAnimationsOfCapturesPieces.push(movAnim);
    }

};

CaptureAnimator.prototype.createEndAnimationOfSubPiecesOfPiece = function(color, iniPos) {

    var animationEndToLegs = new KeyFrameAnimation("animationEndToLegs");
    var animationEndToBody = new KeyFrameAnimation("animationEndToBody");
    var animationEndToPincers = new KeyFrameAnimation("animationEndToPincers");

    var finalPosLeg, finalPosBody, finalPosPincer;
    if (color == "black") {
        finalPosLeg = this.posLegAuxBoard_white;
        finalPosBody = this.posBodyAuxBoard_white;
        finalPosPincer = this.posPincerAuxBoard_white;
    }
    else {
        finalPosLeg = this.posLegAuxBoard_black;
        finalPosBody = this.posBodyAuxBoard_black;
        finalPosPincer = this.posPincerAuxBoard_black;
    }

    animationEndToLegs.constructSimpleKeyFrameAnimation(iniPos[0], iniPos[1],
                                                        finalPosLeg[0], finalPosLeg[1],
                                                        this.game.heightOfTile,
                                                        this.game.heightOfTile * 4,
                                                        this.durationOfEachAnimation);
    animationEndToBody.constructSimpleKeyFrameAnimation(iniPos[0], iniPos[1],
                                                        finalPosBody[0], finalPosBody[1],
                                                        this.game.heightOfTile,
                                                        this.game.heightOfTile * 4,
                                                        this.durationOfEachAnimation);
    animationEndToPincers.constructSimpleKeyFrameAnimation(iniPos[0], iniPos[1],
                                                        finalPosPincer[0], finalPosPincer[1],
                                                        this.game.heightOfTile,
                                                        this.game.heightOfTile * 4,
                                                        this.durationOfEachAnimation);

    return [animationEndToBody, animationEndToLegs, animationEndToPincers];
};

CaptureAnimator.prototype.restartClock = function() {
    this.game.scene.firstTime = null;
    this.game.scene.currTime = 0;
};

CaptureAnimator.prototype.display = function () {
    if (this.inited === false) {
        this.game.drawBoards();
        this.init();
    }
    else {

        this.game.drawBoards();

        var time = this.game.scene.currTime;

        if (time > this.durationOfEachAnimation) {
            this.updatePlayers();
            this.updateAuxsBoards2();
            this.game.stateMachine.currState = states.TURN_CHANGE;
            this.inited = false;
            this.requestReply = false;
            this.requestSent = false;
            var end = this.game.isEnded();
            if (end === "white wins") {
                this.game.stateMachine.currState = states.END_GAME;
                this.game.stateMachine.winner = "white";
            }
            else if (end === "black wins") {
                this.game.stateMachine.currState = states.END_GAME;
                this.game.stateMachine.winner = "black";
            }
        }

        for (var i = 0; i < this.capturedPieces.length; i++) {
            var piece = this.capturedPieces[i];
            this.drawPieceGoingOnToAuxBoard(piece, this.movingAnimationsOfCapturesPieces[i], time);
        }
    }
}

CaptureAnimator.prototype.updatePlayers = function() {
    var color = (this.currPlayer[0] === 0) ? "white":"black";

    if (color == "white") {
        this.game.whitePlayer.numBodies = this.currPlayer[1];
        this.game.whitePlayer.numLegs = this.currPlayer[2];
        this.game.whitePlayer.numPincers = this.currPlayer[3];
        this.game.whitePlayer.score = this.currPlayer[4];
    }
    else {
        this.game.blackPlayer.numBodies = this.currPlayer[1];
        this.game.blackPlayer.numLegs = this.currPlayer[2];
        this.game.blackPlayer.numPincers = this.currPlayer[3];
        this.game.blackPlayer.score = this.currPlayer[4];
    } 
}

CaptureAnimator.prototype.updateAuxsBoards2 = function() {
    if (this.game.whitePlayer.numBodies > 1 && this.game.auxBoardWhite.bodyTile.isEmpty()) {
        this.game.auxBoardWhite.setBody(this.game.bodies[this.indexBody++], "white");
    }

    if (this.game.whitePlayer.numLegs > 1 && this.game.auxBoardWhite.legTile.isEmpty()) {
        this.game.auxBoardWhite.setLeg(this.game.legs[this.indexLeg++], "white");
    }

    if (this.game.whitePlayer.numPincers > 1 && this.game.auxBoardWhite.pincerTile.isEmpty()) {
        this.game.auxBoardWhite.setPincer(this.game.pincers[this.indexPincer++], "white");
    }

    if (this.game.blackPlayer.numBodies > 1 && this.game.auxBoardBlack.bodyTile.isEmpty()) {
        this.game.auxBoardBlack.setBody(this.game.bodies[this.indexBody++], "black");
    }

    if (this.game.blackPlayer.numLegs > 1 && this.game.auxBoardBlack.legTile.isEmpty()) {
        this.game.auxBoardBlack.setLeg(this.game.legs[this.indexLeg++], "black");
    }

    if (this.game.blackPlayer.numPincers > 1 && this.game.auxBoardBlack.pincerTile.isEmpty()) {
        this.game.auxBoardBlack.setPincer(this.game.pincers[this.indexPincer++], "black");
    }
}

CaptureAnimator.prototype.drawPieceGoingOnToAuxBoard = function(piece, animation, time) {

    // body
    this.game.scene.pushMatrix();
    this.game.scene.multMatrix(animation[0].getTransformationMatrix(time));
    piece.body[0].display();
    this.game.scene.popMatrix();

    // legs
    this.game.scene.pushMatrix();
    this.game.scene.multMatrix(animation[1].getTransformationMatrix(time));
    var legs = piece.legs;
    for (var i = 0; i < legs.length; i++) {
        legs[i].display();
    }
    this.game.scene.popMatrix();

    // pincers
    this.game.scene.pushMatrix();
    this.game.scene.multMatrix(animation[2].getTransformationMatrix(time));
    var pincers = piece.pincers;
    for (var i = 0; i < pincers.length; i++) {
        pincers[i].display();
    }
    this.game.scene.popMatrix();

};

CaptureAnimator.prototype.drawPieceInBoard = function(piece, animation, time) {
    this.game.scene.pushMatrix();
    this.game.scene.multMatrix(animation[0].getTransformationMatrix(time));
    piece.display();
    this.game.scene.popMatrix();
};

CaptureAnimator.prototype.getCapturedAndNonCapturedPieces = function() {
    this.untouchablePieces = [];
    this.capturedPieces = [];
    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.game.mainBoard.getNumColumnsInRow(r); c++) {
            if (!this.game.mainBoard.tiles[r][c].isEmpty()) {
                if (this.board[r-1][c-1] != 0) 
                    this.untouchablePieces.push([r, c]);
                else
                    this.capturedPieces.push(this.getPieceCaptured(r, c));
            }
        }
    }
};

CaptureAnimator.prototype.setNumPiecesUsedToZero = function() {
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;
};

CaptureAnimator.prototype.setNonCapturedPiecesInMainBoard = function() {

    for (var i = 0; i < this.untouchablePieces.length; i++) {
        var r = this.untouchablePieces[i][0] - 1;
        var c = this.untouchablePieces[i][1] - 1;
        var color = (this.board[r][c][0] === 0) ? "white" : "black";
        var numLegs = this.board[r][c][1];
        var numPincers = this.board[r][c][2];

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

};

CaptureAnimator.prototype.updateAuxsBoards = function() {
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

CaptureAnimator.prototype.getPieceCaptured = function(r, c) {
    var tile = this.game.mainBoard.tiles[r][c];
    var color = tile.getColorOfHisPiece();

    var numLegs = tile.getNumLegs();
    var numPincers = tile.getNumPincers();

    return this.createPiece(numLegs, numPincers, color, r, c);
};

CaptureAnimator.prototype.createPiece = function(numLegs, numPincers, color, r, c) {

    var body = this.game.bodies[this.indexBody++];
    body.color = color;
    var legs = [], pincers = [];
    for (var i = 0; i < numLegs; i++) {
        var leg = this.game.legs[this.indexLeg++];
        leg.color = color;
        legs.push(leg);
    }
    for (var i = 0; i < numPincers; i++) {
        var pincer = this.game.pincers[this.indexPincer++];
        pincer.color = color;
        pincers.push(pincer);
    }
    return new Piece(this.game.scene, body, legs, pincers, color, r, c);
};
