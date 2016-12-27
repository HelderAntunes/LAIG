/**
* GameMove
* @constructor
*/
function GameMove(tileFrom, tileTo, type, userOrBot) {
    this.tileFrom = tileFrom;
    this.tileTo = tileTo;
    this.type = type;
    this.userOrBot = userOrBot;
};

GameMove.prototype.constructor = GameMove;

GameMove.prototype.getRowAndCollumOfTileFrom = function() {
    return [this.tileFrom.row, this.tileFrom.collumn];
};

GameMove.prototype.getRowAndCollumOfTileTo = function() {
    return [this.tileTo.row, this.tileTo.collumn];
};
