import mapboxgl from 'mapbox-gl';

function osm() {
  mapboxgl.accessToken = 'NOT-REQUIRED-WITH-YOUR-VECTOR-TILES-DATA';

  var map = new mapboxgl.Map({
      container: 'map',
      style: './styles/basic-v9-cdn.json',
      center: [114.1794, 22.2888],
      zoom: 12
  });
}

exports = module.exports = osm(); 