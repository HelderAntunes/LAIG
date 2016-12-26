/**
* MyQuad
* @constructor
*/
function MyQuad(scene, Smin, Smax, Tmin, Tmax) {
    CGFobject.call(this,scene);

    this.minS = Smin || 0;
    this.maxS = Smax || 1;
    this.minT = Tmin || 0;
    this.maxT = Tmax || 1;

    this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor = MyQuad;

MyQuad.prototype.initBuffers = function() {
    this.vertices = [
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        -0.5, 0.5, 0,
        0.5, 0.5, 0
    ];

    this.indices = [
        0, 1, 2,
        3, 2, 1
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.texCoords = [
        this.minS,  this.maxT,
        this.maxS,  this.maxT,
        this.minS,  this.minT,
        this.maxS,  this.minT
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
