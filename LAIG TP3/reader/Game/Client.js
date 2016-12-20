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

Client.prototype.checkIfMoveIsValid = function() {
    var request = this.makeRequestString_moveValid();
    var game = this.game;
    this.getPrologRequest(
        request,
        function(data) {
            if (data.target.response === "yes") {
                var tileFrom = game.hotspotFrom.tile;
                var tileTo = game.hotspotTo.tile;
                game.moveToExecute = new GameMove(tileFrom, tileTo);
            }
            else {
                /// do it nothing for now...
            }

            game.hotspotFrom = null;
            game.hotspotTo = null;
        });
};

Client.prototype.makeRequestString_moveValid = function() {
    var tileFrom = this.game.hotspotFrom.tile;
    var tileTo = this.game.hotspotTo.tile;

    var request = "moveValid(";
    if (this.game.stateMachine.turn == turn.WHITE) {
        request += "w,";
    }
    else {
        request += "b,";
    }
    request += tileFrom.row + "," + tileFrom.collumn + ","
            + tileTo.row + "," + tileTo.collumn + ","
            + this.game.mainBoard.getBoardInStringFormat()
            + ")";

    return request;
};

Client.prototype.executeMove = function() {
    var request = this.makeRequestString_moveAndCapture();
    var game = this.game;
    this.getPrologRequest(
        request,
        function(data) {
            var responseInArray = JSON.parse(data.target.responseText);
            game.stateMachine.setState(states.ANIMATION_MOVE);
            game.moveAnimator.init(responseInArray[0],
                                    responseInArray[1],
                                    responseInArray[2]);
        });

    game.moveToExecute = null;
};

Client.prototype.makeRequestString_moveAndCapture = function() {

    var tileFrom = this.game.moveToExecute.tileFrom;
    var tileTo = this.game.moveToExecute.tileTo;

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
