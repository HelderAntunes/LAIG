
/**
 * Constructor of CircularAnimation
 */
function CircularAnimation(id, span, center, radius, startang, rotang) {
	this.id = id;
	this.span = span;
	this.center = center;
	this.radius = radius;
	this.startang = startang * Math.PI / 180;
	this.rotang = rotang * Math.PI / 180;

}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * Get current tranformation matrix of animation in function of 'timePassed' since beginning of animation.
 */
CircularAnimation.prototype.getTransformationMatrix = function(timePassed) {

	var M = [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1 ];

	timePassed = Math.min(timePassed, this.span);

	mat4.translate(M, M, this.center);
	var angleToAdd = (timePassed / this.span) * this.rotang;
	mat4.rotate(M, M, this.startang + angleToAdd, [0, 1, 0]);
	mat4.translate(M, M, [this.radius, 0, 0]);
	if (angleToAdd > 0) {
		mat4.rotate(M, M, Math.PI, [0, 1, 0]);
	}
	return M;
}
