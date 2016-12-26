/**
* Flag
* @constructor
*/
function Flag(scene) {
    CGFobject.call(this, scene);

    //  function MyCilinder(scene, id, baseRadius, topRadius, height, slices, stacks) {
    this.cilinder = new MyCilinder(scene, "cilinder", 0.05, 0.05, 1, 6, 3);
    this.cilinder2 = new MyCilinder(scene, "cilinder2", 0.1, 0.1, 0.1, 6, 1);
    // function Patch(scene, id, orderU, orderV, partsU, partsV, controlPoints) {

   var controlPoints = [    // U = 0
                    [ // V = 0..1;
                         [ -1, -0.5, 0.2, 1 ],
                         [ -1, 0.5, 0.2, 1 ]
                    ],
                    // U = 1
                    [ // V = 0..1
                         [ -0.5, -0.5, -0.1, 1 ],
                         [ -0.5, 0.5, -0.1, 1 ]                             
                    ],
                    // U = 2
                    [ // V = 0..1                            
                        [ 0.5, -0.5, 0.1, 1 ],
                        [ 0.5, 0.5, 0.1, 1 ]
                    ],
                    // U = 3
                    [ // V = 0..1                            
                        [ 1, -0.5, -0.2, 1 ],
                        [ 1, 0.5, -0.2, 1 ]
                    ]
                ];
    this.patch = new Patch(scene, "patch", 3, 1, 20, 10, controlPoints);


    var controlPoint2 = [    // U = 0
                    [ // V = 0..1;
                         [ 1, -0.5, -0.2, 1 ],
                         [ 1, 0.5, -0.2, 1 ]
                    ],
                    // U = 1
                    [ // V = 0..1
                         [ 0.5, -0.5, 0.1, 1 ],
                         [ 0.5, 0.5, 0.1, 1 ]                             
                    ],
                    // U = 2
                    [ // V = 0..1                            
                        [ -0.5, -0.5, -0.1, 1 ],
                        [ -0.5, 0.5, -0.1, 1 ]
                    ],
                    // U = 3
                    [ // V = 0..1                            
                        [ -1, -0.5, 0.2, 1 ],
                        [ -1, 0.5, 0.2, 1 ]
                    ]
                ];
    this.patch2 = new Patch(scene, "patch", 3, 1, 20, 10, controlPoint2);
};

Flag.prototype = Object.create(CGFobject.prototype);
Flag.prototype.constructor = Flag;

Flag.prototype.display = function(hasPoint) {
    
    if (hasPoint) {
        this.scene.pushMatrix();
        this.scene.translate(-0.1, 0.22, 0.025);
        this.scene.scale(0.1, 0.1, 0.2);
        this.patch.display();
        this.patch2.display();
        this.scene.popMatrix();
    }

    this.scene.pushMatrix();
        this.scene.scale(0.3, 0.3, 0.3);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.cilinder.display();
        this.cilinder2.display();
    this.scene.popMatrix();
};


