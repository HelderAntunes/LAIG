
function MySceneNode(id) {
    this.id = id;
    this.transformation;
    this.animations = [];
    this.materials = [];
    this.texture;
    this.adjNodes = [];
    this.adjLeafs = [];
}

MySceneNode.prototype.constructor = MySceneNode;
