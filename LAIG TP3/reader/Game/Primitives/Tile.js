/**
* Tile
* @constructor
*/
function Tile(scene, gameBoard, row, collumn, radius, height, adaptoidBody, adaptoidLegs, adaptoidPincers) {
    this.scene = scene;

    this.gameBoard = gameBoard;
    this.row = row;
    this.collumn = collumn;

    this.radiusCilinder = radius;
    this.heightCilinder = height;
    this.cilinder = new MyCilinder(scene, "cilinder", this.radiusCilinder,
                            this.radiusCilinder, this.heightCilinder, 6, 3);

    this.adaptoidBody = [];
    this.adaptoidLegs = [];
    this.adaptoidPincers = [];

    this.hotspot = new Hotspot(scene, this, 0.9 * this.radiusCilinder);

};

Tile.prototype.constructor = Tile;

Tile.prototype.display = function() {

    if (this.scene.pickMode) {
        this.scene.registerForPick(this.scene.indexRegPick, this.hotspot);
        this.scene.indexRegPick++;
        this.hotspot.display();
    } else {

        this.scene.pushMatrix();
        this.gameBoard.game.materialTile.apply();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cilinder.display();
        this.scene.popMatrix();

        if (this.adaptoidBody.length > 0) {
            this.scene.pushMatrix();
            this.scene.translate(0, this.heightCilinder, 0);
            this.adaptoidBody[0].display();
            this.scene.popMatrix();
        }

        var indexRot = 0;
        var rotateAng = Math.PI * 2 /
                        (this.adaptoidLegs.length + this.adaptoidPincers.length);

        for (var i = 0; i < this.adaptoidLegs.length; i++) {
            this.scene.pushMatrix();
                this.scene.rotate(rotateAng*indexRot, 0, 1, 0);
                if (this.adaptoidBody.length >= 1)
                    this.scene.translate(0,0,-this.adaptoidBody[0].radiusCilinder);
                this.scene.translate(0, this.heightCilinder, 0);
                this.adaptoidLegs[i].display();
            this.scene.popMatrix();
            indexRot++;
        }
        for (var i = 0; i < this.adaptoidPincers.length; i++) {
            this.scene.pushMatrix();
                this.scene.rotate(rotateAng*indexRot, 0, 1, 0);
                if (this.adaptoidBody.length >= 1)
                    this.scene.translate(0,0,-this.adaptoidBody[0].radiusCilinder);
                this.scene.translate(0, this.heightCilinder, 0);
                this.adaptoidPincers[i].display();
            this.scene.popMatrix();
            indexRot++;
        }
    }
};

Tile.prototype.addBody = function(body) {
    if (this.adaptoidBody == null) {
        console.error("adaptoidBody is null!!!");
    }
    else if (this.adaptoidBody.length === 0) {
        this.adaptoidBody.push(body);
    }
    else {
        console.error("The tile is already occupied with body.");
    }
};

Tile.prototype.addLeg = function(leg) {
    if (this.adaptoidLegs == null) {
        console.error("adaptoidLegs is null!!!");
    }
    else if (this.adaptoidLegs.length + this.adaptoidPincers.length < 6) {
        this.adaptoidLegs.push(leg);
    }
    else {
        console.error("The tile is already totally occupied.");
    }
};

Tile.prototype.addPincer = function(pincer) {
    if (this.adaptoidPincers == null) {
        console.error("adaptoidPincers is null!!!");
    }
    else if (this.adaptoidLegs.length + this.adaptoidPincers.length < 6) {
        this.adaptoidPincers.push(pincer);
    }
    else {
        console.error("The tile is already totally occupied.");
    }
};

Tile.prototype.setBody = function(adaptoidBody) {
    this.adaptoidBody = adaptoidBody;
};

Tile.prototype.setLegs = function(adaptoidLegs) {
    this.adaptoidLegs = adaptoidLegs;
};

Tile.prototype.setPincers = function(adaptoidPincers) {
    this.adaptoidPincers = adaptoidPincers;
};

Tile.prototype.getBody = function() {
    return this.adaptoidBody;
};

Tile.prototype.getLegs = function() {
    return this.adaptoidLegs;
};

Tile.prototype.getPincers = function() {
    return this.adaptoidPincers;
};

Tile.prototype.isEmpty = function() {
    if (this.adaptoidBody.length === 0 &&
        this.adaptoidPincers.length === 0 &&
        this.adaptoidLegs.length === 0) {
        return true;
    }
    else {
        return false;
    }
};

Tile.prototype.getColorOfHisPiece = function() {
    if (this.isEmpty()) {
        constructor.error("The tile is empty!");
        return;
    }

    for (var i = 0; i < this.adaptoidBody.length; i++) {
        return this.adaptoidBody[i].color;
    }

    for (var i = 0; i < this.adaptoidPincers.length; i++) {
        return this.adaptoidPincers[i].color;
    }

    for (var i = 0; i < this.adaptoidLegs.length; i++) {
        return this.adaptoidLegs[i].color;
    }

};

Tile.prototype.getNumLegs = function() {
    return this.adaptoidLegs.length;
};

Tile.prototype.getNumPincers = function() {
    return this.adaptoidPincers.length;
};
