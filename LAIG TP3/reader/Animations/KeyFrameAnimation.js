
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

KeyFrameAnimation.prototype.getTotalTimeOfAnimation = function() {
	if (this.controlPoints.length == 0) {
        console.error("No control points in key frame animation.");
        return;
    }
    return this.controlPoints[this.controlPoints.length-1][0];
}

KeyFrameAnimation.prototype.constructSimpleKeyFrameAnimation = function(iniX, iniZ, endX, endZ, yInExtremes, yInMiddle, timeTotal) {
    this.controlPoints = [];
    this.addControlPoint(0,
                        iniX, yInExtremes, iniZ,
                        0, 0, 0,
                        1, 1, 1);
    var midX = (iniX + endX) / 2;
    var midZ = (iniZ + endZ) / 2;
    this.addControlPoint(timeTotal/2,
                        midX, yInMiddle, midZ,
                        0, Math.PI, 0,
                        1, 1, 1);
    this.addControlPoint(timeTotal,
                        endX, yInExtremes, endZ,
                        0, 2 * Math.PI, 0,
                        1, 1, 1);
}


KeyFrameAnimation.prototype.constructAttackedAnimation = function(x, z, initialHeight, finalHeight, timeTotal) {
    this.controlPoints = [];
    this.addControlPoint(0,
                        x, initialHeight, z,
                        0, 0, 0,
                        1, 1, 1);
    this.addControlPoint(timeTotal,
                        x, finalHeight, z,
                        0, 2 * Math.PI, 0,
                        1, 1, 1);
}

KeyFrameAnimation.prototype.constructLinearAnimationWidthRotationInY = function(xIni, yIni, zIni, xEnd, yEnd, zEnd, timeTotal) {
    this.controlPoints = [];
    this.addControlPoint(0,
                        xIni, yIni, zIni,
                        0, 0, 0,
                        1, 1, 1);
    this.addControlPoint(timeTotal,
                        xEnd, yEnd, zEnd,
                        0, 2 * Math.PI, 0,
                        1, 1, 1);
}

KeyFrameAnimation.prototype.constructUpAndDownAnimationWithRotationInY = function(xIni, yIni, zIni, finalHeight, timeTotal) {
    this.controlPoints = [];
    this.addControlPoint(0,
                        xIni, yIni, zIni,
                        0, 0, 0,
                        1, 1, 1);
    this.addControlPoint(timeTotal/2,
                        xIni, finalHeight, zIni,
                        0, Math.PI, 0,
                        1, 1, 1);
    this.addControlPoint(timeTotal,
                        xIni, yIni, zIni,
                        0, 2 * Math.PI, 0,
                        1, 1, 1);
}

KeyFrameAnimation.prototype.constructStaticAnimation = function(xIni, yIni, zIni, timeTotal) {
    this.controlPoints = [];
    this.addControlPoint(0,
                        xIni, yIni, zIni,
                        0, 0, 0,
                        1, 1, 1);
    this.addControlPoint(timeTotal,
                        xIni, yIni, zIni,
                        0, 0, 0,
                        1, 1, 1);
}
