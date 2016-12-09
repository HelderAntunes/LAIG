/**
 Animation
 Mother class of CircularAnimation and LinearAnimation.
 @constructor
 @abstract
 */
var Animation = function() {
    if (this.constructor === Animation) {
      throw new Error("Can't instantiate abstract class!");
    }
   
};

Animation.prototype.constructor = Animation;