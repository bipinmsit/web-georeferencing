import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmFodWxzZHMiLCJhIjoiY2p3YTd5NzVpMDA5MDN5bzE0Z3YzNW1rZiJ9.GUqAHdwGlesoO4MpewcKNg";

function App() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // @crossOriginIsolated

    const url2 = "mapbox://rahulsds.CB_ICE_TURB_36";

    const map = new mapboxgl.Map({
      style: "mapbox://styles/rahulsds/ckqg61ww901zl18pe29b4emv6",
      container: mapContainerRef.current,
      zoom: 2, // starting zoom
      center: [40.043, 35.201], // starting center
    });

    map.on("load", () => {
      map.addLayer({
        id: "as_a_polygon",
        type: "fill",
        source: {
          type: "vector",
          url: url2,
        },
        "source-layer": "CB_000_36_00_20211126",
        paint: {
          "fill-color": "rgba(61,153,80,0.55)",
          // "circle-radius": 3,
          // "circle-color": "blue",
          // // "circle-stroke-color": "white",
          // // "circle-stroke-width": 1,
          // // "circle-opacity": 0.5,
        },
        layout: {
          visibility: "visible",
        },
      });

      map.addLayer({
        id: "as_a_point",
        type: "circle",
        source: {
          type: "vector",
          url: url2,
        },
        "source-layer": "CB_000_36_00_20211126",
        paint: {
          // "fill-color": "rgba(61,153,80,0.55)",
          "circle-radius": 2,
          "circle-color": "blue",
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": 0.5,
        },
        layout: {
          visibility: "visible",
        },
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className="App">
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
}

export default App;
