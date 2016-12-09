/**
* ChessBoard
* @constructor
*/
function ChessBoard(scene, id, du, dv, su, sv, c1, c2, cs, my_texture) {
    CGFobject.call(this, scene);

    this.id = id;
    this.du = du;
    this.dv = dv;
    this.su = su;
    this.sv = sv;
    this.c1 = c1;
    this.c2 = c2;
    this.cs = cs;
    this.my_texture = my_texture;

    this.plane = new Plane(scene, 'plane', 1, 1, 4 * du, 4 * dv);

    this.shader = new CGFshader(scene.gl, "../reader/Shaders/Chessboard/chessboard_vert.glsl", "../reader/Shaders/Chessboard/chessboard_frag.glsl");
    this.shader.setUniformsValues({du: du, dv: dv, su: su, sv: sv, 
                                r1: c1[0], g1: c1[1], b1: c1[2], a1: c1[3],
                                r2: c2[0], g2: c2[1], b2: c2[2], a2: c2[3],
                                rs: cs[0], gs: cs[1], bs: cs[2], as: cs[3]
                            });

};

ChessBoard.prototype = Object.create(CGFobject.prototype);
ChessBoard.prototype.constructor = ChessBoard;

ChessBoard.prototype.display = function() {
    var defaultShader = this.scene.activeShader;
    this.scene.setActiveShader(this.shader);
    this.my_texture.cgfTexture.bind();
    this.plane.display();
    this.scene.setActiveShader(defaultShader);
};

ChessBoard.prototype.updateTextCoords = function(s, t) {}
