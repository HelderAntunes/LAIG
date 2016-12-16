/**
* AuxiliaryBoard
* @constructor
*/
function AuxiliaryBoard(scene, game, radiusOfTile, heightOfTile, color) {
    this.scene = scene;
    this.game = game;

    this.widthEachBoard_x = 6 * radiusOfTile * 2; 
    this.widthEachBoard_z = 5 * radiusOfTile * 2;

    this.bodiesTile = new Tile(this.scene, this, null, null, 
                                radiusOfTile, heightOfTile, [], [], []);;
    this.pincersTile = new Tile(this.scene, this, null, null, 
                                radiusOfTile, heightOfTile, [], [], []);;
    this.legsTile = new Tile(this.scene, this, null, null, 
                            radiusOfTile, heightOfTile, [], [], []);

    this.color = color;

    this.bodies = [];
    this.legs = [];
    this.pincers = [];
    for (var i = 0; i < 12; i++) {
        this.legs.push(new Leg(this.scene, this.legsTile, this.color, radiusOfTile/15, radiusOfTile/2));
        this.pincers.push(new Pincer(this.scene, this.pincersTile, this.color, radiusOfTile/15, radiusOfTile/2));
        if (i < 11)
            this.bodies.push(new Body(this.scene, this.bodiesTile, this.color, radiusOfTile/4, heightOfTile/4));
    }

    this.bodiesTile.addBody(this.bodies[this.bodies.length-1]);
    this.pincersTile.addPincer(this.pincers[this.pincers.length-1]);
    this.legsTile.addLeg(this.legs[this.legs.length-1]);

};

AuxiliaryBoard.prototype.constructor = AuxiliaryBoard;

AuxiliaryBoard.prototype.getHotspots = function() {
    var hotspots = [];
    hotspots.push(this.bodiesTile.hotspot);
    hotspots.push(this.pincersTile.hotspot);
    hotspots.push(this.legsTile.hotspot);
    return hotspots;
};


AuxiliaryBoard.prototype.display = function() {
    this.displayTile(this.bodiesTile, "bodyTile");
    this.displayTile(this.pincersTile, "pincerTile");
    this.displayTile(this.legsTile, "legTile");
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

AuxiliaryBoard.prototype.updatePieces = function() {
   
    if (this.bodiesTile.isEmpty()) {
        this.bodies.pop();
        if (this.bodies.length > 0)
            this.bodiesTile.addBody(this.bodies[this.bodies.length-1]);
    }

    if (this.legsTile.isEmpty()) {
        this.legs.pop();
        if (this.legs.length > 0)
            this.legsTile.addLeg(this.legs[this.legs.length-1]);
    }

    if (this.pincersTile.isEmpty()) {
        this.pincers.pop();
        if (this.pincers.length > 0)
            this.pincersTile.addPincer(this.pincers[this.pincers.length-1]);
    }

};

