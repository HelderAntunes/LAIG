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

    this.untouchablesPieces = [];
    this.inMovementPieces = [];
};

MoveAnimator.prototype.constructor = MoveAnimator;

MoveAnimator.prototype.init = function(board, currPlayer, enemyPlayer) {
    this.board = board;
    this.currPlayer = currPlayer;
    this.enemyPlayer = enemyPlayer;

    this.getPiecesInMovimentAndTheStatics();
    this.game.mainBoard.takeAllPieces();
    this.game.auxBoardWhite.takeAllPieces();
    this.game.auxBoardBlack.takeAllPieces();
    this.restartClock();

};

MoveAnimator.prototype.restartClock = function() {
    this.game.scene.firstTime = null;
};

MoveAnimator.prototype.getPiecesInMovimentAndTheStatics = function() {
    this.untouchablesPieces = [];
    this.inMovementPieces = [];
    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.game.mainBoard.getNumColumnsInRow(r); c++) {
            if (!this.game.mainBoard.tiles[r][c].isEmpty()) {
                if (this.board[r-1][c-1] != 0) // stays in the same position
                    this.untouchablesPieces.push([r, c]);
                else // in movemente or captured
                    this.inMovementPieces.push([r, c]);

            }
        }
    }
    console.log(this.untouchablesPieces);
    console.log(this.inMovementPieces);
};
