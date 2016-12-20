var states = {
    MENU: 0,
    INIT_GAME: 1,
    PIECE_SELECTION_FROM: 2,
    PIECE_SELECTION_TO: 3,
    ANIMATION_MOVE: 4,
    UPDATE_PIECE: 5,
    TURN_CHANGE: 6,
    MACHINE_MOVE: 7,
    END_GAME: 8
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
};

StateMachine.prototype.constructor = StateMachine;

StateMachine.prototype.setState = function(newState) {
    this.currState = newState;
};
