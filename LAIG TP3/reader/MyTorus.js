/**
 * MyTorus
 * @constructor
 */
 function MyTorus(scene, id, inner, outer, slices, loops) {
 	CGFobject.call(this,scene);

    this.id = id;
    outer = (outer + inner) / 2; // raio maior do torus
    inner = outer - inner; // raio de cada seccao do torus
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
 };

 MyTorus.prototype = Object.create(CGFobject.prototype);
 MyTorus.prototype.constructor = MyTorus;

 MyTorus.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

    // based on https://blogoben.wordpress.com/2011/10/26/webgl-basics-7-colored-torus/
    for (var loop = 0; loop <= this.loops; loop++) {
        for (var slice = 0; slice <= this.slices; slice++) {
            var loopAngle = 2 * Math.PI * loop / this.loops;
            var sliceAngle = 2 * Math.PI * slice / this.slices;

            var x = (this.outer + this.inner * Math.cos(loopAngle)) * Math.cos(sliceAngle);
            var y = (this.outer + this.inner * Math.cos(loopAngle)) * Math.sin(sliceAngle);
            var z = this.inner * Math.sin(loopAngle);

            var s = 1 - loop / this.loops;
            var t = 1 - slice / this.slices;

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(s, t);

            if (loop < this.loops && slice < this.slices) {
                var aux1 = loop * (this.slices + 1) + slice;
                var aux2 = this.slices + aux1 + 1;

                this.indices.push(aux1, aux2 + 1, aux2);
                this.indices.push(aux1, aux1 + 1, aux2 + 1);
            }
        }
    }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};

MyTorus.prototype.updateTextCoords = function(s, t) {}
