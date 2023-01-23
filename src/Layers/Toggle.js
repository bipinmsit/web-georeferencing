import React, { useContext, useEffect } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as mapboxtoken from "@mapbox/search-js-web";
import SessionToken from "session-token";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const Toggle = () => {
  const { map } = useContext(MapContextMapbox);

  const searchFunc = async () => {
    const search = new mapboxtoken.MapboxSearchBox({
      accessToken:
        "pk.eyJ1Ijoic21vaGFuMjAyMiIsImEiOiJjbDI0bm1xb3owMWxoM2tucGowMnc1ejk1In0.1ZaYMVjLOMwSVoX9QfLUZA",
    });

    const sessionToken = new SessionToken();
    const result = await search.suggest("Washington D.C.", { sessionToken });
    if (result.suggestions.length === 0) return;

    const suggestion = result.suggestions[0];
    console.log(suggestion);
    if (search.canRetrieve(suggestion)) {
      const { features } = await search.retrieve(suggestion, { sessionToken });

      // doSomethingWithCoordinates(features);
    } else if (search.canSuggest(suggestion)) {
      console.log("search again");
    }
  };

  useEffect(() => {
    if (!map) return;
    searchFunc();
  }, [map]);
  return <div>Toggle</div>;
};

export default Toggle;
