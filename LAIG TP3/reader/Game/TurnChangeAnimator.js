/**
* TurnChangeAnimator
* @constructor
*/
function TurnChangeAnimator(game) {
    this.game = game;
    this.durationOfAnimation = 1;
    this.inited = false;

};

TurnChangeAnimator.prototype.constructor = TurnChangeAnimator;


TurnChangeAnimator.prototype.init = function() {
    this.inited = true;
    this.restartClock();
};


TurnChangeAnimator.prototype.display = function() {

    if (this.inited == false) {
        this.init();
        this.game.drawBoards();
        return;
    }

    var time = this.game.scene.currTime;

    if (time > this.durationOfAnimation) {
        this.game.stateMachine.currState = states.PIECE_SELECTION_FROM;
        if (this.game.stateMachine.turn == turn.WHITE)
            this.game.stateMachine.turn = turn.BLACK;
        else
            this.game.stateMachine.turn = turn.WHITE;
        this.inited = false;
        this.game.drawBoards();
        return;
    }

    var perc = time / this.durationOfAnimation, ang;
    if (this.game.stateMachine.turn == turn.WHITE) {
        ang = -Math.PI/4 + perc * Math.PI/2;
    }
    else {
        ang = Math.PI/4 - perc * Math.PI/2;
    }
    this.game.scene.camera.setPosition(vec3.fromValues(10 * Math.cos(ang), 20, -10 * Math.sin(ang)));
    this.game.drawBoards();

};

TurnChangeAnimator.prototype.restartClock = function() {
    this.game.scene.firstTime = null;
    this.game.scene.currTime = 0;
};





