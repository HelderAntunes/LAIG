/**
* Piece
* @constructor
*/
function Piece(scene, body, legs, pincers, color, row, col) {
    CGFobject.call(this, scene);

    this.body = [body];
    this.legs = legs;
    this.pincers = pincers;
    this.color = color;
    this.row = row;
    this.col = col;
};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function() {
    if (this.body.length > 0) {
        this.body[0].display();
    }

    var indexRot = 0;
    var rotateAng = Math.PI * 2 /
                    (this.legs.length + this.pincers.length);

    // TODO: two for in one, using one array !!
    for (var i = 0; i < this.legs.length; i++) {
        this.scene.pushMatrix();
            this.scene.rotate(rotateAng*indexRot, 0, 1, 0);
            if (this.body.length >= 1)
                this.scene.translate(0,0,-this.body[0].radiusCilinder);
            this.legs[i].display();
        this.scene.popMatrix();
        indexRot++;
    }
    for (var i = 0; i < this.pincers.length; i++) {
        this.scene.pushMatrix();
            this.scene.rotate(rotateAng*indexRot, 0, 1, 0);
            if (this.body.length >= 1)
                this.scene.translate(0,0,-this.body[0].radiusCilinder);
            this.pincers[i].display();
        this.scene.popMatrix();
        indexRot++;
    }
};


Piece.prototype.numPincers = function() {
    return this.pincers.length;
};
