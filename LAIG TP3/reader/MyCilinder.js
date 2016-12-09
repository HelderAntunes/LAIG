/**
 * MyCilinder
 * @constructor
 */
 function MyCilinder(scene, id, baseRadius, topRadius, height, slices, stacks) {
 	CGFobject.call(this,scene);

    this.id = id;
	this.slices = slices;
	this.stacks = stacks;
    this.baseRadius = baseRadius;
    this.topRadius = topRadius;
    this.height = height;

 	this.initBuffers();
 };

 MyCilinder.prototype = Object.create(CGFobject.prototype);
 MyCilinder.prototype.constructor = MyCilinder;

 MyCilinder.prototype.initBuffers = function() {

 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

	var andarTam = 1 / (this.stacks);
    var teta = Math.PI*2 / this.slices;

	for (var i = 0; i <= this.stacks; i++){
		var zpos = i  *andarTam * this.height;
        var radius = this.baseRadius + i * (this.topRadius - this.baseRadius) / this.stacks;
		for (var j = 0; j < this.slices; j++) {
			var x = Math.cos(teta*j) * radius;
			var y = Math.sin(teta*j) * radius;
			this.vertices.push(x, y, zpos);
            var normalAux = Math.atan(Math.abs(this.topRadius-this.baseRadius)/this.height);
			this.normals.push(Math.cos(normalAux)*x, Math.cos(normalAux)*y, Math.sin(normalAux));
            this.texCoords.push(j / (this.slices-1), i / (this.stacks));
 		}
	}

 	for(var i = 0; i < this.stacks; i++){
 		for(var j = 0; j < this.slices; j++){
 			if(j === this.slices-1){
 				this.indices.push(j+i*this.slices);
				this.indices.push(j+i*this.slices+1);
				this.indices.push(j+(i+1)*this.slices);

				this.indices.push(j+i*this.slices);
				this.indices.push(i*this.slices);
				this.indices.push(j+i*this.slices+1);
 			}
 			else{
				this.indices.push(j+i*this.slices);
				this.indices.push(j+i*this.slices+1);
				this.indices.push(j+(i+1)*this.slices);

				this.indices.push(j+i*this.slices+1);
				this.indices.push(j+(i+1)*this.slices+1);
				this.indices.push(j+(i+1)*this.slices);
 			}

 		}
 	}

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, -1);
    this.texCoords.push(0.5, 0.5);
    var nVertices = (this.slices) * (this.stacks + 1) + 1;
    var centerVertice = nVertices - 1;
    for (var i = 0; i <= this.slices; i++) {
        var x = Math.cos(i * teta) * this.baseRadius;
        var y = Math.sin(i * teta) * this.baseRadius;
        this.vertices.push(x, y, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(Math.cos(i * teta) + 0.5, Math.sin(i * teta) + 0.5);
        if (i >= 1) {
            this.indices.push(centerVertice);
            this.indices.push(nVertices);
            this.indices.push(nVertices - 1);
        }
        nVertices++;
    }

    this.vertices.push(0, 0, this.height);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);
    centerVertice = nVertices;
    nVertices++;
    for (var i = 0; i <= this.slices; i++) {
        var x = Math.cos(i * teta) * this.topRadius;
        var y = Math.sin(i * teta) * this.topRadius;
        this.vertices.push(x, y, this.height);
        this.normals.push(0, 0, 1);
        this.texCoords.push(Math.cos(i * teta) + 0.5, Math.sin(i * teta) + 0.5);
        if (i >= 1) {
            this.indices.push(centerVertice);
            this.indices.push(nVertices - 1);
            this.indices.push(nVertices);
        }
        nVertices++;
    }

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
};

MyCilinder.prototype.updateTextCoords = function(s, t) {}
