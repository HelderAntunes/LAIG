/**
* MyLamp
* @constructor
*/
function MySphere(scene, id, radius, slices, stacks) {
    CGFobject.call(this,scene);

    this.id = id;
    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var R = 1/(this.stacks-1);
    var S = 1/(this.slices-1);
    var r, s;
    var M_PI_2 = Math.PI / 2;
    var M_PI = Math.PI;

    for(r = 0; r < this.stacks; r++) for(s = 0; s < this.slices; s++) {
        var y = Math.sin( -M_PI_2 + M_PI * r * R );
        var x = Math.cos(2*M_PI * s * S) * Math.sin( M_PI * r * R );
        var z = Math.sin(2*M_PI * s * S) * Math.sin( M_PI * r * R );
        this.texCoords.push(s*S, r*R);
        this.vertices.push(x * this.radius, y * this.radius, z * this.radius);
        this.normals.push(x, y, z);
    }

    for (r = 0; r < this.stacks-1; r++) for (s = 0; s < this.slices-1; s++) {
        this.indices.push(s + (r+1)*this.slices);
        this.indices.push(s + r*this.slices+1);
        this.indices.push(s + r*this.slices);
        this.indices.push(s + (r+1)*this.slices);
        this.indices.push(s + (r+1)*this.slices+1);
        this.indices.push(s + r*this.slices+1);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MySphere.prototype.updateTextCoords = function(s, t) {}
