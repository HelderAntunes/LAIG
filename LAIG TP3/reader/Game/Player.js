/**
* Player
* @constructor
* Saves the information of one player.
*/
function Player(color) {
    this.color = color;
    this.score = 0;
    this.numBodies = 11;
    this.numLegs = 12;
    this.numPincers = 12;
};

Player.prototype.constructor = Player;

/**
 * Increase the score of player.
 */
Player.prototype.increaseScore = function() {
    this.score++;
};

/**
 * Reduce pieces of player.
 */
Player.prototype.reducePieces = function(arrayBLP) {
    this.numBodies -= arrayBLP[0];
    this.numLegs -= arrayBLP[1];
    this.numPincers -= arrayBLP[2];
};

/**
 * Get player in string format.
 */
Player.prototype.getPlayerInStringFormat = function() {
    return "[" + this.color + "," + this.numBodies + "," + this.numLegs +
    "," + this.numPincers + "," + this.score + "]";
};

/**
 * Return true if stock is expired. False, otherwise.
 */
Player.prototype.stockIsExpired = function() {
    if (this.numPincers == 0 && this.numLegs == 0 && this.numPincers == 0)
        return true;
    return false;
};

/**
 * Update the state of player.
 */
Player.prototype.update = function(score, numBodies, numLegs, numPincers) {
    this.score = score;
    this.numBodies = numBodies;
    this.numLegs = numLegs;
    this.numPincers = numPincers;
};



