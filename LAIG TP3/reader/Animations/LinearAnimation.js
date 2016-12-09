
/** 
 * Constructor of LinearAnimation
 */
function LinearAnimation(id, span, controlPoints) {
	this.id = id;
	this.cps = controlPoints;
	this.span = span;

	this.totalDistance = 0;
	for (var i = 1; i < this.cps.length; i++) {
		this.totalDistance += this.getDistanceBetweenTwoPoints(this.cps[i], this.cps[i-1]);
	}
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/*
 * Get distance betwee two points.
 */
LinearAnimation.prototype.getDistanceBetweenTwoPoints = function (cp1, cp2) {
	return Math.sqrt(Math.pow(cp2[0] - cp1[0], 2) + Math.pow(cp2[1] - cp1[1], 2) + Math.pow(cp2[2] - cp1[2], 2));
}

/*
 * Get current tranformation matrix of animation in function of 'timePassed' since beginning of animation.
 */
LinearAnimation.prototype.getTransformationMatrix = function(timePassed) {
	
	var M = [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1 ];
	
	if (this.span <= timePassed) {
		mat4.translate(M, M, this.cps[this.cps.length - 1]);
		var cp2 = this.cps[this.cps.length-1];
		var cp1 = this.cps[this.cps.length-2];
		mat4.rotate(M, M, Math.atan2(cp2[0] - cp1[0], cp2[2] - cp1[2]), [0, 1, 0]);
		return M;
	}

	var dist;
	var distPercorred = this.totalDistance * (timePassed / this.span);
	var currDist = 0;
	var i;
	for (i = 1; i < this.cps.length; i++) {
		dist = this.getDistanceBetweenTwoPoints(this.cps[i], this.cps[i-1]);
		if (currDist + dist < distPercorred)
			currDist += dist;
		else
			break;
	}
	
	var translateVal = this.calcInterpolation(this.cps[i-1], this.cps[i], Math.abs(distPercorred - currDist) / dist);
	mat4.translate(M, M, translateVal);
	var cp2 = this.cps[i];
	var cp1 = this.cps[i-1];
	mat4.rotate(M, M, Math.atan2(cp2[0] - cp1[0], cp2[2] - cp1[2]), [0, 1, 0]);

	return M;
}

/*
 * Calculate the interpolation of two points. Useful because the velocity is constant in linear animation.
 * based on: http://gamedev.stackexchange.com/questions/18615/how-do-i-linearly-interpolate-between-two-vectors
 */
LinearAnimation.prototype.calcInterpolation = function(cp1, cp2, t) {
	var translateVal = [];
	for (var i = 0; i < cp2.length; i++) {
		translateVal[i] = cp1[i] * (1.0 - t) + (cp2[i] * t);
	}
	return translateVal;
}