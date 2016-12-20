/**
* MoveAnimator
* @constructor
*/
function MoveAnimator(game) {
    this.game = game;
    this.board = null;
    this.currPlayer = null;
    this.enemyPlayer = null;
};

MoveAnimator.prototype.constructor = MoveAnimator;

MoveAnimator.prototype.init = function(board, currPlayer, enemyPlayer) {
    this.board = board;
    this.currPlayer = currPlayer;
    this.enemyPlayer = enemyPlayer;
    console.log(this.board);
    console.log(this.currPlayer);
    console.log(this.enemyPlayer);
};
