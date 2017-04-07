var osmpopup = function() {
  var popup = new mapboxgl.Popup({
    closeButton: false
  });
  
  var map = new mapboxgl.Map({
      container: 'map',
      style: './styles/basic-v9-cdn.json',
      center: [114.1794, 22.2888],
      zoom: 12
  });

  var geojson = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [-74.480312, 40.798174]
        },
        "properties": {
            "title": "g-hub usa",
            "icon": "marker"
        }
    }, {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [114.192412, 22.283797]
        },
        "properties": {
            "title": "g-hub hk",
            "icon": "marker"
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
    
  });    

  // set popup for clicking on feature
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
      .setText(feature.properties.title)
      .addTo(map);
  });

  // Use the same approach as above to indicate that the symbols are clickable
  // by changing the cursor style to 'pointer'.
  map.on('mousemove', function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: ['places'] });
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
};

exports = module.exports = osmpopup();