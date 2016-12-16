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

StateMachine.prototype.changeToNextState = function() {
    switch(this.currState) {
	    case states.MENU:
	        this.currState = states.INIT_GAME;
	        break;
	    case states.INIT_GAME:
			this.currState = states.PIECE_SELECTION_FROM;
			break;
	    case states.PIECE_SELECTION_FROM:
			this.currState = states.PIECE_SELECTION_TO;
			break;
		case states.PIECE_SELECTION_TO:
			this.currState = states.ANIMATION_MOVE;
			break;
		case states.ANIMATION_MOVE:
			this.currState = states.UPDATE_PIECE;
			break;
		case states.UPDATE_PIECE:
			// Fim do jogo [pedido ao prolog] ? Jogo terminado : passagem para outro jogador
			break;
		case states.TURN_CHANGE:
			// Humano ? Seleção de peça : jogada da máquina
			break;
		case states.MACHINE_MOVE:
			//[pedido ao prolog] -> {jogada} -> Animação de movimento 
			break;
		case states.END_GAME:
			this.currState = states.MENU;
			break;
	    default:
	        console.error("Invalid current state!");
	        break;
	}
};

StateMachine.prototype.changeToPreviousState = function() {
    if (this.currState == states.PIECE_SELECTION_TO) {
    	this.currState = states.PIECE_SELECTION_FROM;
    }
};