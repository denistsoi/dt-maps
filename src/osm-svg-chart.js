var osmpopup = function() {
  var popup = new mapboxgl.Popup({
    closeButton: true
  });
  
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
            "description": `<svg viewBox="0 0 500 100" style="width: 100px; height: 50px;" class="chart">
            <polyline fill="none" stroke="#0074d9" stroke-width="2" points=" 00,120 20,60 40,80 60,20 80,80 100,80 120,60 140,100 160,90 180,80 200, 110 220, 10 240, 70 260, 100 280, 100 300, 40 320, 0 340, 100 360, 100 380, 120 400, 60 420, 70 440, 80"/></svg>`
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
      map.on('mousemove', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['points'] });
          map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
      });
      
      map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['points']
        });

        // no features near coordinates of click
        if (!features.length) {
          return;
        }

        var feature = features[0];

        popup.setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.description)
          .addTo(map);
      });
  });
};

exports = module.exports = osmpopup();