
/**
 * Constructor of KeyFrameAnimation
 */
function KeyFrameAnimation(id) {
	this.id = id;
    this.controlPoints = [];
}

KeyFrameAnimation.prototype = Object.create(Animation.prototype);
KeyFrameAnimation.prototype.constructor = KeyFrameAnimation;

KeyFrameAnimation.prototype.addControlPoint = function(time, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
    this.controlPoints.push([time, tx, ty, tz, rx, ry, rz, sx, sy, sz]);
}

/**
 * Get current tranformation matrix of animation in function of 'timePassed' since beginning of animation.
 */
KeyFrameAnimation.prototype.getTransformationMatrix = function(timePassed) {
    if (this.controlPoints.length < 2) {
        console.error("Control points are less than 2!!!");
        return;
    }

    var cpFrom = null;
    var cpTo = null;
    for (var i = 1; i < this.controlPoints.length; i++) {
        var cp = this.controlPoints[i];
        if (cp[0] > timePassed) {
            cpTo = i;
            cpFrom = i - 1;
            break;
        }
    }

    if (cpTo === null || cpFrom === null) {
        cpTo = this.controlPoints.length-1;
        cpFrom = cpTo - 1;
        timePassed = this.controlPoints[this.controlPoints.length-1][0];
    }

    cpFrom = this.controlPoints[cpFrom];
    cpTo = this.controlPoints[cpTo];

    var aux = (timePassed - cpFrom[0]) / (cpTo[0]-cpFrom[0]);
    var translationArray = this.calcInterpolation([cpFrom[1], cpFrom[2], cpFrom[3]],
                                                    [cpTo[1], cpTo[2], cpTo[3]],
                                                    aux);
    var rotationArray = this.calcInterpolation([cpFrom[4], cpFrom[5], cpFrom[6]],
                                                    [cpTo[4], cpTo[5], cpTo[6]],
                                                    aux);
    var scalingArray = this.calcInterpolation([cpFrom[7], cpFrom[8], cpFrom[9]],
                                                    [cpTo[7], cpTo[8], cpTo[9]],
                                                    aux);
    var M = mat4.create();
    mat4.translate(M, M, translationArray);
    mat4.rotate(M, M, rotationArray[0], [1, 0, 0]);
    mat4.rotate(M, M, rotationArray[1], [0, 1, 0]);
    mat4.rotate(M, M, rotationArray[2], [0, 0, 1]);
    mat4.scale(M, M, scalingArray);
    return M;
}

/*
 * Calculate the interpolation of two points. Useful because the velocity is constant in linear animation.
 * based on: http://gamedev.stackexchange.com/questions/18615/how-do-i-linearly-interpolate-between-two-vectors
 */
KeyFrameAnimation.prototype.calcInterpolation = function(cp1, cp2, t) {
	var interpolation = [];
	for (var i = 0; i < cp2.length; i++) {
		interpolation[i] = cp1[i] * (1.0 - t) + (cp2[i] * t);
	}
	return interpolation;
}
