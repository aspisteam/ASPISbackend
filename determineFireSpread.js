var request = require('then-request');

//INPUT
constants = require('./constants');
var fuelModelNumber = '06';

//URLS
var fuelModelInfoURL = 'http://emxsys.net/wmt-rest/rs/fuelmodels/'+fuelModelNumber;
var surfaceFuelURL = 'http://emxsys.net/wmt-rest/rs/surfacefuel';
var surfaceFireURL = 'http://emxsys.net/wmt-rest/rs/surfacefire';


request('GET', fuelModelInfoURL).done(function (res) {
    const fuelModelInfoBody = JSON.parse(res.getBody());

    var FormData = request.FormData;
    var data = new FormData();

    data.append('fuelModel', JSON.stringify(fuelModelInfoBody));
    data.append('fuelMoisture', constants.fuelMoisture);

    request('POST', surfaceFuelURL, {form: data}).done(function (res) {
        var surfaceFuelBody = JSON.parse(res.getBody());
        // console.log(JSON.stringify(surfaceFuelBody));


        var data = new FormData();
        data.append('weather', constants.weather);
        data.append('terrain', constants.terrain);
        data.append('fuel', JSON.stringify(surfaceFuelBody))

        request('POST', surfaceFireURL, {form: data}).done(function (res) {
            var surfaceFireBody = JSON.parse(res.getBody());
            // console.log(JSON.stringify(surfaceFireBody));
            computeData(surfaceFireBody)
        });
    });
});


function computeData(surfaceFire){

}