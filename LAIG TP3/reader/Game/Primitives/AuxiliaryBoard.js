/**
* AuxiliaryBoard
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
*/
function AuxiliaryBoard(scene, game, radiusOfTile, heightOfTile) {
    CGFobject.call(this, scene);

    this.game = game;

    this.radiusOfTile = radiusOfTile;
    this.heightOfTile = heightOfTile;
    this.widthEachBoard_x = 6 * this.radiusOfTile * 2; 
    this.widthEachBoard_z = 5 * this.radiusOfTile * 2;

    this.bodysTiles = [];
    this.pincersTiles = [];
    this.legsTiles = [];
    this.initTiles();

};

AuxiliaryBoard.prototype = Object.create(CGFobject.prototype);
AuxiliaryBoard.prototype.constructor = AuxiliaryBoard;

AuxiliaryBoard.prototype.initTiles = function() {

    for (var r = 1; r <= 5; r++) {
        
        this.bodysTiles[r] = [];
        this.pincersTiles[r] = [];
        this.legsTiles[r] = [];

        for (var c = 1; c <=  this.getNumColumnsInRow(r); c++) {
            this.bodysTiles[r][c] = new Tile(this.scene, this, r, c, 
                                            this.radiusOfTile, this.heightOfTile);
            this.pincersTiles[r][c] = new Tile(this.scene, this, r, c, 
                                            this.radiusOfTile, this.heightOfTile);
            this.legsTiles[r][c] = new Tile(this.scene, this, r, c, 
                                            this.radiusOfTile, this.heightOfTile);
        }

    }

};

AuxiliaryBoard.prototype.display = function() {
         
    for (var r = 1; r <= 5; r++) {
        for (var c = 1; c <= this.getNumColumnsInRow(r); c++) {

            this.displayTile(this.bodysTiles[r][c], "bodyTile", r, c);
            this.displayTile(this.pincersTiles[r][c], "pincerTile", r, c);
            this.displayTile(this.legsTiles[r][c], "legTile", r, c);

        }
    }

};

AuxiliaryBoard.prototype.displayTile = function(tile, typeTile, r, c) {
    this.scene.pushMatrix();

    if (typeTile == "bodyTile") {
        // stay on center
    }
    else if (typeTile == "pincerTile") {
        this.scene.translate(-this.widthEachBoard_x, 0, 0);
    }
    else if (typeTile == "legTile") {
        this.scene.translate(this.widthEachBoard_x, 0, 0);
    }

    this.scene.translate(-this.widthEachBoard_x/2, 0, -this.widthEachBoard_z/2);
    this.scene.translate(this.getLeftSpaceOfRow(r) + (c-1) * 2 * this.radiusOfTile,
                        this.heightOfTile / 2,
                        this.radiusOfTile + (r - 1)*this.radiusOfTile*2);
    tile.display();

    this.scene.popMatrix();
};


AuxiliaryBoard.prototype.getNumColumnsInRow = function(row) {
    var numColumns;
    switch(row) {
        case 1:
        case 5:
            numColumns = 4; 
            break;
        case 2:
        case 4:
            numColumns = 5;
            break;
        case 3:
            numColumns = 6;
            break;  
        default:
            console.error("invalid row!!!");
            break;
    }
    return numColumns;
};

AuxiliaryBoard.prototype.getLeftSpaceOfRow = function(row) {
    var leftSpace;
    switch(row) {
        case 1:
        case 5:
            leftSpace = 3 * this.radiusOfTile; 
            break;
        case 2:
        case 4:
            leftSpace = 2 * this.radiusOfTile;
            break;
        case 3:
            leftSpace = this.radiusOfTile;
            break;  
        default:
            console.error("invalid row!!!");
            break;
    }
    return leftSpace;
};