
function MyTexture(id, cgfTexture, length_s, length_t) {
    this.id = id;
    this.cgfTexture = cgfTexture;
    this.length_s = length_s;
    this.length_t = length_t;
};

MyTexture.prototype.constructor = MyTexture;
