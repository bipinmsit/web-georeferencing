import React, { useRef, useState, useEffect, createContext } from "react";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "./Map.css";
import * as ol from "ol";

export const MapContextOpenlayers = new createContext();

export const Openlayers = ({ children, zoom, center }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center, projection: "EPSG:4326" }),
      layers: [new TileLayer({ source: new OSM() })],
      controls: [],
      overlays: [],
    };

    let mapObject = new ol.Map(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, [center, zoom]);

  // zoom change handler
  useEffect(() => {
    if (!map) return;

    map.getView().setZoom(zoom);
  }, [map, zoom]);

  // center change handler
  useEffect(() => {
    if (!map) return;

    map.getView().setCenter(center);
  }, [center, map]);

  return (
    <MapContextOpenlayers.Provider value={{ map }}>
      <div ref={mapRef} className="ol-container">
        {children}
      </div>
    </MapContextOpenlayers.Provider>
  );
};
