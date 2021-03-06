/**
* TurnChangeAnimator
* @constructor
* Draw the game when the turn change.
*/
function TurnChangeAnimator(game) {
    this.game = game;
    this.durationOfAnimation = 1;
    this.inited = false;

};

TurnChangeAnimator.prototype.constructor = TurnChangeAnimator;

/**
 * Init animator.
 */
TurnChangeAnimator.prototype.init = function() {
    this.inited = true;
    this.restartClock();
};

/**
 * Display the game, and change the position of cameras.
 */
TurnChangeAnimator.prototype.display = function() {

    if (this.inited == false) {
        this.init();
        this.game.drawBoards();
        return;
    }

    var time = this.game.scene.currTime;

    if (time > this.durationOfAnimation) {
        this.game.stateMachine.currState = states.PIECE_SELECTION_FROM;
        if (this.game.stateMachine.turn == turn.WHITE) {
            this.game.stateMachine.turn = turn.BLACK;
        }
        else {
            this.game.stateMachine.turn = turn.WHITE;
        }

        this.inited = false;
        this.game.drawBoards();
        return;
    }

    var perc = time / this.durationOfAnimation, ang;
    if (this.game.stateMachine.turn == turn.WHITE) {
        ang = -Math.PI/4 + perc * Math.PI;
    }
    else {
        ang = 3*Math.PI/4 - perc * Math.PI;
    }
    this.game.scene.camera.setPosition(vec3.fromValues(5 * Math.cos(ang), 10, -5 * Math.sin(ang)));
    this.game.drawBoards();

};

/**
 * Restart the clock.
 */ 
TurnChangeAnimator.prototype.restartClock = function() {
    this.game.scene.firstTime = null;
    this.game.scene.currTime = 0;
};





