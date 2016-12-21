/**
* Body
* @constructor
*/
function Body(scene, game, color, radius, height) {
    CGFobject.call(this, scene);

    this.game = game;
    this.color = color;

    this.radiusCilinder = radius;
    this.heightCilinder = height;
    this.cilinder = new MyCilinder(scene, "cilinder", this.radiusCilinder,
                            this.radiusCilinder, this.heightCilinder, 16, 3);


};

Body.prototype = Object.create(CGFobject.prototype);
Body.prototype.constructor = Body;

Body.prototype.display = function() {
    this.scene.pushMatrix();
        if (this.color == "black") {
            this.game.materialBlack.apply();
        }
        else if (this.color == "white") {
            this.game.materialWhite.apply();
        }
        else {
            console.error("invalid color!!!");
        }
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cilinder.display();
    this.scene.popMatrix();
};
