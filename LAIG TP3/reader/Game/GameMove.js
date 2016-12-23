/**
* GameMove
* @constructor
*/
function GameMove(tileFrom, tileTo, type) {
    this.tileFrom = tileFrom;
    this.tileTo = tileTo;
    this.type = type;
};

GameMove.prototype.constructor = GameMove;

GameMove.prototype.getRowAndCollumOfTileFrom = function() {
    return [this.tileFrom.row, this.tileFrom.collumn];
};

GameMove.prototype.getRowAndCollumOfTileTo = function() {
    return [this.tileTo.row, this.tileTo.collumn];
};
