/**
* Body
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
*/
function Body(scene, tile, color, radius, height) {
    CGFobject.call(this, scene);

    this.tile = tile;
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
            this.tile.gameBoard.game.materialBlack.apply();
        }
        else if (this.color == "white") {
            this.tile.gameBoard.game.materialWhite.apply();
        }
        else {
            console.error("invalid color!!!");
        }
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cilinder.display();
    this.scene.popMatrix();
};
