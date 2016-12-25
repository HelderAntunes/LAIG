/**
* UpdateAnimator
* @constructor
*/
function UpdateAnimator(game) {
    this.game = game;
    this.board = null;
    this.currPlayer = null;
    this.moveToExecute = null;
    this.inited = false;

    this.piecesUntouchable = [];

    // pieces used
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;

    this.durationOfEachAnimation = 1;

    this.iniPos_xz;
    this.endPos_xz;

    this.pieceUpdated = null;
    this.pieceToAdd = null;

    this.animationOfPieceToAdd = new KeyFrameAnimation("animationOfPieceToAdd");
    this.animationOfPieceUpdated = new KeyFrameAnimation("animationOfPieceUpdated");

    this.posLegAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_legTile();
    this.posBodyAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_bodyTile();
    this.posPincerAuxBoard_white = this.game.auxBoardWhite.getRealXZCoords_PincerTile();
    this.posLegAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_legTile();
    this.posBodyAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_bodyTile();
    this.posPincerAuxBoard_black = this.game.auxBoardBlack.getRealXZCoords_PincerTile();

};

UpdateAnimator.prototype.constructor = UpdateAnimator;

UpdateAnimator.prototype.init = function(board, currPlayer) {

    this.setNumPiecesUsedToZero();
    this.setPiecesUsedInAnimation();
    this.getCapturedAndNonCapturedPieces();
    this.game.mainBoard.takeAllPieces();
    this.game.auxBoardWhite.takeAllPieces();
    this.game.auxBoardBlack.takeAllPieces();
    this.setNonCapturedPiecesInMainBoard(); 
    this.updateCurrentPlayer();
    this.updateAuxsBoards(); 
    this.restartClock();

    this.setIniAndEndPositionsOfMove(); 
    this.setAnimationOfPieceToAdd(); 
    this.setAnimationOfPieceUpdated();

    this.inited = true;
};

UpdateAnimator.prototype.setPiecesUsedInAnimation = function() {
    this.pieceUpdated = null;
    var color = (this.currPlayer[0] === 0) ? "white":"black";
    
    if (this.moveToExecute.type === "update_createAdaptoid") {
        this.pieceToAdd = this.game.bodies[this.indexBody++];
    }
    else if (this.moveToExecute.type === "update_addLeg") {
        this.pieceToAdd = this.game.legs[this.indexLeg++];
    }
    else if (this.moveToExecute.type === "update_addPincer") {
        this.pieceToAdd = this.game.pincers[this.indexPincer++];
    }

    this.pieceToAdd.color = color;
};

UpdateAnimator.prototype.setNumPiecesUsedToZero = function() {
    this.indexBody = 0;
    this.indexLeg = 0;
    this.indexPincer = 0;
};

UpdateAnimator.prototype.display = function () {
    if (this.inited === false) {
        this.game.drawBoards();
        this.init();
    }
    else {
        this.game.drawBoards();

        var time = this.game.scene.currTime;

        if (time > this.durationOfEachAnimation) {
            this.setPiecesUsedInAnimationInMainBoard();
            this.game.stateMachine.currState = states.ANIMATION_CAPTURE;
            this.inited = false;
            if (this.moveToExecute.tileFrom !== null)
                this.moveToExecute.tileFrom.selected = false;
            this.moveToExecute.tileTo.selected = false;
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

        this.game.scene.pushMatrix();
        this.game.scene.multMatrix(this.animationOfPieceToAdd.getTransformationMatrix(time));
        this.pieceToAdd.display();
        this.game.scene.popMatrix();

        if (this.isPieceUpdated !== null && this.pieceUpdated !== null) {
            this.game.scene.pushMatrix();
            this.game.scene.multMatrix(this.animationOfPieceUpdated.getTransformationMatrix(time));
            this.pieceUpdated.display();
            this.game.scene.popMatrix();
        }
    }
};

UpdateAnimator.prototype.getCapturedAndNonCapturedPieces = function() {
    this.piecesUntouchable = [];

    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.game.mainBoard.getNumColumnsInRow(r); c++) {
            if (this.pieceIsOfMove(r, c)) {
                if (this.moveToExecute.type === "update_addLeg"
                    || this.moveToExecute.type === "update_addPincer") {
                    this.pieceUpdated = this.getPieceUpdated(r, c);
                }

            }
            else if (!this.game.mainBoard.tiles[r][c].isEmpty()) {
                if (this.board[r-1][c-1] != 0) // stays in the same position
                    this.piecesUntouchable.push([r, c]);
            }
        }
    }
};

UpdateAnimator.prototype.pieceIsOfMove = function(r, c) {
    var rowTo = this.moveToExecute.tileTo.row;
    var colTo = this.moveToExecute.tileTo.collumn;
    if (rowTo === r && colTo === c)
        return true;
    return false;
};

UpdateAnimator.prototype.getPieceUpdated = function(r, c) {
    var tile = this.game.mainBoard.tiles[r][c];
    var color = tile.getColorOfHisPiece();

    var numLegs = tile.getNumLegs();
    var numPincers = tile.getNumPincers();

    return this.createPiece(numLegs, numPincers, color, r, c);
};

UpdateAnimator.prototype.createPiece = function(numLegs, numPincers, color, r, c) {

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

UpdateAnimator.prototype.setNonCapturedPiecesInMainBoard = function() {

    for (var i = 0; i < this.piecesUntouchable.length; i++) {
        var r = this.piecesUntouchable[i][0] - 1;
        var c = this.piecesUntouchable[i][1] - 1;
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

UpdateAnimator.prototype.updateCurrentPlayer = function() {
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

UpdateAnimator.prototype.updateAuxsBoards = function() {
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

UpdateAnimator.prototype.setIniAndEndPositionsOfMove = function() {
    var tileFrom = this.moveToExecute.tileFrom;
    var tileTo = this.moveToExecute.tileTo;

    var color = (this.currPlayer[0] === 0) ? "white":"black";
    if (color == "white") {
        if (this.moveToExecute.type === "update_createAdaptoid") {
            this.iniPos_xz = this.posBodyAuxBoard_white;
        }
        else if (this.moveToExecute.type === "update_addLeg") {
            this.iniPos_xz = this.posLegAuxBoard_white;
        }
        else if (this.moveToExecute.type === "update_addPincer") {
            this.iniPos_xz = this.posPincerAuxBoard_white;
        }
    }
    else {
        if (this.moveToExecute.type === "update_createAdaptoid") {
            this.iniPos_xz = this.posBodyAuxBoard_black;
        }
        else if (this.moveToExecute.type === "update_addLeg") {
            this.iniPos_xz = this.posLegAuxBoard_black;
        }
        else if (this.moveToExecute.type === "update_addPincer") {
            this.iniPos_xz = this.posPincerAuxBoard_black;
        }
    }

    this.endPos_xz = this.game.mainBoard.getRealCoords_XZ(tileTo.row, tileTo.collumn);
};

UpdateAnimator.prototype.setPiecesUsedInAnimationInMainBoard = function() {
    var color = (this.currPlayer[0] === 0) ? "white":"black";
    var pos = this.moveToExecute.getRowAndCollumOfTileTo();
    if (this.moveToExecute.type == "update_createAdaptoid") {
        this.game.mainBoard.setBodyInTile(this.pieceToAdd, pos[0], pos[1], color);
    }
    else {
        if (this.moveToExecute.type == "update_addLeg") {
            this.game.mainBoard.setBodyInTile(this.pieceUpdated.body[0], pos[0], pos[1], color);
            var legs = this.pieceUpdated.legs.concat([this.pieceToAdd]);
            this.game.mainBoard.setLegsInTile(legs, pos[0], pos[1], color);
            this.game.mainBoard.setPincersInTile(this.pieceUpdated.pincers, pos[0], pos[1], color);
        }
        else if (this.moveToExecute.type === "update_addPincer") {
            this.game.mainBoard.setBodyInTile(this.pieceUpdated.body[0], pos[0], pos[1], color);
            var pincers = this.pieceUpdated.pincers.concat([this.pieceToAdd]);
            this.game.mainBoard.setPincersInTile(pincers, pos[0], pos[1], color);
            this.game.mainBoard.setLegsInTile(this.pieceUpdated.legs, pos[0], pos[1], color);
        }
    }
};

UpdateAnimator.prototype.setAnimationOfPieceToAdd = function() {
    this.animationOfPieceToAdd.constructSimpleKeyFrameAnimation(
    this.iniPos_xz[0], this.iniPos_xz[1], this.endPos_xz[0], this.endPos_xz[1], 
    this.game.heightOfTile, this.game.heightOfTile * 4, this.durationOfEachAnimation);
};

UpdateAnimator.prototype.setAnimationOfPieceUpdated = function() {
    this.animationOfPieceUpdated.constructUpAndDownAnimationWithRotationInY(
    this.endPos_xz[0], this.game.heightOfTile, this.endPos_xz[1], 
    this.game.heightOfTile*2, this. durationOfEachAnimation);
};

UpdateAnimator.prototype.restartClock = function() {
    this.game.scene.firstTime = null;
    this.game.scene.currTime = 0;
};











