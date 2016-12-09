precision mediump float;
precision mediump int;

varying vec2 textureCoords;

uniform sampler2D uSampler;

// properties of chess board
uniform float du;
uniform float dv;
uniform float su;
uniform float sv;
uniform float r1, g1, b1, a1;
uniform float r2, g2, b2, a2;
uniform float rs, gs, bs, as;

void main()
{
	float s = textureCoords.s;
	float t = textureCoords.t;
	int col = int(s / (1.0 / du));
	int row = int(t / (1.0 / dv));

	vec4 color;

	// check if row and col are even
	int row_div2 = row / 2;
	int col_div2 = col / 2;
	bool row_isEven = false;
	bool col_isEven = false;
	if (row_div2 + row_div2 == row) {
		row_isEven = true;
	}
	if (col_div2 + col_div2 == col) {
		col_isEven = true;
	}

	// the left-bottom corner is always of color of c2 (unless this position is selected)
	if (row_isEven) {
		if (col_isEven) {
			color = vec4(r2, g2, b2, a2);
		} else {
			color = vec4(r1, g1, b1, a1);
		}
	} else {
		if (col_isEven) {
			color = vec4(r1, g1, b1, a1);
		} else {
			color = vec4(r2, g2, b2, a2);
		}
	}

	// su and sv are counted from left to the right and from top to the bottom, respectively
	if (col == int(su) && int(dv)-row-1 == int(sv)) {
		if (int(su) == -1 && int(sv) == -1) {
			color = vec4(r1, g1, b1, a1);
		} else {
			color = vec4(rs, gs, bs, as);
		}
	}

	gl_FragColor = texture2D(uSampler, textureCoords) * color;
}
