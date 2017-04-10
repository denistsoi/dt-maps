import Chart from 'chart.js';

var templatedata = {
    labels: [
        "Lights",
        "Water",
        "Appliance",
    ],
    datasets: [
        {
            backgroundColor: [
                "#FFCE56",
                "#36A2EB",
                "#FF6384"
            ]
        }]
};

var generateChart = function(popup, data) {
    console.log(popup, JSON.parse(data));
    templatedata.datasets[0].data = JSON.parse(data);

    var canvasEl = popup._content.childNodes[0];
    var chart = new Chart(canvasEl, {
        type: 'pie',
        data: templatedata
    })
};

var osmpopup = function() {
  var map = new mapboxgl.Map({
      container: 'map',
      style: './styles/basic-v9-cdn.json',
      center: [114.1794, 22.2888],
      zoom: 12,
  });

  var geojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [114.192412, 22.283797]
        },
        "properties": {
            "title": "hk",
            "icon": "marker",
            "description": `<canvas id="chart"></canvas>`,
            "data": [100, 50, 200]
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [114.1412, 22.283797]
        },
        "properties": {
            "title": "other",
            "icon": "marker",
            "description": `<canvas id="chart"></canvas>`,
            "data": [20, 10, 100]
        }
    }]
  };

  map.on('load', function () {
      map.addLayer({
          "id": "points",
          "type": "symbol",
          "source": {
              "type": "geojson",
              "cluster": true,
              "data": geojson
          },
          "layout": {
              "icon-image": "{icon}-15",
              "text-field": "{title}",
              "text-font": ["Open Sans Semibold"],
              "text-offset": [0, 0.6],
              "text-anchor": "top"
          }
      });

      map.on('click', function(e) {
        console.log("what am i clicking on?", e);
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['points']
        });

        // no features near coordinates of click
        if (!features.length) {
          return;
        }

        var feature = features[0];

        var popup = new mapboxgl.Popup({
            closeButton: false
        }).setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.description)
          .addTo(map);

        generateChart(popup, feature.properties.data);
      });

      map.on('mousemove', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['points'] });
          map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
      });
  });
};

exports = module.exports = osmpopup();