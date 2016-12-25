
function XMLscene(interface) {
    CGFscene.call(this);
    this.interface = interface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.enableTextures(true);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.materialDefault = new CGFappearance(this);

    this.axis = new CGFaxis(this);
    this.timeActive = false;
    this.firstTime = null;

    this.setUpdatePeriod(20);
    this.vehicle = new Vehicle(this, 'airplane');
    this.game = new GameState(this);

    this.setPickEnabled(true);
    this.indexRegPick = 1;
    this.hotspotSelected = null;
};

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var hotspot = this.pickResults[i][0];
				if (hotspot)
				{
					var customId = this.pickResults[i][1];
                    this.game.updatePieceSelected(hotspot);
                }
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}


XMLscene.prototype.initLights = function () {
    this.luzes = [];
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(10 * Math.cos(-Math.PI/4), 20, -10 * Math.sin(-Math.PI/4)), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
    this.axis = new CGFaxis(this, this.graph.axisLenght);

    this.setDefaulCamera();

    this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
    this.setGlobalAmbientLight(this.graph.ambientLight[0], this.graph.ambientLight[1], this.graph.ambientLight[2], this.graph.ambientLight[3]);

    this.setLights();

    this.timeActive = true;
    this.currTime = null;
    this.firstTime = null;
};

XMLscene.prototype.setDefaulCamera = function () {
    var defaultCam = this.graph.defaultCam;
    for (var i = 0; i < this.graph.cameras.length; i++)
    if (this.graph.cameras[i].id == defaultCam) {
        this.camera = this.graph.cameras[i].camera;
       // this.interface.setActiveCamera(this.camera);
       // this.camera = this.camera;
        this.ativeCameraIndex = i;
        break;
    }
};

XMLscene.prototype.setLights = function () {
    var group = this.interface.gui.addFolder("Luzes");
    group.open();

    var nLights = this.graph.lights.length;
    for (var i = 0; i < nLights; i++) {
        var light = this.graph.lights[i];

        if (light.constructor.name == "MyOmniLight") {
            this.lights[i].setPosition(light.location[0], light.location[1], light.location[2], light.location[3]);
            this.lights[i].setDiffuse(light.diffuse[0], light.diffuse[1], light.diffuse[2], light.diffuse[3]);
            this.lights[i].setAmbient(light.ambient[0], light.ambient[1], light.ambient[2], light.ambient[3]);
            this.lights[i].setSpecular(light.specular[0], light.specular[1], light.specular[2], light.specular[3]);
            this.lights[i].setVisible(light.enabled);
            this.lights[i].update();
        } else if (light.constructor.name == "MySpotLight") {
            this.lights[i].setPosition(light.location[0], light.location[1], light.location[2], 1);
            this.lights[i].setDiffuse(light.diffuse[0], light.diffuse[1], light.diffuse[2], light.diffuse[3]);
            this.lights[i].setAmbient(light.ambient[0], light.ambient[1], light.ambient[2], light.ambient[3]);
            this.lights[i].setSpecular(light.specular[0], light.specular[1], light.specular[2], light.specular[3]);
            var xdir = light.target[0] - light.location[0];
            var ydir = light.target[1] - light.location[1];
            var zdir = light.target[2] - light.location[2];
            this.lights[i].setSpotDirection(xdir, ydir, zdir);
            this.lights[i].setSpotExponent(light.exponent);
            this.lights[i].setSpotCutOff(light.angle);
            this.lights[i].setVisible(light.enabled);
            this.lights[i].update();
        }
        var aux;
        if (light.enabled) {
            this.lights[i].enable();
            aux = true;
        } else {
            aux = false;
        }
        this.luzes[i] = aux;
        group.add(this.luzes, i);
    }
};

XMLscene.prototype.updateLights = function() {
    for (i = 0; i < this.lights.length; i++) {
        this.lights[i].update();
        if (this.luzes[i] == true) {
            this.lights[i].enable();
        } else {
            this.lights[i].disable();
        }
    }
};

/*
 * Change the position of
 */
XMLscene.prototype.changeCamera = function() {
    this.ativeCameraIndex = (this.ativeCameraIndex + 1) % this.graph.cameras.length;
    this.camera = this.graph.cameras[this.ativeCameraIndex].camera;
    this.interface.setActiveCamera(this.camera);
};

/*
 * Update the currTime attribute of scene (used for animations and other things).
 */
XMLscene.prototype.update = function(currTime){
    if (this.firstTime === null && this.timeActive === true) {
        this.firstTime = currTime;
    }

    if (this.firstTime !== null) {
        this.currTime = (currTime - this.firstTime) / 1000;
    }
}

/*
 * Make a surface returning a CGFnurbsObject object.
 */
XMLscene.prototype.makeSurface = function (degree1, degree2, controlvertexes, uDivs, vDivs) {

    var knots1 = this.getKnotsVector(degree1);
    var knots2 = this.getKnotsVector(degree2);

    var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
    getSurfacePoint = function(u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    var obj = new CGFnurbsObject(this, getSurfacePoint, uDivs, vDivs);
    return obj;
}

XMLscene.prototype.getKnotsVector = function(degree) {

    var v = new Array();
    for (var i=0; i<=degree; i++) {
        v.push(0);
    }
    for (var i=0; i<=degree; i++) {
        v.push(1);
    }
    return v;
}

XMLscene.prototype.display = function () {

    this.logPicking();
	this.clearPickRegistration();
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    this.axis.display();

    this.setDefaultAppearance();

    this.updateLights();

    // ---- END Background, camera and axis setup

    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it

    if (this.graph.loadedOk)
    {
        var nLights = this.graph.lights.length;
        for (var i = 0; i < nLights; i++) {
            this.lights[i].update();
        }

        if (this.game.inited == false) {
            return;
        }
        if (this.pickMode) {
            this.indexRegPick = 1;
            this.game.display();
        }
        else {
            this.game.display();
        }

    };
};
