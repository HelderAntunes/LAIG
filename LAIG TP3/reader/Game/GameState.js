/**
* GameState
* @constructor
*/
function GameState(scene) {

    this.scene = scene;

    this.materialTile;
    this.materialWhite;
    this.materialBlack;
    this.setMaterials();

    this.radiusOfTile = 0.5;
    this.heightOfTile = 0.25;

    this.bodies = [];
    this.legs = [];
    this.pincers = [];
    this.createPieces();

    this.mainBoard = new AdaptoidBoard(scene, this, this.radiusOfTile, this.heightOfTile);
    this.auxBoardBlack = new AuxiliaryBoard(scene, this, this.radiusOfTile, this.heightOfTile);
    this.auxBoardWhite = new AuxiliaryBoard(scene, this, this.radiusOfTile, this.heightOfTile);
    this.initBoards();

    this.hotspots = this.getHotspots();
    this.hotspotFrom = null;
    this.hotspotTo = null;

    this.client = new Client(this);

    this.whitePlayer = new Player("w");
    this.blackPlayer = new Player("b");

    this.stateMachine = new StateMachine(states.PIECE_SELECTION_FROM, turn.WHITE);

    this.moveAnimator = new MoveAnimator(this);

};

GameState.prototype.constructor = GameState;

GameState.prototype.createPieces = function() {
    for (var i = 0; i < 24; i++) {
        this.bodies.push(new Body(this.scene, this, null, this.radiusOfTile/4, this.heightOfTile/4));
        this.legs.push(new Leg(this.scene, this, null, this.radiusOfTile/15, this.radiusOfTile/2))
        this.pincers.push(new Pincer(this.scene, this, null, this.radiusOfTile/15, this.radiusOfTile/2));
    }
};

GameState.prototype.initBoards = function() {
    this.mainBoard.setBodyInTile(this.bodies[0], 4, 2, "white");
    this.mainBoard.setBodyInTile(this.bodies[1], 4, 6, "black");
    this.mainBoard.setBodyInTile(this.bodies[2], 1, 2, "black");
    this.mainBoard.setBodyInTile(this.bodies[3], 4, 3, "black");
    this.mainBoard.setLegsInTile([this.legs[2]], 4, 2, "white");
    this.mainBoard.setPincersInTile([this.pincers[2]], 4, 2, "white");
    this.mainBoard.setLegsInTile([this.legs[3]], 4, 6, "black");
    this.mainBoard.setPincersInTile([this.pincers[3]], 1, 2, "black");
    this.auxBoardWhite.setBody(this.bodies[4], "white");
    this.auxBoardWhite.setLeg(this.legs[0], "white");
    this.auxBoardWhite.setPincer(this.pincers[0], "white");
    this.auxBoardBlack.setBody(this.bodies[5], "black");
    this.auxBoardBlack.setLeg(this.legs[1], "black");
    this.auxBoardBlack.setPincer(this.pincers[1], "black");
};

GameState.prototype.display = function() {

    if (this.moveAnimator.waitingForMoveReply)
        this.client.executeMove(); // TODO: Substitute this function to call server once
    else {

    }
    if (this.stateMachine.currState == states.ANIMATION_MOVE) {
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

        // display pieces in moviment
        this.moveAnimator.display();
    }
    else {
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
    }

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
    this.materialBlack.setDiffuse( 0.25, 0.5, 0.25, 1);
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

    if (this.hotspotFrom === null) { // first select
        this.hotspotFrom = hotspot;
        this.stateMachine.setState(states.PIECE_SELECTION_TO);
    }
    else if (this.hotspotFrom === hotspot) { // unselect
        this.hotspotFrom = null;
        this.stateMachine.setState(states.PIECE_SELECTION_FROM);
    }
    else { // move a piece
        this.hotspotTo = hotspot;
        this.client.checkIfMoveIsValid();
    }
};
