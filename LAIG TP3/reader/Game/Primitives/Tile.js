/**
* Tile
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
*/
function Tile(scene, gameBoard, row, collumn, radius, height, adapdoidBody, adaptoidLegs, adaptoidPincers) {
    this.scene = scene;

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

        if (this.adapdoidBody.length > 0) {
            this.adapdoidBody[0].display();
        }
        
        var indexRot = 0;
        var rotateAng = Math.PI * 2 / 
                        (this.adaptoidLegs.length + this.adaptoidPincers.length);
        
        for (i = 0; i < this.adaptoidLegs.length; i++) {
            this.scene.pushMatrix();
                this.scene.rotate(rotateAng*indexRot, 0, 1, 0);
                this.scene.translate(0,0,-this.adapdoidBody[0].radiusCilinder);    
                this.adaptoidLegs[i].display();
            this.scene.popMatrix();
            indexRot++;
        }
        for (i = 0; i < this.adaptoidPincers.length; i++) {
            this.scene.pushMatrix();
                this.scene.rotate(rotateAng*indexRot, 0, 1, 0);
                this.scene.translate(0,0,-this.adapdoidBody[0].radiusCilinder);
            this.adaptoidPincers[i].display();
            this.scene.popMatrix();
            indexRot++;
        }
    }
};

Tile.prototype.addBody = function(body) {
    if (this.adapdoidBody == null) {
        console.error("adaptoidBody is null!!!");
    }
    else if (this.adapdoidBody.length === 0) {
        this.adapdoidBody.push(body);
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




