import React, { createContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import custom from "./../data/custom.geojson";
import custom2 from "./../data/custom2.geojson";
import "./Map.css";

export const MapContextMapbox = new createContext();

export const Mapbox = ({ children, zoom, center }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [data, setData] = useState();

  mapboxgl.accessToken =
    "pk.eyJ1Ijoic21vaGFuMjAyMiIsImEiOiJjbDI0bm1xb3owMWxoM2tucGowMnc1ejk1In0.1ZaYMVjLOMwSVoX9QfLUZA";

  const site1 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-104.80827729840384, 41.167418563889036],
              [-104.8076271654942, 41.17338448941277],
              [-104.80261731777875, 41.17349921874977],
              [-104.8001315154772, 41.170172067976914],
              [-104.80047570348819, 41.167571536338365],
              [-104.80827729840384, 41.167418563889036],
            ],
          ],
        },
      },
    ],
  };

  const site2 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-104.79825760297295, 41.167877481237014],
              [-104.79787517184964, 41.17284908584013],
              [-104.79363018638082, 41.17418759477173],
              [-104.79083843918062, 41.17449353967039],
              [-104.79015006315865, 41.17105165956054],
              [-104.79122087030393, 41.167839238124685],
              [-104.79489220908776, 41.16868058659598],
              [-104.79825760297295, 41.167877481237014],
            ],
          ],
        },
      },
    ],
  };

  const subsite1 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-104.8061739272256, 41.16990436619059],
              [-104.80399406982269, 41.17101341644821],
              [-104.80303799201441, 41.16913950394396],
              [-104.80491190451865, 41.16864234348365],
              [-104.8061739272256, 41.16990436619059],
            ],
          ],
        },
      },
    ],
  };

  const subsite2 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-104.80657547990505, 41.17212246670583],
              [-104.80523697097344, 41.17292557206479],
              [-104.80496926918713, 41.171988615812666],
              [-104.80590622543924, 41.17080307933039],
              [-104.80672845235438, 41.17105165956054],
              [-104.80657547990505, 41.17212246670583],
            ],
          ],
        },
      },
    ],
  };

  useEffect(() => {
    const options = {
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      container: mapRef.current,
      zoom,
      center,
    };

    const mapObj = new mapboxgl.Map(options);
    setMap(mapObj);

    return () => setMap(null);
  }, [zoom, center]);

  //   zoom change handler
  useEffect(() => {
    if (!map) {
      return;
    }
    map.setZoom(zoom);
  }, [map, zoom]);

  //   center change handler
  useEffect(() => {
    if (!map) {
      return;
    }
    map.setCenter(center);
  }, [center, map]);

  useEffect(() => {
    if (!map) return;
    fetch(custom2)
      .then((res) => res.json())
      .then((out) => {
        map.on("load", () => {
          map.addSource("custom2", {
            type: "geojson",
            data: out,
          });

          map.addLayer({
            id: "custom2",
            type: "line",
            source: "custom2",
            paint: {
              "line-color": "yellow",
            },
          });
        });
      });
  }, [map]);

  useEffect(() => {
    if (!map) return;
    fetch(custom)
      .then((res) => res.json())
      .then((out) => {
        map.on("load", () => {
          map.addSource("myLayers", {
            type: "geojson",
            data: out,
          });

          map.addLayer({
            id: "myLayers",
            type: "fill",
            source: "myLayers",
            paint: {
              "fill-outline-color": "red",
              // "fill-outline-width": 1,
              // "line-color": "red",
            },
          });
        });
      });
  }, [map]);

  useEffect(() => {
    if (!map) return;

    map.on("load", () => {
      map.addSource("site1", {
        type: "geojson",
        data: site1,
      });

      map.addLayer({
        id: "site1",
        type: "fill",
        source: "site1",
        paint: {
          "fill-outline-color": "red",
          "fill-opacity": 0.5,
          // "fill-outline-width": 1,
          // "line-color": "red",
        },
      });
      map.addSource("site2", {
        type: "geojson",
        data: site2,
      });

      map.addLayer({
        id: "site2",
        type: "fill",
        source: "site2",
        paint: {
          "fill-outline-color": "red",
          "fill-opacity": 0.5,
          // "fill-outline-width": 1,
          // "line-color": "red",
        },
      });
      map.addSource("subsite1", {
        type: "geojson",
        data: subsite1,
      });

      map.addLayer({
        id: "subsite1",
        type: "fill",
        source: "subsite1",
        paint: {
          "fill-outline-color": "red",
          // "fill-outline-width": 1,
          // "line-color": "red",
        },
      });
      map.addSource("subsite2", {
        type: "geojson",
        data: subsite2,
      });

      map.addLayer({
        id: "subsite2",
        type: "fill",
        source: "subsite2",
        paint: {
          "fill-outline-color": "red",
          // "fill-outline-width": 1,
          // "line-color": "red",
        },
      });
    });
  }, [map]);

  return (
    <MapContextMapbox.Provider value={{ map }}>
      <div ref={mapRef} className="mapbox-container">
        {children}
      </div>
    </MapContextMapbox.Provider>
  );
};
