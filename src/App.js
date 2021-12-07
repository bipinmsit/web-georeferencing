import React from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Mapbox } from "./Map/Mapbox";
import { Openlayers } from "./Map/Openlayers";
import Layers from "./Layers/Layers";

function App() {
  // return <Mapbox zoom={5} center={[80, 20]}></Mapbox>;
  return (
    <Openlayers zoom={7} center={[80, 20]}>
      <Layers />
    </Openlayers>
  );
}

export default App;
