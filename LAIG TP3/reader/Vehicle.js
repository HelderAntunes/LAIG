/**
* Vehicle
* @constructor
*/
function Vehicle(scene, id) {
    CGFobject.call(this, scene);

    this.id = id;

   this.heightBody = 6;
   this.radiusBody = 0.5;
   this.body = new MyCilinder(scene, 'body', this.radiusBody, this.radiusBody, this.heightBody, 20, 20); 

   this.heightFront = 2;
   this.front = new MyCilinder(scene, 'front', this.radiusBody, 0, this.heightFront, 20, 20);


   var controlPointsWing = [    // U = 0
                        [ // V = 0..1;
                             [ 0, 0, 0.5, 1 ],
                             [ 0, 0, -0.5, 1 ]
                            
                        ],
                        // U = 1
                        [ // V = 0..1
                             [ 2, 0.2, 0.5, 1 ],
                             [ 2, 0.2, -0.7, 1 ]                             
                        ],
                        // U = 2
                        [ // V = 0..1                            
                            [ 3, 0.8, 0.5, 1 ],
                            [ 3, 0.8, -1.2, 1 ]
                        ]
                    ];
   this.lateralWing = new Patch(scene, 'wing', 2, 1, 20, 10, controlPointsWing);

   var controlPointsWingInverted = [    // U = 0
                        [ // V = 0..1;
                             [ 0, 0, 0.5, 1 ],
                             [ 0, 0, -0.5, 1 ]
                            
                        ],
                        // U = 1
                        [ // V = 0..1
                             [ 2, -0.2, 0.7, 1 ],
                             [ 2, -0.2, -0.5, 1 ]                             
                        ],
                        // U = 2
                        [ // V = 0..1                            
                            [ 3, -0.8, 1.2, 1 ],
                            [ 3, -0.8, -0.5, 1 ]
                        ]
                    ];
    this.lateralWingInverted = new Patch(scene, 'wing', 2, 1, 20, 10, controlPointsWingInverted);

    var controlPointsWing2 = [    // U = 0
                        [ // V = 0..1;
                             [ 0, -0, 0.5, 1 ],
                             [ 0, -0, -0.5, 1 ]
                            
                        ],
                        // U = 1
                        [ // V = 0..1
                             [ 2, -0.2, 0.5, 1 ],
                             [ 2, -0.2, -0.7, 1 ]                             
                        ],
                        // U = 2
                        [ // V = 0..1                            
                            [ 3, -0.8, 0.5, 1 ],
                            [ 3, -0.8, -1.2, 1 ]
                        ]
                    ];
   this.lateralWing2 = new Patch(scene, 'wing', 2, 1, 20, 10, controlPointsWing2);

   var controlPointsWingInverted2 = [    // U = 0
                        [ // V = 0..1;
                             [ 0, 0, 0.5, 1 ],
                             [ 0, 0, -0.5, 1 ]
                            
                        ],
                        // U = 1
                        [ // V = 0..1
                             [ 2, 0.2, 0.7, 1 ],
                             [ 2, 0.2, -0.5, 1 ]                             
                        ],
                        // U = 2
                        [ // V = 0..1                            
                            [ 3, 0.8, 1.2, 1 ],
                            [ 3, 0.8, -0.5, 1 ]
                        ]
                    ];
    this.lateralWingInverted2 = new Patch(scene, 'wing', 2, 1, 20, 10, controlPointsWingInverted2);

};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.scale(0.3, 0.3, 0.3);

    this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.heightBody/2);
        this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, this.heightBody/2);
        this.front.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.lateralWing.display();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.lateralWingInverted.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.lateralWingInverted2.display();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.lateralWing2.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
};

Vehicle.prototype.updateTextCoords = function(s, t) {}
