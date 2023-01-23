import React, { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Mapbox } from "./Map/Mapbox";
import { Openlayers } from "./Map/Openlayers";
import Layers from "./Layers/Layers";
import Toggle from "./Layers/Toggle";
import Tiff from "./Layers/Tiff";
import Image from "./Layers/Image";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [hide, setHide] = useState(false);
  return (
    <>
      <Mapbox zoom={16} center={[-87.494044, 36.860856]}>
        <Tiff />
      </Mapbox>
    </>
  );
}

export default App;
