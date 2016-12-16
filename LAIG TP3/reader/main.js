//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}

serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyTransformation.js',
                'MyRectangle.js', 'MyCamera.js', 'MyTriangle.js', 'MyOmniLight.js', 'MySpotLight.js',
                'MyTexture.js', 'MyMaterial.js', 'MyCilinder.js', 'MySphere.js', 'MySceneNode.js', 'MyStack.js',
                'MyInterface.js', 'MyTorus.js', 'Animations/Animation.js', 'Animations/LinearAnimation.js',
                'Animations/CircularAnimation.js', 'Surfaces/Plane.js', 'Surfaces/Patch.js', 'Vehicle.js', 'ChessBoard.js',
                'Game/Primitives/AdaptoidBoard.js', 'Game/Primitives/AuxiliaryBoard.js', 'Game/Primitives/Tile.js', 
                'Game/GameState.js', 'Game/Primitives/Adaptoid/Body.js', 'Game/Primitives/Hotspot.js',
                'Game/Primitives/Adaptoid/Leg.js', 'Game/Primitives/Adaptoid/Pincer.js', 'Game/Client.js',
                'Game/Player.js', 'Game/StateMachine.js', 

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);


    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)

	var filename=getUrlVars()['file'] || "LAIG_TP1_DSX_T1_G10_v02.xml";
	//var filename=getUrlVars()['file'] || "demo.xml";


	// create and load graph, and associate it to scene.
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene);

	// start
    app.run();
}

]);
