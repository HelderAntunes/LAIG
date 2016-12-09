/*
* Plane
* @constructor
*/
function Plane(scene, id, dimX, dimY, partsX, partsY) {
    CGFobject.call(this,scene);

    this.id = id;
    this.dimX = dimX;
    this.dimY = dimY;
    this.partsX = partsX;
    this.partsY = partsY;

    var controlvertexes = [ // U = 0
                            [ // V = 0..1;
                                 [-dimX/2, -dimY/2, 0.0, 1 ],
                                 [-dimX/2,  dimY/2, 0.0, 1 ]

                            ],
                            // U = 1
                            [ // V = 0..1
                                 [ dimX/2, -dimY/2, 0.0, 1 ],
                                 [ dimX/2,  dimY/2, 0.0, 1 ]
                            ]
                         ];

    this.nurbsObj = scene.makeSurface(1, 1, controlvertexes, partsX, partsY);
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

/*
 * Display the nurbs object corresponding.
 */
Plane.prototype.display = function() {
    this.nurbsObj.display();
}

Plane.prototype.updateTextCoords = function(s, t) {}
