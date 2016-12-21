/**
* Leg
* @constructor
*/
function Leg(scene, game, color, radius, height) {
    CGFobject.call(this, scene);

    this.game = game;
    this.color = color;

    this.radiusCilinder = radius;
    this.heightCilinder = height;
    this.cilinder = new MyCilinder(scene, "cilinder", this.radiusCilinder,
                            this.radiusCilinder, this.heightCilinder, 16, 3);
    this.cilinder2 = new MyCilinder(scene,"cilinder2",this.radiusCilinder,
                            this.radiusCilinder,this.heightCilinder/2,16,3);


};

Leg.prototype = Object.create(CGFobject.prototype);
Leg.prototype.constructor = Leg;

Leg.prototype.display = function() {

    if (this.color === "black") {
        this.game.materialBlack.apply();
    }
    else if (this.color === "white") {
        this.game.materialWhite.apply();
    }
    else {
        console.error("invalid color!!!");
    }

    this.scene.pushMatrix();
        this.scene.translate(0,
                            this.radiusCilinder,
                            -this.heightCilinder);
        this.cilinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,
                            this.radiusCilinder,
                            this.radiusCilinder-this.heightCilinder);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.cilinder2.display();
     this.scene.popMatrix();

};
