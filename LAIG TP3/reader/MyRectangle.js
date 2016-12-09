
function MyRectangle(scene, id, x1, y1, x2, y2, Smin, Smax, Tmin, Tmax) {
    CGFobject.call(this, scene);

    this.id = id;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.minS = Smin || 0;
    this.maxS = Smax || 1;
    this.minT = Tmin || 0;
    this.maxT = Tmax || 1;

    this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {

    this.vertices = [
        this.x1, this.y1, 0,
        this.x2, this.y1, 0,
        this.x2, this.y2, 0,
        this.x1, this.y2, 0
    ];

    this.indices = [
        0, 1, 2,
        2, 3, 0
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
        this.maxS,  this.minT,
        this.minS,  this.minT
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyRectangle.prototype.updateTextCoords = function(s, t) {

    this.maxS = Math.abs((this.x2-this.x1) / s);
    this.maxT = Math.abs((this.y2-this.y1) / t);

    this.texCoords = [
        this.minS,  this.maxT,
        this.maxS,  this.maxT,
        this.maxS,  this.minT,
        this.minS,  this.minT
    ];

    this.updateTexCoordsGLBuffers();
}
