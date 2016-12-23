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
	var tileFrom = game.hotspotFrom.tile;
    var tileTo = game.hotspotTo.tile;
    game.moveAnimator.moveToExecute = new GameMove(tileFrom, tileTo, "move");
    var request = this.makeRequestString_moveAndCapture();
    this.getPrologRequest(
        request,
        function(data) {
        	if (data.target.responseText === "invalidMove") {
        		game.stateMachine.currState = states.PIECE_SELECTION_FROM;
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

    game.updateAnimator.moveToExecute = new GameMove(tileFrom, tileTo, typeOfMove);

    var request = this.makeRequestString_update(predicate);


    this.getPrologRequest(
        request,
        function(data) {
            
            if (data.target.responseText === "invalidMove") {
                game.stateMachine.currState = states.UPDATE_PIECE_FROM;
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

