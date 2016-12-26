/**
 * MyTable
 * @constructor
 */
 function MyTable(scene) {
 	CGFobject.call(this, scene);

 	// table top - wood material
	// rgb color -> 133;94;66 
	this.materialWood = new CGFappearance(scene);
	this.materialWood.setAmbient(0.3,0.3,0.3,1);
	this.materialWood.setDiffuse(0.52,0.37,0.26);
	this.materialWood.setSpecular(0.05,0.05,0.05,1);	
	this.materialWood.setShininess(70);

	// table legs -> iron material
	// rgb color -> 84;84;84
	this.materialIron = new CGFappearance(scene);
	this.materialIron.setAmbient(0.3,0.3,0.3,1);
	this.materialIron.setDiffuse(0.33,0.33,0.33);
	this.materialIron.setSpecular(0.95,0.95,0.95,1);	
	this.materialIron.setShininess(120);
	
	// table top texture
	this.tableAppearance = new CGFappearance(scene);
	this.tableAppearance.loadTexture("scenes/chessboard.jpg");
	this.tableAppearance.setDiffuse( 1.0, 1.0, 1.0, 1);
	this.tableAppearance.setSpecular( 0.1, 0.1, 0.1, 1);
	this.tableAppearance.setShininess(20);

 	this.myUnitCubeQuad = new MyUnitCubeQuad(this.scene);
 	this.myUnitCubeQuad.initBuffers();
 };

 MyTable.prototype = Object.create(CGFobject.prototype);
 MyTable.prototype.constructor = MyTable;

 MyTable.prototype.display = function() {
    this.scene.pushMatrix();

    this.scene.scale(2.5, 0.9, 3.5);

 	// legs
 	this.tableAppearance.apply();
 	
 	this.scene.pushMatrix();
 	this.scene.translate(0.4, 1 / 2, 0.4);
 	this.scene.scale(0.1, 1, 0.1);
 	this.myUnitCubeQuad.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(0.4, 1 / 2, -0.4);
 	this.scene.scale(0.1, 1, 0.1);
 	this.myUnitCubeQuad.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(-0.4, 1 / 2, 0.4);
 	this.scene.scale(0.1, 1, 0.1);
 	this.myUnitCubeQuad.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 	this.scene.translate(-0.4, 1 / 2, -0.4);
 	this.scene.scale(0.1, 1, 0.1);
 	this.myUnitCubeQuad.display();
 	this.scene.popMatrix();

 	// table top
 	this.tableAppearance.apply();
 	this.scene.pushMatrix();
 	this.scene.translate(0, 1, 0);
 	this.scene.scale(1, 0.1, 1);
 	this.myUnitCubeQuad.display();
 	this.scene.popMatrix();

 	this.scene.popMatrix();
 }
