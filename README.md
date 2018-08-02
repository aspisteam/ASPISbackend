//01) GET emxsys.net/wmt-rest/rs/fuelmodels/XX for fuel model description
//02) POST http://emxsys.net/wmt-rest/rs/surfacefuel
//  fuelModel: 01
//  fuelMoisture: {"dead1HrFuelMoisture":{"type":"fuel_moisture_1h:%","value":"3.0","unit":"%"},
//     "dead10HrFuelMoisture":{"type":"fuel_moisture_10h:%","value":"4.0","unit":"%"},
//     "dead100HrFuelMoisture":{"type":"fuel_moisture_100h:%","value":"5.0","unit":"%"},
//     "liveHerbFuelMoisture":{"type":"fuel_moisture_herb:%","value":"30.0","unit":"%"},
//     "liveWoodyFuelMoisture":{"type":"fuel_moisture_woody:%","value":"60.0","unit":"%"}
// }
//03) We have full FUEL MODEL DESCRIPTION
//04) POST http://emxsys.net/wmt-rest/rs/surfacefire
//  weather: {
//   "airTemperature": {
//     "type": "air_temp:F",
//     "value": "86",
//     "unit": "fahrenheit"
//   },
//   "relativeHumidity": {
//     "type": "rel_humidity:%",
//     "value": "34",
//     "unit": "%"
//   },
//   "windSpeed": {
//     "type": "wind_speed:kts",
//     "value": "17.8",
//     "unit": "kt"
//   },
//   "windDirection": {
//     "type": "wind_dir:deg",
//     "value": "340",
//     "unit": "deg"
//   },
//   "cloudCover": {
//     "type": "cloud_cover:%",
//     "value": "3",
//     "unit": "%"
//   }
// }
// terrain: {"aspect":{"type":"aspect:deg","value":"-1.9271077329935","unit":"deg"},
// "slope":{"type":"slope:deg","value":"1.6241011549657618","unit":"deg"},
// "elevation":{"type":"elevation:m","value":"3","unit":"m"}}
// fuel: 03
//05) WE HAVE FIRE BEHAVIOR DESCRIPTION