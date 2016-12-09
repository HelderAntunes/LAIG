/**
* MyQuad
* @constructor
*/
function MyTriangle(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    CGFobject.call(this,scene);

    this.id = id;

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.minS = 0;
    this.maxS = 1;
    this.minT = 0;
    this.maxT = 1;

    this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {
    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
    ];

    this.indices = [
        0, 1, 2
    ];

    // see this link to calculate the normal of triangle:
    // http://math.stackexchange.com/questions/305642/how-to-find-surface-normal-of-a-triangle
    var normalx = (this.y2-this.y1)*(this.z3-this.z1) - (this.z2-this.z1)*(this.y3-this.y1);
	var normaly = (this.z2-this.z1)*(this.x3-this.x1) - (this.x2-this.x1)*(this.z3-this.z1);
	var normalz = (this.x2-this.x1)*(this.y3-this.y1) - (this.y2-this.y1)*(this.x3-this.x1);

    this.normals = [
        normalx, normaly, normalz,
        normalx, normaly, normalz,
        normalx, normaly, normalz
    ];

    var a = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2) + Math.pow(this.z1-this.z3, 2));
    var b = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2) + Math.pow(this.z2-this.z1, 2));
    var c = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2) + Math.pow(this.z3-this.z2, 2));

    var cosBeta = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
    this.texCoords = [
        c - a * cosBeta,  a * a - a*cosBeta*a*cosBeta,
        this.minS,  this.minT,
        this.maxS,  this.minT,
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyTriangle.prototype.updateTextCoords = function(s, t) {

	var a = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2) + Math.pow(this.z1-this.z3, 2));
	var b = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2) + Math.pow(this.z2-this.z1, 2));
    var c = Math.sqrt(Math.pow(this.x2-this.x3, 2) + Math.pow(this.y2-this.y3, 2) + Math.pow(this.z2-this.z3, 2));

    var beta = Math.acos((Math.pow(c, 2) + Math.pow(b, 2) - Math.pow(a, 2))/(2*b*c));

    this.texCoords = [
		0, 0,
		b / s, 0,
		((b - c*Math.cos(beta))/b)*b/s, (c*Math.sin(beta)/b)*b/t
    ];

    this.updateTexCoordsGLBuffers();
}
