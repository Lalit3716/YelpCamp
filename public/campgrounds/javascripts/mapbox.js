mapboxgl.accessToken = mapbox_token;
async function makeMap() {
  data = await axios.get(`/campgrounds/getOne/${id}`);
  const campground = data.data;

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  // const popup = new mapboxgl.Popup({
  //   offset: -10,
  // }).setHTML(
  //   `<p><h6>${campground.title}</h6>${campground.description.substring(
  //     0,
  //     100
  //   )}...</p>`
  // );

  const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    // .setPopup(popup)
    .addTo(map);
}

makeMap();
