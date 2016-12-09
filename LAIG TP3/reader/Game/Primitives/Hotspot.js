/**
* Hotspot
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
*/
function Hotspot(scene, tile, radius) {
    CGFobject.call(this, scene);

    this.tile = tile;
    this.radius = radius;
    this.height = 0.01;

    this.cilinder = new MyCilinder(scene, "cilinder", radius, 
                            radius, this.height, 6, 1);
};

Hotspot.prototype = Object.create(CGFobject.prototype);
Hotspot.prototype.constructor = Hotspot;

Hotspot.prototype.display = function() {
    this.scene.pushMatrix();
        this.tile.gameBoard.game.materialWhite.apply();
        this.scene.translate(0, this.tile.heightCilinder, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cilinder.display();
    this.scene.popMatrix();
};


