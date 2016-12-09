/**
* Tile
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
*/
function Tile(scene, gameBoard, row, collumn, radius, height, adapdoidBody, adaptoidLegs, adaptoidPincers) {
    CGFobject.call(this, scene);

    this.gameBoard = gameBoard;
    this.row = row;
    this.collumn = collumn;

    this.radiusCilinder = radius;
    this.heightCilinder = height;
    this.cilinder = new MyCilinder(scene, "cilinder", this.radiusCilinder, 
                            this.radiusCilinder, this.heightCilinder, 6, 3);

    this.adapdoidBody = adapdoidBody;
    this.adaptoidLegs = adaptoidLegs;
    this.adaptoidPincers = adaptoidPincers;

};

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.display = function() {

    this.scene.pushMatrix();
        this.gameBoard.game.materialTile.apply();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cilinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();

    if (this.adapdoidBody != null) {
        this.adapdoidBody.display();
    }
    
    if (this.adaptoidLegs != null) {
        for (var i = 0; i < this.adaptoidLegs; i++) {
            this.adaptoidLegs[i].display();
        }
    }

    if (this.adaptoidPincers != null) {
        for (var i = 0; i < this.adaptoidPincers.length; i++) {
            this.adaptoidPincers[i].display();
        }
    }

    this.scene.popMatrix();
};

Tile.prototype.addBody = function(body) {
    if (this.adapdoidBody == null) {
        this.adapdoidBody = body;
    }
    else {
        console.error("The tile is already occupied with body.");
    }
};


