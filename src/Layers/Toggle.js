import React, { useContext, useEffect, useRef } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import {
  AddressAutofill,
  AddressMinimap,
  useConfirmAddress,
  config,
} from "@mapbox/search-js-react";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const Toggle = () => {
  const searchBox = useRef(null);
  const { map } = useContext(MapContextMapbox);
  let token =
    "pk.eyJ1Ijoic21vaGFuMjAyMiIsImEiOiJjbDI0bm1xb3owMWxoM2tucGowMnc1ejk1In0.1ZaYMVjLOMwSVoX9QfLUZA";

  useEffect(() => {
    if (!map) return;
    const geocoder = new MapboxGeocoder({
      accessToken: token,
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder);

    fetch(
      "https://api.mapbox.com/geocoding/v5/mapbox.places/washington.json?access_token=pk.eyJ1Ijoic21vaGFuMjAyMiIsImEiOiJjbDI0bm1xb3owMWxoM2tucGowMnc1ejk1In0.1ZaYMVjLOMwSVoX9QfLUZA"
    )
      .then((data) => data.json())
      .then((out) => console.log(out));
  }, [map]);
  return (
    <div style={{ zIndex: "1", position: "absolute" }}>
      <div id="geocoder" className="geocoder" ref={searchBox}></div>
    </div>
  );
};

export default Toggle;
