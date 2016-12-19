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
    this.hotspotSelected = null;

    this.client = new Client();

    this.whitePlayer = new Player("white");
    this.blackPlayer = new Player("black");

    this.stateMachine = new StateMachine(states.PIECE_SELECTION_FROM, turn.WHITE);

};

GameState.prototype.constructor = GameState;

GameState.prototype.createPieces = function() {
    for (var i = 0; i < 24; i++) {
        this.bodies.push(new Body(this.scene, null, null, this.radiusOfTile/4, this.heightOfTile/4));
        this.legs.push(new Leg(this.scene, null, null, this.radiusOfTile/15, this.radiusOfTile/2))
        this.pincers.push(new Pincer(this.scene, null, null, this.radiusOfTile/15, this.radiusOfTile/2));
    }
};

GameState.prototype.initBoards = function() {
    this.mainBoard.addBodyToTile(this.bodies[0], 4, 2, "white");
    this.mainBoard.addBodyToTile(this.bodies[1], 4, 6, "black");
    this.auxBoardWhite.addBodyToTile(this.bodies[2], "white");
    this.auxBoardWhite.addLegToTile(this.legs[0], "white");
    this.auxBoardWhite.addPincerToTile(this.pincers[0], "white");
    this.auxBoardBlack.addBodyToTile(this.bodies[3], "black");
    this.auxBoardBlack.addLegToTile(this.legs[1], "black");
    this.auxBoardBlack.addPincerToTile(this.pincers[1], "black");
};

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
    //this.client.getPrologRequest("handshake");
    if (this.hotspotSelected === null) { // first select
        this.hotspotSelected = hotspot;
        this.stateMachine.changeToNextState();
    }
    else if (this.hotspotSelected === hotspot) { // unselect
        this.hotspotSelected = null;
        this.stateMachine.changeToPreviousState();
    }
    else { // move a piece
        /*var tileFrom = this.hotspotSelected.tile;
        var tileTo = hotspot.tile;
        tileTo.setBody(tileFrom.getBody());
        tileTo.setLegs(tileFrom.getLegs());
        tileTo.setPincers(tileFrom.getPincers());
        tileFrom.setBody([]);
        tileFrom.setLegs([]);
        tileFrom.setPincers([]);
        if (tileFrom.gameBoard.constructor.name == "AuxiliaryBoard") {
            tileFrom.gameBoard.updatePieces();
        }*/


        var tileFrom = this.hotspotSelected.tile;
        var tileTo = hotspot.tile;

        var request = "moveValid(";
        if (this.stateMachine.turn == turn.WHITE) {
            request = request.concat("w,");
        }
        else {
            request = request.concat("b,");
        }
        request = request.concat(tileFrom.row.toString());
        request = request.concat(",");
        request = request.concat(tileFrom.collumn.toString());
        request = request.concat(",");
        request = request.concat(tileTo.row.toString());
        request = request.concat(",");
        request = request.concat(tileTo.collumn.toString());
        request = request.concat(",");
        request = request.concat(this.mainBoard.getBoardInStringFormat());
        request = request.concat(")");
        console.log(request);

        if (this.client.moveIsValid(request)) {

        }
        else {
            console.log(666);
        }
        //this.client.getPrologRequest("handshake");

        this.hotspotSelected = null;

        this.stateMachine.changeToPreviousState();
    }
};
