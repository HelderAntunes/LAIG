/**
* GameState
* @constructor
* @param scene
* @param {String} texture represents the path of image of texture
*/
function GameState(scene) {
    this.scene = scene;
    this.materialTile;
    this.materialWhite;
    this.materialBlack;
    this.setMaterials();

    this.mainBoard = new AdaptoidBoard(scene, this, 0.5, 0.25);
    this.auxBoardBlack = new AuxiliaryBoard(scene, this, 0.5, 0.25, "black");
    this.auxBoardWhite = new AuxiliaryBoard(scene, this, 0.5, 0.25, "white");

    this.hotspots = this.getHotspots();

    this.hotspotSelected = null;
};

GameState.prototype.constructor = GameState;

GameState.prototype.display = function() {
    this.scene.pushMatrix();

    this.mainBoard.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.mainBoard.widthBoard);
    this.auxBoardWhite.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, -this.mainBoard.widthBoard);
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.auxBoardBlack.display();
    this.scene.popMatrix();
    
    this.scene.popMatrix();
};


GameState.prototype.setMaterials = function() {
    this.materialTile = new CGFappearance(this.scene);
    this.materialTile.setDiffuse( 1.0, 1.0, 1.0, 1);
    this.materialTile.setSpecular( 0.5, 0.5, 0.5, 1);
    this.materialTile.setShininess(50);
    this.materialTile.loadTexture("scenes/chessboard.jpg");

    this.materialWhite = new CGFappearance(this.scene);
    this.materialWhite.setDiffuse( 1.0, 1.0, 1.0, 1);
    this.materialWhite.setSpecular( 0.5, 0.5, 0.5, 1);
    this.materialWhite.setShininess(50);

    this.materialBlack = new CGFappearance(this.scene);
    this.materialBlack.setDiffuse( 0, 0, 0, 1);
    this.materialBlack.setSpecular( 0.5, 0.5, 0.5, 1);
    this.materialBlack.setShininess(50);
};

GameState.prototype.getHotspots = function() {
    var hotspots = this.mainBoard.getHotspots();
    hotspots = hotspots.concat(this.auxBoardBlack.getHotspots(), 
                                this.auxBoardWhite.getHotspots());
    return hotspots;
};

GameState.prototype.updatePieceSelected = function(hotspot) {
   
    if (this.hotspotSelected === null) { // first select
        this.hotspotSelected = hotspot;
    }
    else if (this.hotspotSelected === hotspot) { // unselect
        this.hotspotSelected = null;
    }
    else { // move a piece
        var tileFrom = this.hotspotSelected.tile;
        var tileTo = hotspot.tile;
        tileTo.setBody(tileFrom.getBody());
        tileTo.setLegs(tileFrom.getLegs());
        tileTo.setPincers(tileFrom.getPincers());
        tileFrom.setBody([]);
        tileFrom.setLegs([]);
        tileFrom.setPincers([]);
        this.hotspotSelected = null;
    }
};
