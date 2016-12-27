/**
 * MySofa
 * @constructor
 */
 function MySofa(scene, id) {
 	CGFobject.call(this, scene);

 	this.id = id;
	
	this.material = new CGFappearance(scene);
	this.material.loadTexture("scenes/sofa.jpg");
	this.material.setDiffuse( 1.0, 1.0, 1.0, 1);
	this.material.setSpecular( 0.1, 0.1, 0.1, 1);
	this.material.setShininess(20);

 	this.myUnitCubeQuad = new MyUnitCubeQuad(this.scene);
 	this.myUnitCubeQuad.initBuffers();
 };

 MySofa.prototype = Object.create(CGFobject.prototype);
 MySofa.prototype.constructor = MySofa;

 MySofa.prototype.display = function() {
    this.scene.pushMatrix();

    this.material.apply();

 	this.scene.pushMatrix();
 	this.scene.translate(0, 0.875, -0.5);
 	this.scene.scale(2, 0.75, 0.5);
 	this.myUnitCubeQuad.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(0, 0.5/2, 0);
 	this.scene.scale(2, 0.5, 1.5);
 	this.myUnitCubeQuad.display();
 	this.scene.popMatrix();

 	this.scene.popMatrix();
 }
