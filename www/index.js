var wwd;
var placemarkLayer = new WorldWind.RenderableLayer("Placemarks");
var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
var placemark;

var addingActive = false;
var deletingActive = false;
var id = 0;

window.addEventListener("load", eventWindowLoaded, false);
function eventWindowLoaded() {
    // Create a WorldWindow for the canvas.
    wwd = new WorldWind.WorldWindow("canvasOne");

    // Add some image layers to the WorldWindow's globe.
    //wwd.addLayer(new WorldWind.BMNGOneImageLayer());
    //wwd.addLayer(new WorldWind.BMNGLandsatLayer());
    wwd.addLayer(new WorldWind.BingAerialLayer(null));
    wwd.addLayer(new WorldWind.AtmosphereLayer());
    // Add a compass, a coordinates display and some view controls to the WorldWindow.
    wwd.addLayer(new WorldWind.CompassLayer());
    wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
    wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
    wwd.addLayer(placemarkLayer);

    // Listen for mouse clicks.
    var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

    // Listen for taps on mobile devices.
    var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);
}

var handleClick = function (recognizer) {
    // Obtain the event location.
    var x = recognizer.clientX,
        y = recognizer.clientY;

    var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

    if (pickList.objects.length == 1 && pickList.objects[0].isTerrain) {
        var position = pickList.objects[0].position;
        if(addingActive){
            addNewImageOnMap(position.latitude, position.longitude);
        }
    }else if(pickList.objects.length == 2 && !pickList.objects[0].isTerrain){
        handleClickedItem(pickList.objects[0])
    }
};

function addNewImageOnMap(latitude,longitude){

    var extraFlameData={
        type: 'flame',
        createdAt: Date.now(),
        ID: id,
        active: true
    };

    placemarkAttributes.imageScale = 1;
    placemarkAttributes.imageColor = WorldWind.Color.WHITE;
    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;

    placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 1e2), true, null);
    placemark.extraAspisData = extraFlameData;
    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

    placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    placemarkAttributes.imageSource = 'assets/flame.png';
    placemark.attributes = placemarkAttributes;

    var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
    highlightAttributes.imageScale = 1.2;
    placemark.highlightAttributes = highlightAttributes;

    // Add the placemark to the layer.
    placemarkLayer.addRenderable(placemark);
    id = id+1;
}

function removeImageFromMap(id){
    console.log('Renderables first',placemarkLayer.renderables);

    for(var i=0; i<placemarkLayer.renderables.length; i++){
        var extraAspisData = placemarkLayer.renderables[i].extraAspisData;
        console.log(extraAspisData);
        if(extraAspisData.ID === id){
            console.log('found delete');
            placemarkLayer.renderables.splice(i,1);
        }

    }
    // console.log(placemarkLayer.renderables);
}

function handleClickedItem(item){
    var extraAspisData = item.userObject.extraAspisData;
    //if(extraAspisData.type === 'flame'){
    //    document.getElementById('label').innerHTML = renderFlameMenu();
    //}

    if(deletingActive){
        removeImageFromMap(extraAspisData.ID);
    }
}

function toggleAdd(){
    addingActive = !addingActive;

    if(addingActive){
        deletingActive = false;
        document.getElementById("flame_img").src = '/assets/flame.png';
    }
    else{document.getElementById("flame_img").src = '/assets/dead_flame.png';}
}

function toggleRemove(){
    deletingActive = !deletingActive;

    if(deletingActive){
        addingActive = false;
        document.getElementById("flame_img").src = '/assets/flame.png';
    }
    else{document.getElementById("flame_img").src = '/assets/dead_flame.png';}
}


function renderFlameMenu(){
    return '<div> FLAME RENDER </div>';
}