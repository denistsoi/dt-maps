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
      zoom: 3,
  });

  window.map = map;

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
            "coordinates": [113.924, 22.310]
        },
        "properties": {
            "title": "airport",
            "icon": "marker",
            "description": `<canvas id="chart"></canvas>`,
            "data": [20, 10, 100]
        }
    },    
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [114.180, 22.304]
        },
        "properties": {
            "title": "poly u",
            "icon": "marker",
            "description": `<canvas id="chart"></canvas>`,
            "data": [20, 10, 100]
        }
    }, 
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [114.2432, 22.266]
        },
        "properties": {
            "title": "somewhere",
            "icon": "marker",
            "description": `<canvas id="chart"></canvas>`,
            "data": [20, 10, 100]
        }
    },    
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [114.1912, 22.283797]
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
    map.addSource("points", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        "id": "unclustered-points",
        "type": "symbol",
        "source": "points",
        "filter": ["!has", "point_count"],
        "layout": {
            "icon-image": "marker-15",
            "icon-size": 1.5,
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
                     
        }
    });

      var layers = [
          [5, '#f28cb1'],
          [2, '#f1f075'],
          [0, '#51bbd6']
      ];

      layers.forEach(function (layer, i) {
        map.addLayer({
            "id": "cluster-" + i,
            "type": "circle",
            "source": "points",
            "paint": {
                "circle-color": layer[1],
                "circle-radius": 18
            },
            "filter": i === 0 ?
                [">=", "point_count", layer[0]] :
                ["all",
                    [">=", "point_count", layer[0]],
                    ["<", "point_count", layers[i - 1][0]]]
        });
      });

      map.addLayer({
        "id": "cluster-count",
        "type": "symbol",
        "source": "points",
        "layout": {
            "text-field": "{point_count}",
            "text-font": ["Open Sans Semibold"],
            "text-size": 12
        }
      });

      map.on('click', function(e) {
        // console.log("what am i clicking on?", e);
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['unclustered-points']
        });
        var clusters = map.queryRenderedFeatures(e.point, {
          layers: ['cluster-0', 'cluster-1', 'cluster-2']
        });

        // no features near coordinates of click
        if (!features.length && !clusters.length) {
          return;
        }

        if (clusters.length) {
          var cluster = clusters[0];
          
          var coordinates = cluster.geometry.coordinates;

          // console.log(clusters, coordinates);
          // var sw = new mapboxgl.LngLat(coordinates[0] - 1, coordinates[1] - 1);
          // var ne = new mapboxgl.LngLat(coordinates[0] + 1, coordinates[1] + 1);
          // var a = new mapboxgl.LngLat(113.498443603516,  22.23385475992968);
          // var b = new mapboxgl.LngLat(114.69498443603516, 22.33385475992968);
          // map.fitBounds(new mapboxgl.LngLatBounds(sw,ne))
          
          // var bounds = coordinates.reduce(function(bounds, coord) {
          //   console.log(bounds, coord);
          //   return bounds.extend(coord);
          // }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          // console.log(bounds);
          // map.fitBounds(bounds, {
          //   padding: 20
          // });
          // console.log(e, cluster);
          map.flyTo({
            center: [e.lngLat.lng, e.lngLat.lat],
            zoom: map.getZoom() + 3
          })
          // map.setView(e.latLng, map.getZoom() + 1);
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
          var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-points'] });
          map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
      });
  });
};

exports = module.exports = osmpopup();