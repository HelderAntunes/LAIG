/**
* MoveAnimator
* @constructor
*/
function MoveAnimator(game) {
    this.game = game;
    this.board = null;
    this.currPlayer = null;
    this.enemyPlayer = null;
    this.moveToExecute = null;
    this.waitingForMoveReply = false;
    this.inited = false;

    this.nonCapturedPieces = [];
    this.capturedPieces = [];
    this.pieceFrom;
    this.pieceTo;

    // pieces used
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;

    this.animationOfMove = new KeyFrameAnimation("animationOfMove");
    this.animationOfAttackTo = new KeyFrameAnimation("animationOfAttackTo");
    this.animationOfAttackFrom = new KeyFrameAnimation("animationOfAttackFrom");

    this.state = 0;
    this.state_mainMove = 0;
    this.state_atack = 1;
    this.state_capturedPiecesMove = 2;

};

MoveAnimator.prototype.constructor = MoveAnimator;

MoveAnimator.prototype.init = function(board, currPlayer, enemyPlayer) {

    this.setNumPiecesUsedToZero();
    this.setPieceFromAndPieceTo();
    this.getCapturedAndNonCapturedPieces();
    this.game.mainBoard.takeAllPieces();
    this.game.auxBoardWhite.takeAllPieces();
    this.game.auxBoardBlack.takeAllPieces();
    this.setNonCapturedPiecesInMainBoard();
    this.updateAuxsBoards();
    this.restartClock();

    var tileFrom = this.moveToExecute.tileFrom;
    var tileTo = this.moveToExecute.tileTo;
    var iniPos_xz = this.game.mainBoard.getRealCoords_XZ(tileFrom.row, tileFrom.collumn);
    var endPos_xz = this.game.mainBoard.getRealCoords_XZ(tileTo.row, tileTo.collumn);
    this.animationOfMove.constructSimpleKeyFrameAnimation(iniPos_xz[0], iniPos_xz[1],
                                                        endPos_xz[0], endPos_xz[1],
                                                        this.game.heightOfTile,
                                                        this.game.heightOfTile * 4,
                                                        1);
    var pincersFrom = this.pieceFrom.numPincers();
    var pincersTo = -1;
    if (this.pieceTo !== null) {
        pincersTo = this.pieceTo.numPincers();
    }
    if (pincersFrom > pincersTo) {
        this.animationOfAttackTo.constructAttackedAnimation(endPos_xz[0], endPos_xz[1], this.game.heightOfTile, 2, 1);
        this.animationOfAttackFrom.constructAttackedAnimation(endPos_xz[0], endPos_xz[1], this.game.heightOfTile, this.game.heightOfTile, 1);
    }
    else if (pincersFrom === pincersTo) {
        this.animationOfAttackTo.constructAttackedAnimation(endPos_xz[0], endPos_xz[1], this.game.heightOfTile, 2, 1);
        this.animationOfAttackFrom.constructAttackedAnimation(endPos_xz[0], endPos_xz[1], this.game.heightOfTile, 2, 1);
    }
    else {
        this.animationOfAttackFrom.constructAttackedAnimation(endPos_xz[0], endPos_xz[1], this.game.heightOfTile, 2, 1);
        this.animationOfAttackTo.constructAttackedAnimation(endPos_xz[0], endPos_xz[1], this.game.heightOfTile, this.game.heightOfTile, 1);
    }

    this.state = this.state_mainMove;
    this.inited = true;
};

MoveAnimator.prototype.restartClock = function() {
    this.game.scene.firstTime = null;
    this.game.scene.currTime = 0;
};

MoveAnimator.prototype.display = function () {
    if (this.inited === false)
        this.init();
    else {
        var time = this.game.scene.currTime;
        if (this.state === this.state_mainMove) {
            if (time > this.animationOfMove.getTotalTimeOfAnimation()) {
                this.state = this.state_atack;
                this.restartClock();
            }
            this.game.scene.pushMatrix();
            this.game.scene.multMatrix(this.animationOfMove.getTransformationMatrix(time));
            this.pieceFrom.display();
            this.game.scene.popMatrix();
        }
        else if (this.state === this.state_atack) {
            if (this.pieceTo === null) {
                this.state = this.state_capturedPiecesMove;
            }
            else {
                this.game.scene.pushMatrix();
                this.game.scene.multMatrix(this.animationOfAttackFrom.getTransformationMatrix(time));
                this.pieceFrom.display();
                this.game.scene.popMatrix();
                this.game.scene.pushMatrix();
                this.game.scene.multMatrix(this.animationOfAttackTo.getTransformationMatrix(time));
                this.pieceTo.display();
                this.game.scene.popMatrix();
            }
        }
        else {

        }

    }

}

MoveAnimator.prototype.getCapturedAndNonCapturedPieces = function() {
    this.nonCapturedPieces = [];
    this.capturedPieces = [];
    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.game.mainBoard.getNumColumnsInRow(r); c++) {
            if (this.pieceIsOfMove(r, c))
                continue;
            if (!this.game.mainBoard.tiles[r][c].isEmpty()) {
                if (this.board[r-1][c-1] != 0) // stays in the same position
                    this.nonCapturedPieces.push([r, c]);
                else // in moviment or captured
                    this.capturedPieces.push(this.getPieceCaptured(r, c));
            }
        }
    }
};

MoveAnimator.prototype.pieceIsOfMove = function(r, c) {
    var rowFrom = this.moveToExecute.tileFrom.row;
    var colFrom = this.moveToExecute.tileFrom.collumn;
    var rowTo = this.moveToExecute.tileTo.row;
    var colTo = this.moveToExecute.tileTo.collumn;
    if (rowFrom === r && colFrom === c)
        return true;
    if (rowTo === r && colTo === c)
        return true;
    return false;
};

MoveAnimator.prototype.setNumPiecesUsedToZero = function() {
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;
};

MoveAnimator.prototype.setNonCapturedPiecesInMainBoard = function() {

    for (var i = 0; i < this.nonCapturedPieces.length; i++) {
        var r = this.nonCapturedPieces[i][0] - 1;
        var c = this.nonCapturedPieces[i][1] - 1;
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

MoveAnimator.prototype.updateAuxsBoards = function() {
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

MoveAnimator.prototype.setPieceFromAndPieceTo = function() {

    var tileFrom = this.moveToExecute.tileFrom;
    var tileTo = this.moveToExecute.tileTo;

    var colorFrom = (this.currPlayer[0] === 0) ? "white":"black";
    var numLegsFrom = tileFrom.getNumLegs();
    var numPincersFrom = tileFrom.getNumPincers();
    this.pieceFrom = this.createPiece(numLegsFrom, numPincersFrom, colorFrom);
    if (tileTo.isEmpty()) {
        this.pieceTo = null;
        return;
    }
    else {
        var colorTo = (this.enemyPlayer[0] === 0) ? "white":"black";
        var numLegsTo = tileTo.getNumLegs();
        var numPincersTo = tileTo.getNumPincers();
        this.pieceTo = this.createPiece(numLegsTo, numPincersTo, colorTo);
    }
};

MoveAnimator.prototype.getPieceCaptured = function(r, c) {
    var tile = this.game.mainBoard.tiles[r][c];
    var color = tile.getColorOfHisPiece();

    var numLegs = tile.getNumLegs();
    var numPincers = tile.getNumPincers();

    return createPiece(numLegs, numPincersm, color);
};

MoveAnimator.prototype.createPiece = function(numLegs, numPincers, color) {

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
    return new Piece(this.game.scene, body, legs, pincers, color);
};
