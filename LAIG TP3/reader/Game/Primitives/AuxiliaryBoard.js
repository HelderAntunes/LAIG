/**
* AuxiliaryBoard
* @constructor
*/
function AuxiliaryBoard(scene, game, radiusOfTile, heightOfTile) {
    this.scene = scene;
    this.game = game;

    this.widthEachBoard_x = 6 * radiusOfTile * 2;
    this.widthEachBoard_z = 5 * radiusOfTile * 2;

    this.bodyTile = new Tile(this.scene, this, null, null,
                                radiusOfTile, heightOfTile, [], [], []);;
    this.pincerTile = new Tile(this.scene, this, null, null,
                                radiusOfTile, heightOfTile, [], [], []);;
    this.legTile = new Tile(this.scene, this, null, null,
                                radiusOfTile, heightOfTile, [], [], []);
};

AuxiliaryBoard.prototype.constructor = AuxiliaryBoard;

AuxiliaryBoard.prototype.getHotspots = function() {
    var hotspots = [];
    hotspots.push(this.bodyTile.hotspot);
    hotspots.push(this.pincerTile.hotspot);
    hotspots.push(this.legTile.hotspot);
    return hotspots;
};


AuxiliaryBoard.prototype.display = function() {
    this.displayTile(this.bodyTile, "bodyTile");
    this.displayTile(this.pincerTile, "pincerTile");
    this.displayTile(this.legTile, "legTile");
};

AuxiliaryBoard.prototype.displayTile = function(tile, typeTile) {
    this.scene.pushMatrix();

    if (typeTile == "bodyTile") {
        // stay on center
    }
    else if (typeTile == "pincerTile") {
        this.scene.translate(-this.widthEachBoard_x/4, 0, 0);
    }
    else if (typeTile == "legTile") {
        this.scene.translate(this.widthEachBoard_x/4, 0, 0);
    }

    this.scene.translate(0, 0, -this.widthEachBoard_z/2);
    tile.display();

    this.scene.popMatrix();
};

AuxiliaryBoard.prototype.setBody = function(body, color) {
    var tile = this.bodyTile;
    tile.setBody([body]);
    body.game = this.game;
    body.color = color;
};

AuxiliaryBoard.prototype.setLeg = function(leg, color) {
    var tile = this.legTile;
    tile.setLegs([leg]);
    leg.game = this.game;
    leg.color = color;
};

AuxiliaryBoard.prototype.setPincer = function(pincer, color) {
    var tile = this.pincerTile;
    tile.setPincers([pincer]);
    pincer.game = this.game;
    pincer.color = color;
};

AuxiliaryBoard.prototype.takeAllPieces = function() {
    this.bodyTile.adaptoidBody = [];
    this.legTile.adaptoidLegs = [];
    this.pincerTile.adaptoidPincers = [];
};
