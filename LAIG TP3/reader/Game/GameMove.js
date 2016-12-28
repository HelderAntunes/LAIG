/**
* GameMove
* @constructor
* Saves information of a move.
*/
function GameMove(tileFrom, tileTo, type, userOrBot) {
    this.tileFrom = tileFrom;
    this.tileTo = tileTo;
    this.type = type;
    this.userOrBot = userOrBot;
};

GameMove.prototype.constructor = GameMove;

/**
 * Get the position <row,col> of tileFrom.
 */
GameMove.prototype.getRowAndCollumOfTileFrom = function() {
    return [this.tileFrom.row, this.tileFrom.collumn];
};

/**
 * Get the position <row,col> of tileTo.
 */
GameMove.prototype.getRowAndCollumOfTileTo = function() {
    return [this.tileTo.row, this.tileTo.collumn];
};
