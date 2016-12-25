/**
* Score
* @constructor
*/
function Score(scene, game) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.game = game;
    
    this.material = new CGFappearance(this.scene);
    this.material.setDiffuse(0.5, 0.5, 1.0, 1);
    this.material.setSpecular( 0.2, 0.2, 0.5, 1);
    this.material.setShininess(50);

    this.flag = new Flag(scene);
};

Score.prototype.constructor = Score;

Score.prototype.display = function() {

    this.scene.pushMatrix();
    this.material.apply();
    this.scene.translate(-4, 0, 4.5);
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    var indexFlag = 0;
    for (var i = 0; i < 5; i++, indexFlag++) {
        if (i < this.game.whitePlayer.score) {
            this.scene.pushMatrix();
            this.scene.translate(indexFlag*0.7, 0, 0);
            this.flag.display(true);
            this.scene.popMatrix();
        }
        else {
            this.scene.pushMatrix();
            this.scene.translate(indexFlag*0.7, 0, 0);
            this.flag.display(false);
            this.scene.popMatrix();
        }
    }

    this.scene.popMatrix();

   
    this.scene.pushMatrix();
    this.material.apply();
    this.scene.translate(4, 0, -4.5);
    this.scene.rotate(-Math.PI/2, 0, 1, 0);
    var indexFlag = 0;
    for (var i = 0; i < 5; i++, indexFlag++) {
        if (i < this.game.blackPlayer.score) {
            this.scene.pushMatrix();
            this.scene.translate(indexFlag*0.7, 0, 0);
            this.flag.display(true);
            this.scene.popMatrix();
        }
        else {
            this.scene.pushMatrix();
            this.scene.translate(indexFlag*0.7, 0, 0);
            this.flag.display(false);
            this.scene.popMatrix();
        }
    }

    this.scene.popMatrix();


};