
function MyCamera(id, angle, near, far, fromVec, toVec) {
    this.id = id;
    this.camera = new CGFcamera(angle, near, far, fromVec, toVec);
};

MyCamera.prototype.constructor = MyCamera;
