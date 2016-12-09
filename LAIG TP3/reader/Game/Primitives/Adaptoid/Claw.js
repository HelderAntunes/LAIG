/**
* Claw
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
*/
function Claw(scene,tile, color, radius, height) {
    CGFobject.call(this, scene);

    this.tile = tile;
    this.color = color;

    this.radiusCilinder = radius;
    this.heightCilinder = height;
    this.cilinder = new MyCilinder(scene, "cilinder", this.radiusCilinder,this.radiusCilinder, this.heightCilinder, 16, 3);
    this.cilinder2 = new MyCilinder(scene,"cilinder2",this.radiusCilinder,0,this.heightCilinder,16,3);
    this.cilinder3 = new MyCilinder(scene,"cilinder3",this.radiusCilinder,0,this.heightCilinder,16,3);


};

Claw.prototype = Object.create(CGFobject.prototype);
Claw.prototype.constructor = Claw;

Claw.prototype.display = function() {
/*
        if (this.color == "black") {
            this.tile.gameBoard.game.materialBlack.apply();
        }
        else if (this.color == "white") {
            this.tile.gameBoard.game.materialWhite.apply();
        }
        else {
            console.error("invalid color!!!");

        }*/
this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.cilinder.display();
this.scene.popMatrix();

this.scene.pushMatrix();
        this.scene.translate(0, 0, this.radiusCilinder);
        this.scene.rotate((-Math.PI/2-Math.PI/3),0,1,0);
        this.cilinder2.display();
 this.scene.popMatrix();

 this.scene.pushMatrix();
        this.scene.translate(0, 0, this.radiusCilinder);
        this.scene.rotate((Math.PI/2+Math.PI/3),0,1,0);
        this.cilinder3.display();
this.scene.popMatrix();



};


