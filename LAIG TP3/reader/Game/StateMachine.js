var states = {
    MENU: 0,
    INIT_GAME: 1,
    PIECE_SELECTION_FROM: 2,
    PIECE_SELECTION_TO: 3,
    ANIMATION_MOVE: 4,
    UPDATE_PIECE_FROM: 5,
    UPDATE_PIECE_TO: 6,
    ANIMATION_UPDATE: 7,
    ANIMATION_CAPTURE: 8,
    TURN_CHANGE: 9,
    MACHINE_MOVE: 10,
    END_GAME: 11
};

var turn = {
	WHITE: 0,
	BLACK: 1
}

/**
* StateMachine
* @constructor
*/
function StateMachine(initialState, initialTurn) {
    this.currState = initialState;
    this.turn = initialTurn;
    this.winner = null;
};

StateMachine.prototype.constructor = StateMachine;

StateMachine.prototype.setState = function(newState) {
    this.currState = newState;
};
