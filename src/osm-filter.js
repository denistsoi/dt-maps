import Chart from 'chart.js';
import GeoJson from 'Locations/hong-kong';
import mapboxgl from 'mapbox-gl';
import supercluster from 'supercluster';

/**
 * Utils
 */

import generateChart from 'Utils/generateChart';

var osmpopup = function() {
  var map = new mapboxgl.Map({
      container: 'map',
      style: './styles/bright-v9-cdn.json',
      center: [114.1794, 22.2888],
      zoom: 4,
  });

  window.map = map;
  window.mb  = mapboxgl;
  window.supercluster = supercluster;


  map.on('load', function () {
    var locations = GeoJson;

    var co = locations.features[0].geometry.coordinates;
    var bounds = locations.features.reduce(function (bounds, feature) {
      return bounds.extend(feature.geometry.coordinates);
    }, new mapboxgl.LngLatBounds(co[0].lng, co[0].lat));

    map.fitBounds(bounds, { padding: 50 });

    map.addSource("points", {
        type: "geojson",
        data: locations,
        // cluster: true,
        // clusterMaxZoom: 14, // Max zoom to cluster points on
        // clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        "id": "unclustered-points",
        "type": "circle",
        "source": "points",
        "filter": ["!has", "point_count"],
        "paint": {
          "circle-color": '#f28cb1',
          "circle-radius": 8
        }
    });

    map.addLayer({
        "id": "unclustered-points-label",
        "type": "symbol",
        "source": "points",
        "filter": ["!has", "point_count"],
        "layout": {
          "text-field": "{title}",
          "text-font": ["Open Sans Semibold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
        }
    });



    // var i = supercluster({
    //     radius: 50,
    //     maxZoom: 20
    // });
    //
    // i.load(locations.features);
    // window.i = i;

    // var layers = [
    //   [5, '#f1f075'],
    //   [2, '#51bbd6']
    // ];
    //
    // layers.forEach(function (layer, i) {
    //   map.addLayer({
    //       "id": "cluster-" + i,
    //       "type": "circle",
    //       "source": "points",
    //       "paint": {
    //           "circle-color": layer[1],
    //           "circle-radius": 18
    //       },
    //       "filter": i === 0 ?
    //           [">=", "point_count", layer[0]] :
    //           ["all",
    //               [">=", "point_count", layer[0]],
    //               ["<", "point_count", layers[i - 1][0]]]
    //   });
    // });

    // adds number count to cluster
    // map.addLayer({
    //   "id": "cluster-count",
    //   "type": "symbol",
    //   "source": "points",
    //   "layout": {
    //       "text-field": "{point_count}",
    //       "text-font": ["Open Sans Semibold"],
    //       "text-size": 12
    //   }
    // });

    map.on('click', function(e) {
      var features = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-points']
      });

      // var clusters = map.queryRenderedFeatures(e.point, {
      //   // layers: ['cluster-0', 'cluster-1', 'cluster-2']
      //   layers: ['cluster-0', 'cluster-1']
      // });

      // no features near coordinates of click
      if (!features.length && !clusters.length) {
        return;
      }

      // if (clusters.length) {
      //   var cluster = clusters[0];
      //
      //   var coordinates = cluster.geometry.coordinates;
      //
      //   map.flyTo({
      //     center: [e.lngLat.lng, e.lngLat.lat],
      //     zoom: i.getClusterExpansionZoom(0, Math.floor(map.getZoom()))
      //   });
      //
      //   return;
      // }

      var feature = features[0];

      map.flyTo({
        center: [e.lngLat.lng, e.lngLat.lat]
      });

      setTimeout(function() {
        var popup = new mapboxgl.Popup({
          closeButton: false
        }).setLngLat(feature.geometry.coordinates)
          .setHTML(feature.properties.description)
          .addTo(map);

        generateChart(popup, feature.properties.data);
      }, 100);
    });

    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-points'] });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        document.getElementById('info').innerHTML =
          // e.point is the x, y coordinates of the mousemove event relative
          // to the top-left corner of the map
          JSON.stringify(e.point) + '<br />' +
              // e.lngLat is the longitude, latitude geographical position of the event
          JSON.stringify(e.lngLat);
    });

    var input = document.getElementById('filterBy');

    input.addEventListener('keyup', (e)=>{
      let value = e.target.value.trim().toLowerCase();

      let filtered = locations.features.filter((feature)=>{
        var name = feature.properties.title.trim().toLowerCase();
        return name.indexOf(value) > -1;
      });

      console.log('FILTERED: ', `value ${value}`, filtered);

      map.setFilter('unclustered-points', ['in', 'title'].concat(filtered.map((feature)=>{
        return feature.properties.title;
      })));
      map.setFilter('unclustered-points-label', ['in', 'title'].concat(filtered.map((feature)=>{
        return feature.properties.title;
      })));

      // map.setFilter('cluster-0', ['in', 'title'].concat(filtered.map((feature)=>{
      //   return feature.properties.title;
      // })));

      // map.setFilter('cluster-1', ['in', 'title'].concat(filtered.map((feature)=>{
      //   return feature.properties.title;
      // })));
      // map.setFilter('cluster-count', ['in', 'title'].concat(filtered.map((feature)=>{
      //   return feature.properties.title;
      // })));

    })


  });
};

exports = module.exports = osmpopup();
