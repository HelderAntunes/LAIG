/**
* AdaptoidBoard
* @constructor
*/
function AdaptoidBoard(scene, game, radiusOfTile, heightOfTile) {
    this.scene = scene;

    this.game = game;

    this.radiusOfTile = radiusOfTile;
    this.heightOfTile = heightOfTile;
    this.widthBoard = 7 * this.radiusOfTile * 2;

    this.tiles = [];
    this.initTiles();

};

AdaptoidBoard.prototype.constructor = AdaptoidBoard;

AdaptoidBoard.prototype.initTiles = function() {

    for (var r = 1; r <= 7; r++) {
        this.tiles[r] = [];
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
            this.tiles[r][c] = new Tile(this.scene, this, r, c,
                                        this.radiusOfTile, this.heightOfTile, [], [], []);
        }
    }

};

AdaptoidBoard.prototype.playerCanMoveAndCapture = function(colorPlayer) {
    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
            if (!this.tiles[r][c].isEmpty() &&
                this.tiles[r][c].getColorOfHisPiece() === colorPlayer &&
                this.tiles[r][c].getNumLegs() > 0) {
                return true;
            }
        }
    }
    return false;
}; 

AdaptoidBoard.prototype.takeAllPieces = function() {
    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
            this.tiles[r][c].adaptoidBody = [];
            this.tiles[r][c].adaptoidLegs = [];
            this.tiles[r][c].adaptoidPincers = [];
        }
    }
};

AdaptoidBoard.prototype.setBodyInTile = function(body, row, collumn, color) {
    var tile = this.tiles[row][collumn];
    tile.setBody([body]);
    body.game = this.game;
    body.color = color;
};

AdaptoidBoard.prototype.setLegsInTile = function(legs, row, collumn, color) {
    var tile = this.tiles[row][collumn];
    tile.setLegs(legs);
    for (var i = 0; i < legs.length; i++) {
        legs[i].game = this.game;
        legs[i].color = color;
    }
};

AdaptoidBoard.prototype.setPincersInTile = function(pincers, row, collumn, color) {
    var tile = this.tiles[row][collumn];
    tile.setPincers(pincers);
    for (var i = 0; i < pincers.length; i++) {
        pincers[i].game = this.game;
        pincers[i].color = color;
    }
};

AdaptoidBoard.prototype.getHotspots = function() {
    var hotspots = [];
    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
            hotspots.push(this.tiles[r][c].hotspot);
        }
    }
    return hotspots;
};

AdaptoidBoard.prototype.display = function() {
    this.scene.pushMatrix();

        this.scene.translate(-this.widthBoard/2, 0, -this.widthBoard/2);

        for (var r = 1; r <= 7; r++) {
            for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
                this.displayTile(this.tiles[r][c], r, c);
            }
        }

    this.scene.popMatrix();
};

AdaptoidBoard.prototype.numPiecesOfAColorInBoard = function(color) {
    var res = 0;
    for (var r = 1; r <= 7; r++) {
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
            if (this.tiles[r][c].isEmpty() === false
                && this.tiles[r][c].getColorOfHisPiece() === color)
                res++;
        }
    }
    return res;
};

AdaptoidBoard.prototype.displayTile = function(tile, r, c) {
    this.scene.pushMatrix();
        var xz = this.getCoords_XZ(r, c);
        this.scene.translate(xz[0], 0, xz[1]);
        tile.display();
    this.scene.popMatrix();
};

AdaptoidBoard.prototype.getCoords_XZ = function(r, c) {
    return [this.getLeftSpaceOfRow(r) + (c - 1) * 2 * this.radiusOfTile,
            this.radiusOfTile + (r - 1) * this.radiusOfTile * 2];
};

AdaptoidBoard.prototype.getRealCoords_XZ = function(r, c) {
    return [this.getLeftSpaceOfRow(r) + (c - 1) * 2 * this.radiusOfTile - this.widthBoard/2,
            this.radiusOfTile + (r - 1) * this.radiusOfTile * 2 - this.widthBoard/2];
};

AdaptoidBoard.prototype.getNumColumnsInRow = function(row) {
    var numColumns;
    switch(row) {
        case 1:
        case 7:
            numColumns = 4;
            break;
        case 2:
        case 6:
            numColumns = 5;
            break;
        case 3:
        case 5:
            numColumns = 6;
            break;
        case 4:
            numColumns = 7;
            break;
        default:
            console.error("invalid row!!!");
            break;
    }
    return numColumns;
};

AdaptoidBoard.prototype.getLeftSpaceOfRow = function(row) {
    var leftSpace;
    switch(row) {
        case 1:
        case 7:
            leftSpace = 4 * this.radiusOfTile;
            break;
        case 2:
        case 6:
            leftSpace = 3 * this.radiusOfTile;
            break;
        case 3:
        case 5:
            leftSpace = 2 * this.radiusOfTile;
            break;
        case 4:
            leftSpace = this.radiusOfTile;
            break;
        default:
            console.error("invalid row!!!");
            break;
    }

    return leftSpace;
};

AdaptoidBoard.prototype.getBoardInStringFormat = function() {
    var boardString = "[";
    for (var r = 1; r <= 7; r++) {
        var rowString = "[";
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
            var pieceString;
            if (this.tiles[r][c].isEmpty()) {
                pieceString = "empty";
            }
            else {
                pieceString = "[";
                var color = this.tiles[r][c].getColorOfHisPiece();
                color = (color === "white") ? "w" : "b";
                pieceString += color + "," + this.tiles[r][c].getNumLegs().toString()
                            + "," + this.tiles[r][c].getNumPincers().toString()
                            + "]";
            }

            pieceString = (c < this.getNumColumnsInRow(r)) ? pieceString + "," : pieceString;
            rowString += pieceString;
        }
        rowString += "]";
        rowString = (r < 7) ? rowString + "," : rowString;
        boardString += rowString;
    }
    boardString += "]";
    return boardString;
};

AdaptoidBoard.prototype.getBoardInArrayFormat = function() {
    var board = [];
    for (var r = 1; r <= 7; r++) {
        var row = [];
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {
            if (this.tiles[r][c].isEmpty()) {
                row.push(0);
            }
            else {
                var color = this.tiles[r][c].getColorOfHisPiece();
                color = (color === "white") ? 0 : 1;
                row.push([color, this.tiles[r][c].getNumLegs(), this.tiles[r][c].getNumPincers()]);
            }
        }
        board.push(row);
    }
    return board;
};
