// Initialize Firebase
var config = {
    apiKey: "AIzaSyAcLq8kOBIvUxRRZZ3YigQoEnSAS8saht0",
    authDomain: "outdoorteamassistant.firebaseapp.com",
    databaseURL: "https://outdoorteamassistant.firebaseio.com",
    projectId: "outdoorteamassistant",
    storageBucket: "outdoorteamassistant.appspot.com",
    messagingSenderId: "53927207455"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();



var dbRead = database.ref('/');
dbRead.on('value', function(snapshot) {
    console.log(snapshot.val());
});

function writeDB(){
    firebase.database().ref('/fire_spots').set(x);
}

var wwd;
var placemarkLayer = new WorldWind.RenderableLayer("Placemarks");
var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
var placemark;

var addingActive = false;
var deletingActive = false;
var id = 0;

var aspisFireSpeadURL = "https://chcj22cafa.execute-api.eu-west-2.amazonaws.com/dev";

var add = true;

var x = new ObservableArray([]);
writeDB();

x.addEventListener("itemadded", function (e) {
    //console.log("Added %o at index %d.", e.item, e.index);
    var method = "POST";
    var postData = {
        lat: e.item.lat,
        lon: e.item.lon,
        fuelModelNo: 6,
        debug: true,
    }
    var shouldBeAsync = true;
    var request = new XMLHttpRequest();
    request.onload = function () {
        var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
        var data = JSON.parse(request.responseText); // Returned data, e.g., an HTML document.
        const positions = [
            {
                lat:e.item.lat+0.0001,
                lon:e.item.lon,
            },
            {
                lat:e.item.lat+0.0001,
                lon:e.item.lon+0.0001,
            },
            {
                lat:e.item.lat,
                lon:e.item.lon+0.0001,
            },
            {
                lat:e.item.lat-0.0001,
                lon:e.item.lon+0.0001,
            },
            {
                lat:e.item.lat-0.0001,
                lon:e.item.lon,
            },
            {
                lat:e.item.lat-0.0001,
                lon:e.item.lon-0.0001,
            },
            {
                lat:e.item.lat,
                lon:e.item.lon-0.0001,
            },
            {
                lat:e.item.lat+0.0001,
                lon:e.item.lon-0.0001,
            },
        ];
        if(add){
            for(var i=0; i<data.length; i++){
                addImageAfterTime(positions[i].lat, positions[i].lon, data[i]*1000);
            }

            add = false;
        }

    }

    request.open(method, aspisFireSpeadURL, shouldBeAsync);

    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(postData));
});

function addImageAfterTime(lat, lon, time){
    setTimeout(
        function() {
            addNewImageOnMap(lat,lon);
        }, time);
}

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
        active: true,
        lat: latitude,
        lon: longitude,
    };

    placemarkAttributes.imageScale = 1;
    placemarkAttributes.imageColor = WorldWind.Color.WHITE;
    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;

    placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 0), true, null);
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
    x.push(extraFlameData);

    writeDB();
    console.log('Added new flame on',latitude,':',longitude);
    wwd.redraw();
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
        document.getElementById("dlt_img").src = '/assets/delete_disabled.png';
        document.getElementById("add_img").src = '/assets/add_enabled.png';
    }
    else{document.getElementById("add_img").src = '/assets/add_disabled.png';}
}

function toggleRemove(){
    deletingActive = !deletingActive;

    if(deletingActive){
        addingActive = false;
        document.getElementById("add_img").src = '/assets/add_disabled.png';
        document.getElementById("dlt_img").src = '/assets/delete_enabled.png';
    }
    else document.getElementById("dlt_img").src = '/assets/delete_disabled.png';
}

function ObservableArray(items) {
    var _self = this,
        _array = [],
        _handlers = {
            itemadded: [],
            itemremoved: [],
            itemset: []
        };

    function defineIndexProperty(index) {
        if (!(index in _self)) {
            Object.defineProperty(_self, index, {
                configurable: true,
                enumerable: true,
                get: function() {
                    return _array[index];
                },
                set: function(v) {
                    _array[index] = v;
                    raiseEvent({
                        type: "itemset",
                        index: index,
                        item: v
                    });
                }
            });
        }
    }

    function raiseEvent(event) {
        _handlers[event.type].forEach(function(h) {
            h.call(_self, event);
        });
    }

    Object.defineProperty(_self, "addEventListener", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function(eventName, handler) {
            eventName = ("" + eventName).toLowerCase();
            if (!(eventName in _handlers)) throw new Error("Invalid event name.");
            if (typeof handler !== "function") throw new Error("Invalid handler.");
            _handlers[eventName].push(handler);
        }
    });

    Object.defineProperty(_self, "removeEventListener", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function(eventName, handler) {
            eventName = ("" + eventName).toLowerCase();
            if (!(eventName in _handlers)) throw new Error("Invalid event name.");
            if (typeof handler !== "function") throw new Error("Invalid handler.");
            var h = _handlers[eventName];
            var ln = h.length;
            while (--ln >= 0) {
                if (h[ln] === handler) {
                    h.splice(ln, 1);
                }
            }
        }
    });

    Object.defineProperty(_self, "push", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function() {
            var index;
            for (var i = 0, ln = arguments.length; i < ln; i++) {
                index = _array.length;
                _array.push(arguments[i]);
                defineIndexProperty(index);
                raiseEvent({
                    type: "itemadded",
                    index: index,
                    item: arguments[i]
                });
            }
            return _array.length;
        }
    });

    Object.defineProperty(_self, "pop", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function() {
            if (_array.length > -1) {
                var index = _array.length - 1,
                    item = _array.pop();
                delete _self[index];
                raiseEvent({
                    type: "itemremoved",
                    index: index,
                    item: item
                });
                return item;
            }
        }
    });

    Object.defineProperty(_self, "unshift", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function() {
            for (var i = 0, ln = arguments.length; i < ln; i++) {
                _array.splice(i, 0, arguments[i]);
                defineIndexProperty(_array.length - 1);
                raiseEvent({
                    type: "itemadded",
                    index: i,
                    item: arguments[i]
                });
            }
            for (; i < _array.length; i++) {
                raiseEvent({
                    type: "itemset",
                    index: i,
                    item: _array[i]
                });
            }
            return _array.length;
        }
    });

    Object.defineProperty(_self, "shift", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function() {
            if (_array.length > -1) {
                var item = _array.shift();
                delete _self[_array.length];
                raiseEvent({
                    type: "itemremoved",
                    index: 0,
                    item: item
                });
                return item;
            }
        }
    });

    Object.defineProperty(_self, "splice", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function(index, howMany /*, element1, element2, ... */ ) {
            var removed = [],
                item,
                pos;

            index = index == null ? 0 : index < 0 ? _array.length + index : index;

            howMany = howMany == null ? _array.length - index : howMany > 0 ? howMany : 0;

            while (howMany--) {
                item = _array.splice(index, 1)[0];
                removed.push(item);
                delete _self[_array.length];
                raiseEvent({
                    type: "itemremoved",
                    index: index + removed.length - 1,
                    item: item
                });
            }

            for (var i = 2, ln = arguments.length; i < ln; i++) {
                _array.splice(index, 0, arguments[i]);
                defineIndexProperty(_array.length - 1);
                raiseEvent({
                    type: "itemadded",
                    index: index,
                    item: arguments[i]
                });
                index++;
            }

            return removed;
        }
    });

    Object.defineProperty(_self, "length", {
        configurable: false,
        enumerable: false,
        get: function() {
            return _array.length;
        },
        set: function(value) {
            var n = Number(value);
            var length = _array.length;
            if (n % 1 === 0 && n >= 0) {
                if (n < length) {
                    _self.splice(n);
                } else if (n > length) {
                    _self.push.apply(_self, new Array(n - length));
                }
            } else {
                throw new RangeError("Invalid array length");
            }
            _array.length = n;
            return value;
        }
    });

    Object.getOwnPropertyNames(Array.prototype).forEach(function(name) {
        if (!(name in _self)) {
            Object.defineProperty(_self, name, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: Array.prototype[name]
            });
        }
    });

    if (items instanceof Array) {
        _self.push.apply(_self, items);
    }
}
