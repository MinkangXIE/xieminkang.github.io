mapboxgl.accessToken =
  "pk.eyJ1IjoibWlua2FuZ3hpZSIsImEiOiJjbHI2ZWxpbTUxeGJ0MmpvMXh1Ymxtc3pwIn0._2Jb0NG2I9wp2bzWcKbLjg";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/minkangxie/clsv4s5ci004001o3a96q66vf"
});
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: true,
  placeholder: "Search for places"
});
map.addControl(new mapboxgl.NavigationControl(), "top-left");
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);
map.addControl(geocoder);
map.on("load", () => {
  const legendLayers = ["5", "4", "3", "2", "1"];
  const colors = ["#993404", "#d95f0e", "#fe9929", "#fed98e", "#ffffd4"];
  const legend = document.getElementById("legend");
  layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement("div");
    const key = document.createElement("span");
    key.className = "legend-key";
    key.style.backgroundColor = color;
    const value = document.createElement("span");
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  });
});
map.on("click", function (e) {
  var coordinates = e.lngLat;
  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json?access_token=${mapboxgl.accessToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      var placeName =
        data.features.length > 0
          ? data.features[0].place_name
          : "Unknown location";
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<h4>Location:</h4><p>${placeName}</p>`)
        .addTo(map);
    })
    .catch((err) => console.error(err));
});
map.on("mousemove", function (e) {
  document.getElementById(
    "coordinates"
  ).innerHTML = `Longitude: ${e.lngLat.lng.toFixed(
    4
  )}, Latitude: ${e.lngLat.lat.toFixed(4)}`;
});
const layers = ["large city", "city", "small city", "town", "small town"];
layers.forEach((layer) => {
  map.setLayoutProperty(layer, "visibility", "none");
});
function toggleLayer(selectedLayer) {
  layers.forEach((layer) => {
    map.setLayoutProperty(
      layer,
      "visibility",
      layer === selectedLayer ? "visible" : "none"
    );
  });
}
document
  .getElementById("layer-select")
  .addEventListener("change", function (e) {
    toggleLayer(e.target.value);
  });