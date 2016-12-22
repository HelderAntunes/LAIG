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

    this.durationOfEachAnimation = 1;

    this.animationIniFrom = new KeyFrameAnimation("animationIniFrom");
    this.animationIniTo = new KeyFrameAnimation("animationIniTo");
    this.animationMidTo = new KeyFrameAnimation("animationMidTo");
    this.animationMidFrom = new KeyFrameAnimation("animationMidFrom");
    this.animationEndFrom = [];
    this.animationEndTo = [];

    this.state = 0;
    this.state_ini = 0;
    this.state_mid = 1;
    this.state_end = 2;

    this.iniPos_xz;
    this.endPos_xz;

    this.posLegAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_legTile();
    this.posBodyAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_bodyTile();
    this.posPincerAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_PincerTile();
    this.posLegAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_legTile();
    this.posBodyAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_bodyTile();
    this.posPincerAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_PincerTile();

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

    this.setIniAndEndPositionsOfMove();
    this.setIniAnimationsOfPiecesFromAndTo();
    this.setMidAnimationsOfPiecesFromAndTo();
    this.setEndAnimationsOfPiecesFromAndTo();

    this.state = this.state_ini;
    this.inited = true;
};

MoveAnimator.prototype.setIniAnimationsOfPiecesFromAndTo = function() {
    this.animationIniFrom.constructSimpleKeyFrameAnimation(this.iniPos_xz[0], this.iniPos_xz[1],
                                                            this.endPos_xz[0], this.endPos_xz[1],
                                                            this.game.heightOfTile,
                                                            this.game.heightOfTile * 4,
                                                            this.durationOfEachAnimation);
    this.animationIniTo.constructLinearAnimationWidthRotationInY(this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1],
                                                                this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1],
                                                                this.durationOfEachAnimation);
};

MoveAnimator.prototype.setMidAnimationsOfPiecesFromAndTo = function() {

    var pincersFrom = this.pieceFrom.numPincers();
    var pincersTo = -1;
    if (this.pieceTo !== null) {
        pincersTo = this.pieceTo.numPincers();
    }
    if (pincersFrom > pincersTo) {
        this.animationMidTo.constructUpAndDownAnimationWithRotationInY(this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1], 2, this.durationOfEachAnimation);
        this.animationMidFrom.constructAttackedAnimation(this.endPos_xz[0], this.endPos_xz[1], this.game.heightOfTile, this.game.heightOfTile, this.durationOfEachAnimation);
    }
    else if (pincersFrom === pincersTo) {
        this.animationMidTo.constructUpAndDownAnimationWithRotationInY(this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1], 2, this.durationOfEachAnimation);
        this.animationMidFrom.constructUpAndDownAnimationWithRotationInY(this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1], 2, this.durationOfEachAnimation);
    }
    else {
        this.animationMidFrom.constructUpAndDownAnimationWithRotationInY(this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1], 2, this.durationOfEachAnimation);
        this.animationMidTo.constructAttackedAnimation(this.endPos_xz[0], this.endPos_xz[1], this.game.heightOfTile, this.game.heightOfTile, this.durationOfEachAnimation);
    }
};

MoveAnimator.prototype.setEndAnimationsOfPiecesFromAndTo = function() {
    this.animationEndFrom = [];
    this.animationEndTo = [];

    var pincersFrom = this.pieceFrom.numPincers();
    var pincersTo = -1;
    if (this.pieceTo !== null) {
        pincersTo = this.pieceTo.numPincers();
    }

    var colorFrom = (this.currPlayer[0] === 0) ? "white":"black";
    var colorTo = (this.enemyPlayer[0] === 0) ? "white":"black";

    if (pincersFrom > pincersTo) {
        var animationFrom = new KeyFrameAnimation("animationEndFrom");
        animationFrom.constructLinearAnimationWidthRotationInY(this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1],
                                                                this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1],
                                                                this.durationOfEachAnimation);
        this.animationEndFrom.push(animationFrom);

        this.animationEndTo = this.createEndAnimationOfSubPiecesOfPiece(colorTo, this.endPos_xz);
    }
    else if (pincersFrom === pincersTo) {
        this.animationEndFrom = this.createEndAnimationOfSubPiecesOfPiece(colorFrom, this.endPos_xz);
        this.animationEndTo = this.createEndAnimationOfSubPiecesOfPiece(colorTo, this.endPos_xz);
    }
    else {
        this.animationEndFrom = this.createEndAnimationOfSubPiecesOfPiece(colorFrom, this.endPos_xz);

        var animationTo = new KeyFrameAnimation("animationEndFrom");
        animationTo.constructLinearAnimationWidthRotationInY(this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1],
                                                                this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1],
                                                                this.durationOfEachAnimation);
        this.animationEndFrom.push(animationTo);
    }
};

MoveAnimator.prototype.createEndAnimationOfSubPiecesOfPiece = function(color, iniPos) {

    var animationEndToLegs = new KeyFrameAnimation("animationEndToLegs");
    var animationEndToBody = new KeyFrameAnimation("animationEndToBody");
    var animationEndToPincers = new KeyFrameAnimation("animationEndToPincers");

    var finalPosLeg, finalPosBody, finalPosPincer;
    if (color == "white") {
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

MoveAnimator.prototype.setIniAndEndPositionsOfMove = function() {
    var tileFrom = this.moveToExecute.tileFrom;
    var tileTo = this.moveToExecute.tileTo;
    this.iniPos_xz = this.game.mainBoard.getRealCoords_XZ(tileFrom.row, tileFrom.collumn);
    this.endPos_xz = this.game.mainBoard.getRealCoords_XZ(tileTo.row, tileTo.collumn);
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
        if (this.state === this.state_ini) {
            this.displayIni(time);
        }
        else if (this.state === this.state_mid) {
            this.displayMid(time);
        }
        else if (this.state === this.state_end){
            this.displayEnd(time);
        }
    }
}

MoveAnimator.prototype.displayIni = function(time) {
    if (time > this.durationOfEachAnimation) {
        this.state = this.state_mid;
        this.restartClock();
    }

    this.game.scene.pushMatrix();
    this.game.scene.multMatrix(this.animationIniFrom.getTransformationMatrix(time));
    this.pieceFrom.display();
    this.game.scene.popMatrix();

    this.game.scene.pushMatrix();
    this.game.scene.multMatrix(this.animationIniTo.getTransformationMatrix(time));
    this.pieceTo.display();
    this.game.scene.popMatrix();

};

MoveAnimator.prototype.displayMid = function(time) {
    if (this.pieceTo === null) {
        this.state = this.state_end;
    }
    else {
        if (time > this.durationOfEachAnimation) {
            this.state = this.state_end;
            this.restartClock();
        }

        this.game.scene.pushMatrix();
        this.game.scene.multMatrix(this.animationMidFrom.getTransformationMatrix(time));
        this.pieceFrom.display();
        this.game.scene.popMatrix();

        this.game.scene.pushMatrix();
        this.game.scene.multMatrix(this.animationMidTo.getTransformationMatrix(time));
        this.pieceTo.display();
        this.game.scene.popMatrix();
    }
};

MoveAnimator.prototype.displayEnd = function(time) {

};

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

    return createPiece(numLegs, numPincers, color);
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
