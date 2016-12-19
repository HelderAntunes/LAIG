/**
* AdaptoidBoard
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
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

AdaptoidBoard.prototype.setBodyInTile = function(body, row, collumn, color) {
    var tile = this.tiles[row][collumn];
    tile.setBody([body]);
    body.tile = tile;
    body.color = color;
};

AdaptoidBoard.prototype.setLegsInTile = function(legs, row, collumn, color) {
    var tile = this.tiles[row][collumn];
    tile.setLegs(legs);
    for (var i = 0; i < legs.length; i++) {
        legs[i].tile = tile;
        legs[i].color = color;
    }
};

AdaptoidBoard.prototype.setPincersInTile = function(pincers, row, collumn, color) {
    var tile = this.tiles[row][collumn];
    tile.setPincers(pincers);
    for (var i = 0; i < pincers.length; i++) {
        pincers[i].tile = tile;
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

AdaptoidBoard.prototype.displayTile = function(tile, r, c) {
    this.scene.pushMatrix();
        this.scene.translate(this.getLeftSpaceOfRow(r) + (c-1) * 2 * this.radiusOfTile,
                            0,
                            this.radiusOfTile + (r - 1)*this.radiusOfTile*2);
        tile.display();
    this.scene.popMatrix();
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
                if (color == "white") {
                    pieceString = pieceString.concat("w");
                }
                else if (color == "black") {
                    pieceString = pieceString.concat("b");
                }
                else {
                    console.error("Invalid color -> " + color);
                }

                pieceString = pieceString.concat(",");
                pieceString = pieceString.concat(this.tiles[r][c].getNumLegs().toString());
                pieceString = pieceString.concat(",");
                pieceString = pieceString.concat(this.tiles[r][c].getNumPincers().toString());
                pieceString = pieceString.concat("]");
            }

            if (c < this.getNumColumnsInRow(r)) {
                pieceString = pieceString.concat(",");
            }

            rowString = rowString.concat(pieceString);
        }
        rowString = rowString.concat("]");
        if (r < 7) {
            rowString = rowString.concat(",");
        }
        boardString = boardString.concat(rowString);
    }
    boardString = boardString.concat(']');
    return boardString;
};
