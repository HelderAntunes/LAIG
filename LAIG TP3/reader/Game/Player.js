/**
* Player
* @constructor
*/
function Player(color) {
    this.color = color;
    this.score = 0;
    this.numBodies = 11;
    this.numLegs = 12;
    this.numPincers = 12;
};

Player.prototype.constructor = Player;

Player.prototype.increaseScore = function() {
    this.score++;
};

Player.prototype.reducePieces = function(arrayBLP) {
    this.numBodies -= arrayBLP[0];
    this.numLegs -= arrayBLP[1];
    this.numPincers -= arrayBLP[2];
};
