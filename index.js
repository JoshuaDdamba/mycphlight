var express = require('express');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/regions.geojson', function (request, response) {
  response.sendFile(__dirname + '/public/regions.geojson');
});

app.get('/visualization', function (req, res) {

    fs.readFile(__dirname + '/public/regions.geojson', 'utf-8', (err, data) => {

        console.log(JSON.parse(data));
        res.json({
          "type": "MapBox",
          "properties": {"dummyRegions": JSON.parse(data)}
        });

      if (err) throw err;
    });
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

