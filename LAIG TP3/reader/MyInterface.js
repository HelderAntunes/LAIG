/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui

	this.gui = new dat.GUI();

	return true;
};

/**
 * processKeyUp
 * @param event {Event}
 */
MyInterface.prototype.processKeyUp = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyUp.call(this,event);

};

/**
 * processKeyDown
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyDown.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	var receiveCommand = false;
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
        case(86): // V
        case(118): // v
            this.scene.changeCamera();
            break;
        case(77): //  M
        case(109): // m
            this.scene.graph.materialIndex++;
            break;
        default:
            break
	};


};
