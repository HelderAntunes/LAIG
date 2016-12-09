/*
* Patch
* @constructor
*/
function Patch(scene, id, orderU, orderV, partsU, partsV, controlPoints) {
    CGFobject.call(this,scene);

    this.id = id;
    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlvertexes = controlPoints;

    this.nurbsObj = scene.makeSurface(orderU, orderV, controlPoints, partsU, partsV);
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

/*
 * Display the nurbs object corresponding.
 */
Patch.prototype.display = function() {
    this.nurbsObj.display();
}

Patch.prototype.updateTextCoords = function(s, t) {}
