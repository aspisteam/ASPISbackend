const express = require('express');
var bodyParser = require('body-parser');
var path    = require("path");

const app = express();
const port = 3000;
app.use(bodyParser.json({ extended: false }));
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/www/'));


app.get('/', (request, response) => {
    console.log('Received Request');
    response.sendFile(path.join(__dirname+'/www/'));
});

app.post('/', function(req, res){
    console.dir(req.body);
    res.send("Received your post request. Nothing to reply though...");
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});