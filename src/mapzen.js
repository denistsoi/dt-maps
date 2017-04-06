import MAPZEN_API_KEY from '../config/env';

function mapzen() {
  // Mapzen API key (replace key with your own)
  // To generate your own key, go to https://mapzen.com/developers/
  L.Mapzen.apiKey = MAPZEN_API_KEY;
  
  var map = L.Mapzen.map('map', {
    center: [22.2888, 114.1794],
    zoom: 12,
    scene: L.Mapzen.BasemapStyles.Refill
  });

  // Mapzen search box
  var geocoder = L.Mapzen.geocoder();
  geocoder.setPosition('topright');
  geocoder.addTo(map);

  // Mapzen locator (i.e., Find my location)
  var locator = L.Mapzen.locator();
  locator.addTo(map);

  // Mapzen hash (for deep linking to map location and state)
  L.Mapzen.hash({
    map: map,
    geocoder: geocoder
  });      
}

mapzen();

exports = module.exports = mapzen;