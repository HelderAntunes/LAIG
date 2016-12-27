 
function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    // File reading
    this.reader = new CGFXMLreader();

    this.reader.open('scenes/'+filename, this);
}

/*
 * Callback to be executed after successful reading.
 */
MySceneGraph.prototype.onXMLReady=function()
{
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseDSXFile(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    this.loadedOk = true;

    this.materialIndex = 0;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

/*
 * Log a error in console.
 */
MySceneGraph.prototype.onXMLError=function (message) {
    console.error("XML Loading Error: "+message);
    this.loadedOk=false;
};


/*
* Leitura dos elementos XML presentes em rootElement.
* Guarda a informacao recolhida na propria classe(MySceneGraph).
*/
MySceneGraph.prototype.parseDSXFile = function(rootElement) {

    var error = this.checkOrderOfMainTags(rootElement);
    if (error != null) return error;

    this.readSceneTag(rootElement);
    this.readViewsTag(rootElement);
    this.readIlluminationTag(rootElement);
    this.readLightsTag(rootElement);
    this.readTexturesTag(rootElement);
    this.readMaterialsTag(rootElement);
    this.readTransformationsTag(rootElement);
    this.readAnimation(rootElement);
    this.readPrimitivesTag(rootElement);
    this.readComponentsTag(rootElement);

};

/*
 * Check order of main tags. 
 * If an error exists, return a string with a message of error. Otherwise return null.
 */
MySceneGraph.prototype.checkOrderOfMainTags = function(rootElement) {

    var numTags = rootElement.children.length;

    var sceneTag = rootElement.children[0];
    console.log(rootElement.children[0]);
    if (sceneTag === null || sceneTag.nodeName != "scene") {
        return "'scene' tag is missing or is in wrong position.";
    }

    var viewsTag = rootElement.children[1];
    if (viewsTag === null || viewsTag.nodeName != "views") {
        return "'views' tag is missing or is in wrong position.";
    }

    var illuminationTag = rootElement.children[2];
    if (illuminationTag === null || illuminationTag.nodeName != "illumination") {
        return "'illumination' tag is missing or is in wrong position.";
    }

    var lightsTag = rootElement.children[3];
    if (lightsTag === null || lightsTag.nodeName != "lights") {
        return "'lights' tag is missing or is in wrong position.";
    }

    var texturesTag = rootElement.children[4];
    if (texturesTag === null || texturesTag.nodeName != "textures") {
        return "'textures' tag is missing or is in wrong position.";
    }

    var materialsTag = rootElement.children[5];
    if (materialsTag === null || materialsTag.nodeName != "materials") {
        return "'materials' tag is missing or is in wrong position.";
    }

    var transformationsTag = rootElement.children[6];
    if (transformationsTag === null || transformationsTag.nodeName != "transformations") {
        return "'transformations' tag is missing or is in wrong position.";
    }

    var animationsTag = rootElement.children[7];
    if (animationsTag === null || animationsTag.nodeName != "animations") {
        return "'animations' tag is missing or is in wrong position.";
    }

    var primitivesTag = rootElement.children[8];
    if (primitivesTag === null || primitivesTag.nodeName != "primitives") {
        return "'primitives' tag is missing or is in wrong position.";
    }

    var componentsTag = rootElement.children[9];
    if (componentsTag === null || componentsTag.nodeName != "components") {
        return "'components' tag is missing or is in wrong position.";
    }

};

/*
 * Read 'scene' Tag.
 */
MySceneGraph.prototype.readSceneTag = function(rootElement) {

    var sceneElems = rootElement.getElementsByTagName('scene');

    this.rootId = this.reader.getString(sceneElems[0], "root", true);
    this.axisLenght = this.reader.getFloat(sceneElems[0], "axis_length", true);
    console.log("Axis_length read from file: {axis_length=" + this.axisLenght + "}.");
    console.log("Root id read from file: root id = '" + this.rootId + "'.");
};

/*
 * Read 'animations' Tag.
 */
MySceneGraph.prototype.readAnimation = function (rootElement) {
    var animationsElems = rootElement.getElementsByTagName('animations');
    this.animations = [];

    for (var i = 0; i < animationsElems[0].children.length; i++) {
        var animationElem = animationsElems[0].children[i];
        var id = this.reader.getString(animationElem, "id", true);
        var type = this.reader.getString(animationElem, "type", true);
        var span = this.reader.getFloat(animationElem, "span", true);
        
        if (type === "linear") {
            console.log('Read linear animation with id = ' + id);
            console.log('Span = ' + span);
            var controlPoints = [];
            for (var j = 0; j < animationElem.children.length; j++) {
                var controlPointElem = animationElem.children[j];
                var controlPoint = this.readXYZattributes2(controlPointElem);
                controlPoints.push(controlPoint);
            }
            var linearAnimation = new LinearAnimation(id, span, controlPoints);
            this.animations.push(linearAnimation);
        } else if (type == "circular") {
            console.log('Read circular animation with id = ' + id);
            console.log('Span = ' + span);
            var centerx = this.reader.getFloat(animationElem, 'centerx', true);
            var centery = this.reader.getFloat(animationElem, 'centery', true);
            var centerz = this.reader.getFloat(animationElem, 'centerz', true);
            console.log(centerx + " " + centery + " " + centerz);
            var center = [centerx, centery, centerz];
            var radius = this.reader.getFloat(animationElem, 'radius', true);
            var startang = this.reader.getFloat(animationElem, 'startang', true);
            var rotang = this.reader.getFloat(animationElem, 'rotang', true);
            var circularAnimation = new CircularAnimation(id, span, center, radius, startang, rotang);
            this.animations.push(circularAnimation);
        }
    }

    console.log('Readed ' + this.animations.length + " animations");   
}

/*
 * Read 'views' Tag.
 */
MySceneGraph.prototype.readViewsTag = function(rootElement) {
    var viewsElems = rootElement.getElementsByTagName('views');

    this.defaultCam = viewsElems[0].attributes.getNamedItem("default").value;
    console.log("Default camera = '" + this.defaultCam + "'.");

    this.cameras = [];
    var numCam = viewsElems[0].children.length;
    for (var i = 0; i < numCam; i++) {
        var perspE = viewsElems[0].children[i];

        var id = perspE.attributes.getNamedItem("id").value;
        var near = parseFloat(perspE.attributes.getNamedItem("near").value);
        var far = parseFloat(perspE.attributes.getNamedItem("far").value);
        var angle = parseFloat(perspE.attributes.getNamedItem("angle").value);
        angle = (angle*Math.PI)/180;

        var fromE = viewsElems[0].children[i].children[0];
        var a = this.readXYZattributes(fromE);
        var fromVec = vec3.fromValues(a[0], a[1], a[2]);

        var toE = viewsElems[0].children[i].children[1];
        a = this.readXYZattributes(toE);
        var toVec = vec3.fromValues(a[0], a[1], a[2]);

        var camera = new MyCamera(id, angle, near, far, fromVec, toVec);
        this.cameras.push(camera);
        console.log("Read camera item id = '" + camera.id + "'");
    };

};

/*
 * Read 'illumination' Tag.
 */
MySceneGraph.prototype.readIlluminationTag = function(rootElement) {

    var illuminationElems = rootElement.getElementsByTagName('illumination');

    var ambE = illuminationElems[0].children[0];
    this.ambientLight = this.readRGBAattributes(ambE);
    console.log("Illumination/ambient read from file: {ambient=" + this.ambientLight + "}");

    var backGrondE = illuminationElems[0].children[1];
    this.background = this.readRGBAattributes(backGrondE);
    console.log("Illumination/background read from file: {background=" + this.background + "}");
};

/*
 * Read 'lights' Tag.
 */
MySceneGraph.prototype.readLightsTag = function(rootElement) {

    var lightsElems = rootElement.getElementsByTagName("lights");

    this.lights = [];
    var nLights = lightsElems[0].children.length;
    console.log(nLights + " lights read from file.");
    for (var i = 0; i < nLights; i++) {
        var light = this.readLightElem(lightsElems[0].children[i]);
    }

};

/*
 * Read a light elem from dsx file.
 */
MySceneGraph.prototype.readLightElem = function(lightElem) {

    var id = this.reader.getString(lightElem, "id", true);
    console.log("read light with id = '" + id + "'.");

    var enabled = this.reader.getBoolean(lightElem, "enabled", true);

    var nodeName = lightElem.nodeName;
    if (nodeName == "omni") {
        this.lights.push(this.readOmniLight(lightElem, id, enabled));
    } else if (nodeName == "spot") {
        this.lights.push(this.readSpotLight(lightElem, id, enabled));
    }

};

/*
 * Read omni light from dsx file.
 */
MySceneGraph.prototype.readOmniLight = function(lightElem, id, enabled) {

    var location, ambient, diffuse, specular;

    var nParams = lightElem.children.length;
    for (var i = 0; i < nParams; i++) {
        var paramElem = lightElem.children[i];
        var paramName = paramElem.nodeName;

        if (paramName == "location") {
            location = this.readXYZattributes(paramElem);
            var w = this.reader.getFloat(paramElem, "w", true);
            location.push(w);
        } else {
            if (paramName == "ambient") {
                ambient = this.readRGBAattributes(paramElem);
            } else if (paramName == "diffuse") {
                diffuse = this.readRGBAattributes(paramElem);
            } else if (paramName == "specular") {
                specular = this.readRGBAattributes(paramElem);
            }
        }

    }
    return new MyOmniLight(id, enabled, location, ambient, diffuse, specular);
};

/*
 * Read omni light from dsx file.
 */
MySceneGraph.prototype.readSpotLight = function(lightElem, id, enabled) {

    var angle =  this.reader.getFloat(lightElem, "angle", true);
    angle = (angle*Math.PI)/180;
    var exponent =  this.reader.getFloat(lightElem, "exponent", true);

    var target, location, ambient, diffuse, specular;

    var nParams = lightElem.children.length;
    for (var i = 0; i < nParams; i++) {
        var paramElem = lightElem.children[i];
        var paramName = paramElem.nodeName;
        if (paramName == "location") {
            location = this.readXYZattributes(paramElem);
        } else if(paramName == "target") {
            target = this.readXYZattributes(paramElem);
        } else {
            if (paramName == "ambient") {
                ambient = this.readRGBAattributes(paramElem);
            } else if (paramName == "diffuse") {
                diffuse = this.readRGBAattributes(paramElem);
            } else if (paramName == "specular") {
                specular = this.readRGBAattributes(paramElem);
            }
        }
    }
    return new MySpotLight(id, enabled, angle, exponent, target, location,
        ambient, diffuse, specular);
};

/*
 * Read 'textures' Tag.
 */
MySceneGraph.prototype.readTexturesTag = function(rootElement) {

    var texturesElem = rootElement.getElementsByTagName('textures');

    this.textures = [];
    var nText = texturesElem[0].children.length;
    for (var i = 0; i < nText; i++) {
        this.readTexture(texturesElem[0].children[i]);
    }

};

/*
 * Read an individual texture.
 */
MySceneGraph.prototype.readTexture = function(textElem) {

    var id = this.reader.getString(textElem, "id", true);
    var file =  this.reader.getString(textElem, "file", true);
    var length_s = this.reader.getFloat(textElem, "length_s", true);
    var length_t = this.reader.getFloat(textElem, "length_t", true);
    var cgfTexture = new CGFtexture(this.scene, file);

    console.log("Read texture with id = '" + id + "'.");
    this.textures.push(new MyTexture(id, cgfTexture, length_s, length_t));
};

/*
 * Read 'materials' Tag.
 */
MySceneGraph.prototype.readMaterialsTag = function(rootElement) {

    var materialsElem = rootElement.getElementsByTagName('materials');

    this.materials = [];
    var nMat = materialsElem[0].children.length;
    for (var i = 0; i < nMat; i++) {
        this.readMaterial(materialsElem[0].children[i]);
    }
};

/*
 * Read an individual material.
 */
MySceneGraph.prototype.readMaterial = function(matElem) {

    var id = this.reader.getString(matElem, "id", true);
    var emission = this.readRGBAattributes(matElem.children[0]);
    var ambient = this.readRGBAattributes(matElem.children[1]);
    var diffuse = this.readRGBAattributes(matElem.children[2]);
    var specular = this.readRGBAattributes(matElem.children[3]);
    var shininess = this.reader.getFloat(matElem.children[4], "value", true);

    var material = new CGFappearance(this.scene);
    material.setEmission(emission[0], emission[1], emission[2], emission[3]);
    material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
	material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
	material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
	material.setShininess(shininess);

    console.log("Read mateiral with id = '" + id + "'.");
    this.materials.push(new MyMaterial(id, material));
};

/*
 * Read 'transformations' Tag.
 */
MySceneGraph.prototype.readTransformationsTag = function(rootElement) {

    var transformationsElems = rootElement.getElementsByTagName('transformations');

    this.transformations = [];
    var nTrans = transformationsElems[0].children.length;
    for (var i = 0; i < nTrans; i++) {
        this.readTransformationElem(transformationsElems[0].children[i]);
    }

    console.log(this.transformations.length + " transformations read from file.");

};

/*
 * Read an individual transformation.
 */
MySceneGraph.prototype.readTransformationElem = function(transformationElem) {
    var newTransf = new MyTransformation();
    newTransf.id = transformationElem.attributes.getNamedItem("id").value;

    console.log("Transformation with id = " + newTransf.id + " read from file.");
    console.log("Instructions of transformation " + newTransf.id + ":");

    var M = [1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1 ];

    var nInstructions = transformationElem.children.length;
    for (var i = 0; i < nInstructions; i++) {
        this.readInstructionElem(transformationElem.children[i], M);
    }
    newTransf.transMatrix = mat4.clone(M);

    this.transformations.push(newTransf);
};

/*
 * Read an individual instruction of a transformation.
 */
MySceneGraph.prototype.readInstructionElem = function(instElem, M) {
    var nodeName = instElem.nodeName;
    console.log(nodeName);

    if (nodeName == "translate") {
        var XYZarray = this.readXYZattributes(instElem);
        console.log(XYZarray);
        mat4.translate(M, M, XYZarray);
    } else if (nodeName == "rotate") {
        var axis = this.reader.getString(instElem, "axis", true);
        var angle = this.reader.getFloat(instElem, "angle", true);
        angle = (angle*Math.PI)/180;
        if (axis == "x")
        mat4.rotate(M, M, angle, [1, 0, 0]);
        else if (axis == "y")
        mat4.rotate(M, M, angle, [0, 1, 0]);
        else if (axis == "z")
        mat4.rotate(M, M, angle, [0, 0, 1]);
    } else if(nodeName == "scale") {
        var XYZarray = this.readXYZattributes(instElem);
        console.log(XYZarray);
        mat4.scale(M, M, XYZarray);
    }

};

/*
 * Read 'primitives' Tag.
 */
MySceneGraph.prototype.readPrimitivesTag = function(rootElement) {

    var primitivesElems = rootElement.getElementsByTagName('primitives');

    this.primitives = [];
    var nPrimitives = primitivesElems[0].children.length;
    console.log("Read " + nPrimitives + " primitives.");

    for (var i = 0; i < nPrimitives; i++) {
        var primitive = this.readPrimitiveElem(primitivesElems[0].children[i]);
        this.primitives.push(primitive);

        console.log("Read a primitive with id = " + primitive.id + " of type " +
        primitive.constructor.name + ".");
    }

};

/*
 * Read an individual primitive.
 */
MySceneGraph.prototype.readPrimitiveElem = function(primitiveElem) {

    var id = this.reader.getString(primitiveElem, "id", true);
    var typeElem = primitiveElem.children[0];
    var typeName = typeElem.nodeName;

    if (typeName == "rectangle") {
        var x1 = this.reader.getFloat(typeElem, "x1", true);
        var y1 = this.reader.getFloat(typeElem, "y1", true);
        var x2 = this.reader.getFloat(typeElem, "x2", true);
        var y2 = this.reader.getFloat(typeElem, "y2", true);
        return new MyRectangle(this.scene, id, x1, y1, x2, y2);
    } else if (typeName == "triangle") {
        var x1 = this.reader.getFloat(typeElem, "x1", true);
        var y1 = this.reader.getFloat(typeElem, "y1", true);
        var z1 = this.reader.getFloat(typeElem, "z1", true);
        var x2 = this.reader.getFloat(typeElem, "x2", true);
        var y2 = this.reader.getFloat(typeElem, "y2", true);
        var z2 = this.reader.getFloat(typeElem, "z2", true);
        var x3 = this.reader.getFloat(typeElem, "x3", true);
        var y3 = this.reader.getFloat(typeElem, "y3", true);
        var z3 = this.reader.getFloat(typeElem, "z3", true);
        return new MyTriangle(this.scene, id, x1, y1, z1,
                                x2, y2, z2, x3, y3, z3);
    } else if (typeName == "cylinder") {
        var baseRadius = this.reader.getFloat(typeElem, "base", true);
        var topRadius = this.reader.getFloat(typeElem, "top", true);
        var height = this.reader.getFloat(typeElem, "height", true);
        var slices = this.reader.getFloat(typeElem, "slices", true);
        var stacks = this.reader.getFloat(typeElem, "stacks", true);
        return new MyCilinder(this.scene, id, baseRadius, topRadius, height,
                                slices, stacks);
    } else if (typeName == "sphere") {
        var radius = this.reader.getFloat(typeElem, "radius", true);
        var slices = this.reader.getFloat(typeElem, "slices", true);
        var stacks = this.reader.getFloat(typeElem, "stacks", true);
        return new MySphere(this.scene, id, radius, slices, stacks);
    } else if (typeName == "torus") {
        var inner = this.reader.getFloat(typeElem, "inner", true);
        var outer = this.reader.getFloat(typeElem, "outer", true);
        var slices = this.reader.getInteger(typeElem, "slices", true);
        var loops = this.reader.getInteger(typeElem, "loops", true);
        return new MyTorus(this.scene, id, inner, outer, slices, loops);
    } else if (typeName == "plane") {
        var dimX = this.reader.getFloat(typeElem, "dimX", true);
        var dimY = this.reader.getFloat(typeElem, "dimY", true);
        var partsX = this.reader.getInteger(typeElem, "partsX", true);
        var partsY = this.reader.getInteger(typeElem, "partsY", true);
        return new Plane(this.scene, id, dimX, dimY, partsX, partsY);
    } else if (typeName == "patch") {
        var orderU = this.reader.getInteger(typeElem, "orderU", true);
        var orderV = this.reader.getInteger(typeElem, "orderV", true);
        var partsU = this.reader.getInteger(typeElem, "partsU", true);
        var partsV = this.reader.getInteger(typeElem, "partsV", true);

        var controlPoints = [];
        for (var i = 0; i < orderU + 1; i++) {
            var uArray = [];
            for (var j = 0; j < orderV + 1; j++) {
                var children = i*(orderV+1) + j;
                var ctrlPointElem = typeElem.children[children];
                var x = this.reader.getFloat(ctrlPointElem, "x", true);
                var y = this.reader.getFloat(ctrlPointElem, "y", true);
                var z = this.reader.getFloat(ctrlPointElem, "z", true);
                uArray.push([x, y, z, 1]);
            }
            controlPoints.push(uArray);

        }
        return new Patch(this.scene, id, orderU, orderV, partsU, partsV, controlPoints);
    } else if (typeName == "vehicle") {
        return new Vehicle(this.scene, id);
    } else if(typeName == "chessboard") {
        var du = this.reader.getInteger(typeElem, "du", true);
        var dv = this.reader.getInteger(typeElem, "dv", true);
        var su = this.reader.getInteger(typeElem, "su", true);
        var sv = this.reader.getInteger(typeElem, "sv", true);
        var c1 = this.readRGBAattributes(typeElem.children[0]);
        var c2 = this.readRGBAattributes(typeElem.children[1]);
        var cs = this.readRGBAattributes(typeElem.children[2]);
        var textureref = this.reader.getString(typeElem, "textureref", true);
        var my_texture;
        for (var i = 0; i < this.textures.length; i++) {
            if (this.textures[i].id == textureref) {
                my_texture = this.textures[i];
                break;
            }
        }
        return new ChessBoard(this.scene, id, du, dv, su, sv, c1, c2, cs, my_texture);
    } else if (typeName == "sofa") {
        return new MySofa(this.scene, id);
    } else if (typeName == "table") {
        return new MyTable(this.scene, id);
    }

};

/*
 * Read 'components' Tag.
 */
MySceneGraph.prototype.readComponentsTag = function(rootElement) {

    var componentsElems = rootElement.getElementsByTagName('components');

    var componentsElem = componentsElems[0];
    this.nodes = [];
    this.addNodes(componentsElem);
    this.readNodes(componentsElem);

}

/*
 * Add all nodes to the graph. The nodes contains only their 'id'.
 * Later, this is useful o reference a node that represents a child component.
 */
MySceneGraph.prototype.addNodes = function(componentsElem) {

    var allComponents = componentsElem.getElementsByTagName('component');

    for (var i = 0; i < allComponents.length; i++) {
        var component = allComponents[i];
        var id = this.reader.getString(component, "id", true);
        var node = new MySceneNode(id);
        this.nodes.push(node);
    }

}

/*
 * Read all information of all nodes.
 */
MySceneGraph.prototype.readNodes = function(componentsElem) {

    var allComponents = componentsElem.getElementsByTagName('component');
    console.log("Num components = " + allComponents.length);

    for (var i = 0; i < allComponents.length; i++) {

        var component = allComponents[i];
        var id = this.reader.getString(component, "id", true);
        console.log("Start reading component with id = '" + id + "'");
        var node = this.findNode(id);

        node.transformation = this.readTransformationOfComponent(component);
        node.animations = this.readAnimationsOfComponent(component);
        node.materials = this.readMaterialsOfComponent(component);
        node.texture = this.readTextureOfComponent(component);
        node.adjNodes = this.readAdjacentNodesOfComponent(component);
        node.adjLeafs = this.readAdjacentLeafsOfComponent(component);

    }

}

/*
 * Find node with id = 'id'.
 */
MySceneGraph.prototype.findNode = function (id) {
    for (var j = 0; j < this.nodes.length; j++)
        if (this.nodes[j].id == id)
            return this.nodes[j];
}

/*
 * Read transformation of a component.
 */
MySceneGraph.prototype.readTransformationOfComponent = function (component) {
    var transformationrefElems = component.getElementsByTagName('transformationref');
    if (transformationrefElems.length == 1) {
        return this.readTransformationReferenceOfComponent(component);
    }
    else {
        return this.readIndividualTransformationOfComponent(component);
    }
}

/*
 * Read a referenced transformation of a component.
 */
MySceneGraph.prototype.readTransformationReferenceOfComponent = function (component) {
    var transformationrefElem = component.getElementsByTagName('transformationref')[0];
    var idTrans = this.reader.getString(transformationrefElem, 'id', true);

    for (var j = 0; j < this.transformations.length; j++) {
        if (this.transformations[j].id == idTrans) {
            console.log("Id of transformation referencied of component = " + idTrans);
            return this.transformations[j];
        }
    }
}

/*
 * Read a non referenced transformation of a component.
 */
MySceneGraph.prototype.readIndividualTransformationOfComponent = function (component) {

    var transformationElem = component.getElementsByTagName('transformation');

    var M = [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1 ];

    console.log("Instructions of transformation(no referencied) of node:");

    var nInstructions = transformationElem[0].children.length;
    for (var j = 0; j < nInstructions; j++) {
        var instElem = transformationElem[0].children[j];
        this.readInstructionElem(instElem, M);
    }

    var newTransf = new MyTransformation();
    newTransf.id = "componentTranformation";
    newTransf.transMatrix = mat4.clone(M);

    return newTransf;
}

/*
 * Read animations of a component.
 */
MySceneGraph.prototype.readAnimationsOfComponent = function (component) {
    var animationElems = component.getElementsByTagName('animation');

    var animations = [];
    if (animationElems.length == 0)
        return animations;
    for (var i = 0; i < animationElems[0].children.length; i++) {
        var animationRefElem = animationElems[0].children[i];
        var id = this.reader.getString(animationRefElem, 'id', true);
        console.log('Read animation of component with id = ' + id);
        for (var j = 0; j < this.animations.length; j++) {
            if (this.animations[j].id === id) {
                animations.push(this.animations[j]);
                break;
            }
        }
    }
    
    return animations;
}

/*
 * Read materials of a component.
 */
MySceneGraph.prototype.readMaterialsOfComponent = function (component) {
    var materialsElems = component.getElementsByTagName('materials');

    var materials = [];
    var materialsElem = materialsElems[0];
    var nMateirals = materialsElem.children.length;
    for (var i = 0; i < nMateirals; i++) {
        var materialElem = materialsElem.children[i];
        var material = this.readMaterialOfComponent(materialElem);
        materials.push(material);
    }

    console.log("Read " + materials.length + " materials in component.");

    return materials;
}

/*
 * Read an unique material of a component.
 */
MySceneGraph.prototype.readMaterialOfComponent = function (materialElem) {
    var id = this.reader.getString(materialElem, 'id', true);
    console.log("Read material of component with id = '" + id + "'.");
    if (id == 'inherit') {
        return new MyMaterial(id, null);
    } else {
        var materials = this.materials;
        for (var i = 0; i < materials.length; i++)
            if (materials[i].id == id)
                return materials[i];
    }
}

/*
 * Read texture of a component.
 */
MySceneGraph.prototype.readTextureOfComponent = function (component) {
    var textureElems = component.getElementsByTagName('texture');

    var id = this.reader.getString(textureElems[0], 'id', true);
    console.log("Read texture of component with id = '" + id + "'.");
    if (id == "inherit" || id == "none")
        return new MyTexture(id, null, null, null);
    else {
        var textures = this.textures;
        for (var i = 0; i < textures.length; i++)
            if (textures[i].id == id)
                return textures[i];
    }

}

/*
 * Read adjacent components of component.
 */
MySceneGraph.prototype.readAdjacentNodesOfComponent = function (component) {
    var childrenElems = component.getElementsByTagName('children');

    var adjNodes = [];

    var adjNodeElems = childrenElems[0].getElementsByTagName('componentref');
    for (var i = 0; i < adjNodeElems.length; i++) {
        var adjNodeElem = adjNodeElems[i];
        var id = this.reader.getString(adjNodeElem, "id", true);
        console.log("Connect adjacent intermediare node of component with id = '" + id + "'.");
        var node = this.findNode(id);
        adjNodes.push(node);
    }

    return adjNodes;
}

/*
 * Read adjacent primitives of a component.
 */
MySceneGraph.prototype.readAdjacentLeafsOfComponent = function (component) {
    var childrenElems = component.getElementsByTagName('children');

    var adjLeafs = [];

    var adjLeafsElems = childrenElems[0].getElementsByTagName('primitiveref');
    for (var i = 0; i < adjLeafsElems.length; i++) {
        var adjLeafElem = adjLeafsElems[i];
        var id = this.reader.getString(adjLeafElem, "id", true);
        console.log("Connect adjacent leaf node of component with id = '" + id + "'.");
        var leaf = this.findLeaf(id);
        adjLeafs.push(leaf);
    }
    return adjLeafs;
}

/*
 * Find a primitive (Leaf in graph) with id = 'is'.
 */
MySceneGraph.prototype.findLeaf = function (id) {
    for (var i = 0; i < this.primitives.length; i++)
        if (this.primitives[i].id == id) {
            return this.primitives[i];
        }
};

/*
 * Read x-y-z attributes of an dsx element.
 */
MySceneGraph.prototype.readXYZattributes = function (paramElem) {
    var x = this.reader.getFloat(paramElem, "x", true);
    var y = this.reader.getFloat(paramElem, "y", true);
    var z = this.reader.getFloat(paramElem, "z", true);
    return [x, y, z];
};

/*
 * Read xx-yy-zz attributes of an dsx element.
 */
MySceneGraph.prototype.readXYZattributes2 = function (paramElem) {
    var x = this.reader.getFloat(paramElem, "xx", true);
    var y = this.reader.getFloat(paramElem, "yy", true);
    var z = this.reader.getFloat(paramElem, "zz", true);
    return [x, y, z];
};

/*
 * Read RGBA attributes of an dsx element.
 */
MySceneGraph.prototype.readRGBAattributes = function (paramElem) {
    var r = this.reader.getFloat(paramElem, "r", true);
    var g = this.reader.getFloat(paramElem, "g", true);
    var b = this.reader.getFloat(paramElem, "b", true);
    var a = this.reader.getFloat(paramElem, "a", true);
    return [r, g, b, a];
};

/*
 * Draw scene graph.
 */
MySceneGraph.prototype.drawGraph = function () {
    var rootNode = this.findNode(this.rootId);
    this.texturesStack = new MyStack();
    this.materialsStack = new MyStack();
    this.processNode(rootNode);
};

/*
 * depth-first search apllied in scene graph.
*/
MySceneGraph.prototype.processNode = function (node) {

    this.scene.pushMatrix();
    this.scene.multMatrix(node.transformation.transMatrix);
    this.scene.multMatrix(this.getMatrixOfAnimation(node));
    this.pushMaterialsAndTextures(node);

    // process the adjacent intermediare nodes
    var adjNodes = node.adjNodes;
    for (var i = 0; i < adjNodes.length; i++) {
        this.processNode(adjNodes[i]);
    }

    // display the leafs/primitives
    var adjLeafs = node.adjLeafs;
    for (var i = 0; i < adjLeafs.length; i++) {
        this.displayPrimitive(adjLeafs[i]);
    }

    this.materialsStack.pop();
    this.texturesStack.pop();
    this.scene.popMatrix();

};

/*
 * Find current animation of a node and position inside of this animation.
 * In the end, return the tranformation matrix corresponding.
 */
MySceneGraph.prototype.getMatrixOfAnimation = function (node) {
    var timePassed = this.scene.currTime;
    var animations = node.animations;
    var accumulator = 0;
    var animationToSet = null;

    if (animations.length == 0) {
        return mat4.create();
    }

    for (var i = 0; i < animations.length; i++) {
        accumulator += animations[i].span;
        if (accumulator > timePassed) {
            animationToSet = animations[i];
            break;
        }
    }

    if (accumulator < timePassed) {
        animationToSet = animations[animations.length-1];
        return animationToSet.getTransformationMatrix(animationToSet.span);
    }
    
    var timeSinceBeginOfAnimation = animationToSet.span - (accumulator - timePassed);
    return animationToSet.getTransformationMatrix(timeSinceBeginOfAnimation);
}

/*
 * Push materials and textures of node to the materials and textures stack.
 */
MySceneGraph.prototype.pushMaterialsAndTextures = function (node) {

    var matIndex = this.materialIndex % node.materials.length;
    var my_material = node.materials[matIndex];
    var my_texture = node.texture;

    if (my_material.id == "inherit") {
        this.materialsStack.push(this.materialsStack.top());
    } else {
        this.materialsStack.push(my_material.material);
    }

    if (my_texture.id == "inherit") {
        this.texturesStack.push(this.texturesStack.top());
    } else if (my_texture.id == "none") {
        this.texturesStack.push("noneTexture");
    } else {
        this.texturesStack.push(my_texture);
    }

};

/*
 * Display a primitive (leaf in graph), seting the material and texture corresponding.
 */
MySceneGraph.prototype.displayPrimitive = function (my_primitive) {

    if(this.texturesStack.top() !== "noneTexture") {
        var s_texture = this.texturesStack.top().length_s;
        var t_texture = this.texturesStack.top().length_t;
        my_primitive.updateTextCoords(s_texture, t_texture);
        this.materialsStack.top().setTexture(this.texturesStack.top().cgfTexture);
    }

    this.materialsStack.top().setTextureWrap('REPEAT','REPEAT');
    this.materialsStack.top().apply();

    my_primitive.display();

    this.materialsStack.top().setTexture(null);
};
