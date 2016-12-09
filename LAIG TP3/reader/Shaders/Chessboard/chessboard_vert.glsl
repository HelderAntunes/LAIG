precision mediump float;
precision mediump int;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D uSampler;

// properties of chess board
uniform float du;
uniform float dv;
uniform float su;
uniform float sv;
uniform float r1, g1, b1, a1;
uniform float r2, g2, b2, a2;
uniform float rs, gs, bs, as;

varying vec2 textureCoords;

void main()
{
	vec3 offset = vec3(0,0,0);

	float s = aTextureCoord.s;
	float t = aTextureCoord.t;
	int col = int(s / (1.0 / du));
	int row = int(t / (1.0 / dv));

	// su and sv are counted from left to the right and from top to the bottom, respectively

	if (int(su) != -1 && int(sv) != -1 && col == int(su) && int(dv)-row-1 == int(sv)) {
		offset = offset + aVertexNormal * 0.03;
	}

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
	textureCoords = aTextureCoord;
}
