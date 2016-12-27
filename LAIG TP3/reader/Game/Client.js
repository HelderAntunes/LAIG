/**
* Client
*
*/
function Client(game) {
    this.game = game;
};

Client.prototype.constructor = Client;

Client.prototype.getPrologRequest = function(requestString, onSuccess, onError, port) {
	var requestPort = port || 8081;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};

Client.prototype.requestMove = function() {
	var game = this.game;

    this.game.undo.previousBoard = this.game.mainBoard.getBoardInArrayFormat();
    var whitePlayer = this.game.whitePlayer;
    var blackPlayer = this.game.blackPlayer;
    this.game.undo.previousWhitePlayer = [whitePlayer.score, whitePlayer.numBodies, whitePlayer.numLegs, whitePlayer.numPincers];
    this.game.undo.previousBlackPlayer = [blackPlayer.score, blackPlayer.numBodies, blackPlayer.numLegs, blackPlayer.numPincers];
    this.game.undo.previousState = states.PIECE_SELECTION_FROM;
    this.game.undo.previousTurn = this.game.stateMachine.turn;

	var tileFrom = game.hotspotFrom.tile;
    var tileTo = game.hotspotTo.tile;
    game.moveAnimator.moveToExecute = new GameMove(tileFrom, tileTo, "move", "user");
    game.moves.push(game.moveAnimator.moveToExecute);

    var request = this.makeRequestString_moveAndCapture();
    this.getPrologRequest(
        request,
        function(data) {
        	if (data.target.responseText === "invalidMove") {
        		game.stateMachine.currState = states.PIECE_SELECTION_FROM;
                game.hotspotFrom.tile.selected = false;
                game.hotspotTo.tile.selected = false;
        	}
        	else {
        		var responseInArray = JSON.parse(data.target.responseText);
	            game.moveAnimator.board = responseInArray[0];
	            game.moveAnimator.currPlayer = responseInArray[1];
	            game.moveAnimator.enemyPlayer = responseInArray[2];
	            game.moveAnimator.inited = false;
	            game.stateMachine.setState(states.ANIMATION_MOVE);
        	}
        	game.hotspotFrom = null;
            game.hotspotTo = null;
        });
};

Client.prototype.makeRequestString_moveAndCapture = function() {

    var tileFrom = this.game.moveAnimator.moveToExecute.tileFrom;
    var tileTo = this.game.moveAnimator.moveToExecute.tileTo;

    var request = "moveAndCapture(";
    var playerTo, playerFrom;
    if (this.game.stateMachine.turn == turn.WHITE) {
        request += "w,";
        playerFrom = this.game.whitePlayer.getPlayerInStringFormat();
        playerTo = this.game.blackPlayer.getPlayerInStringFormat();
    }
    else {
        request += "b,";
        playerFrom = this.game.blackPlayer.getPlayerInStringFormat();
        playerTo = this.game.whitePlayer.getPlayerInStringFormat();
    }
    request += tileFrom.row + "," + tileFrom.collumn + ","
            + tileTo.row + "," + tileTo.collumn + ","
            + this.game.mainBoard.getBoardInStringFormat()
            + ",";
    request += playerFrom + "," + playerTo + ")";

    return request;
};

Client.prototype.requestUpdate = function() {

    this.game.undo.previousBoard = this.game.mainBoard.getBoardInArrayFormat();
    var whitePlayer = this.game.whitePlayer;
    var blackPlayer = this.game.blackPlayer;
    this.game.undo.previousWhitePlayer = [whitePlayer.score, whitePlayer.numBodies, whitePlayer.numLegs, whitePlayer.numPincers];
    this.game.undo.previousBlackPlayer = [blackPlayer.score, blackPlayer.numBodies, blackPlayer.numLegs, blackPlayer.numPincers];
    this.game.undo.previousState = states.UPDATE_PIECE_FROM;
    this.game.undo.previousTurn = this.game.stateMachine.turn;
    
    var game = this.game;
    
    var tileFrom = game.hotspotFrom.tile;
    var tileTo = game.hotspotTo.tile;
    

    var predicate, typeOfMove;
    if (tileFrom.adaptoidBody.length === 1) {
        predicate = "createAdaptoid";
        typeOfMove = "update_createAdaptoid";
    } else if (tileFrom.adaptoidLegs.length === 1) {
        predicate = "addLeg";
        typeOfMove = "update_addLeg";
    } else if (tileFrom.adaptoidPincers.length === 1) {
        predicate = "addPincer";
        typeOfMove = "update_addPincer";
    }

    game.updateAnimator.moveToExecute = new GameMove(tileFrom, tileTo, typeOfMove, "user");
    game.moves.push(game.updateAnimator.moveToExecute);

    var request = this.makeRequestString_update(predicate);


    this.getPrologRequest(
        request,
        function(data) {
            
            if (data.target.responseText === "invalidMove") {
                game.stateMachine.currState = states.UPDATE_PIECE_FROM;
                game.hotspotFrom.tile.selected = false;
                game.hotspotTo.tile.selected = false;
            }
            else {
                var responseInArray = JSON.parse(data.target.responseText);
                game.updateAnimator.board = responseInArray[0];
                game.updateAnimator.currPlayer = responseInArray[1];
                game.updateAnimator.inited = false;
                game.stateMachine.setState(states.ANIMATION_UPDATE);
            }
            game.hotspotFrom = null;
            game.hotspotTo = null;
        });
};

Client.prototype.makeRequestString_update = function(predicate) {

    var tileTo = this.game.hotspotTo.tile;

    var request = predicate + "(";
    var playerIn;
    if (this.game.stateMachine.turn == turn.WHITE) {
        request += "w," + this.game.whitePlayer.getPlayerInStringFormat() + ",";
    }
    else {
        request += "b," + this.game.blackPlayer.getPlayerInStringFormat() + ",";
    }
    request += tileTo.row + "," + tileTo.collumn + "," + this.game.mainBoard.getBoardInStringFormat() + ")";

    return request;
};

Client.prototype.botRequestUpdate = function() {
    
    var game = this.game;
    var request = this.makeRequestString_botResquestUpdate();

    this.getPrologRequest(
        request,
        function(data) {
            var responseInArray = JSON.parse(data.target.responseText);
            game.updateAnimator.board = responseInArray[0];
            game.updateAnimator.currPlayer = responseInArray[1];
            game.updateAnimator.inited = false;
            
            var typeOfMove = responseInArray[2];
            if (typeOfMove === 0) {
                typeOfMove = "update_createAdaptoid";
            } else if (typeOfMove === 1) {
                typeOfMove = "update_addLeg";
            } else if (typeOfMove === 2) {
                typeOfMove = "update_addPincer";
            }
            var row = responseInArray[3];
            var col = responseInArray[4];
            var tileTo = game.mainBoard.tiles[row][col];
            game.updateAnimator.moveToExecute = new GameMove(null, tileTo, typeOfMove, "bot");
            game.stateMachine.setState(states.ANIMATION_UPDATE);
            game.botRequestUpdate = false;
            game.hotspotFrom = null;
            game.hotspotTo = null;
        });
};

Client.prototype.makeRequestString_botResquestUpdate = function(predicate) {

    var request = "botCreateOrUpdate(";
    var color, playerIn, enemy;
    if (this.game.stateMachine.turn == turn.WHITE) {
        playerIn = this.game.whitePlayer.getPlayerInStringFormat();
        color = "w";
        enemy = this.game.blackPlayer.getPlayerInStringFormat();
    }
    else {
        playerIn = this.game.blackPlayer.getPlayerInStringFormat();
        color = "b";
        enemy = this.game.whitePlayer.getPlayerInStringFormat();
    }
    request += color + "," + this.game.mainBoard.getBoardInStringFormat() 
            + "," + playerIn + "," + enemy + ")";

    return request;

};

Client.prototype.requestCapture = function() {
    var game = this.game;
    game.captureAnimator.requestSent = true;

    var typeOfMove = (game.stateMachine.turn == states.WHITE) ? "capture_turnWhite":"capture_turnBlack"; 
    game.captureAnimator.moveToExecute = new GameMove(null, null, typeOfMove, "capture");
    game.moves.push(game.captureAnimator.moveToExecute);

    var request = this.makeRequestString_capture();

    this.getPrologRequest(
        request,
        function(data) {
            var responseInArray = JSON.parse(data.target.responseText);
            game.captureAnimator.board = responseInArray[0];
            game.captureAnimator.currPlayer = responseInArray[1];
            game.captureAnimator.inited = false;
            game.captureAnimator.requestReply = true;
        });
};

Client.prototype.makeRequestString_capture = function() {

    var request = "captureAdaptoids(";
    var playerIn, color;
    if (this.game.stateMachine.turn == turn.WHITE) {
        color = "b";
        playerIn = this.game.whitePlayer.getPlayerInStringFormat();
    }
    else {
        color = "w";
        playerIn = this.game.blackPlayer.getPlayerInStringFormat();
    }
    request += color + "," + this.game.mainBoard.getBoardInStringFormat() + "," + playerIn + ")";

    return request;
};

Client.prototype.botRequestMove = function() {
    var game = this.game;
    var request = this.makeRequestString_botResquestMove();
    this.getPrologRequest(
        request,
        function(data) {
            var responseInArray = JSON.parse(data.target.responseText);
            game.moveAnimator.board = responseInArray[0];
            game.moveAnimator.currPlayer = responseInArray[1];
            game.moveAnimator.enemyPlayer = responseInArray[2];
            var rowFrom = responseInArray[3], colFrom = responseInArray[4];
            var rowTo = responseInArray[5], colTo = responseInArray[6];
            var tileFrom = game.mainBoard.tiles[rowFrom][colFrom];
            var tileTo = game.mainBoard.tiles[rowTo][colTo];
            game.moveAnimator.inited = false;
            game.moveAnimator.moveToExecute = new GameMove(tileFrom, tileTo, "move", "bot");
            game.stateMachine.setState(states.ANIMATION_MOVE);
            game.botRequestMove = false;
        });
};

Client.prototype.makeRequestString_botResquestMove = function() {

    var request = "botMoveAndCapture(";
    var playerFromIn, playerToIn, color;
    if (this.game.stateMachine.turn == turn.WHITE) {
        color = "w";
        playerFromIn = this.game.whitePlayer.getPlayerInStringFormat();
        playerToIn = this.game.blackPlayer.getPlayerInStringFormat();
    }
    else {
        color = "b";
        playerFromIn = this.game.blackPlayer.getPlayerInStringFormat();
        playerToIn = this.game.whitePlayer.getPlayerInStringFormat();
    }
    request += color + "," + this.game.mainBoard.getBoardInStringFormat() + "," + playerFromIn + ","
            + playerToIn + ")";

    return request;
};





