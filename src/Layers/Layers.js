import React, { useContext, useEffect, useState } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import * as turf from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import custom from "./../data/custom.geojson";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const Layers = () => {
  const { map } = useContext(MapContextMapbox);
  const [updateFeat, setUpdateFeat] = useState();

  let modifiedFeature;

  const clickHandlaer = () => {
    if (!map) return;

    map.getSource("myLayers").setData(turf.featureCollection([]));
  };

  const updateHandlaer = () => {
    map.getSource("myLayers").setData(updateFeat);

    // if (typeof map.getLayer("myLayers") !== "undefined") {
    //   map.removeLayer("myLayers");
    //   map.removeSource("myLayers");
    // }

    // map.addSource("myLayers", {
    //   type: "geojson",
    //   data: updateFeat,
    // });

    // map.addLayer({
    //   id: "myLayers",
    //   type: "line",
    //   source: "myLayers",
    //   paint: {
    //     "line-color": "red",
    //   },
    // });
  };

  useEffect(() => {
    if (!map) return;

    // const DirectSelectWithoutMiddleVertexMode = MapboxDraw.modes.direct_select;

    // const drawOptions = {
    //   modes: Object.assign(
    //     {
    //       direct_select: DirectSelectWithoutMiddleVertexMode,
    //     },
    //     MapboxDraw.modes
    //   ),
    // };
    const draw = new MapboxDraw();
    // draw.modes.DIRECT_SELECT === "direct_select";
    map.addControl(draw);

    map.on("click", (e) => {
      let features = map.queryRenderedFeatures(e.point, {
        layers: ["myLayers"],
      });
      if (!features.length) {
        return;
      }

      map.getSource("myLayers").setData(turf.featureCollection([]));
    });

    map.on("load", () => {
      fetch(custom)
        .then((res) => res.json())
        .then((out) => {
          modifiedFeature = draw.add(out);
          // console.log(
          //   map.getSource("myLayers").setData(turf.featureCollection([]))
          // );
          // map.getSource("myLayers")?.setData(turf.featureCollection([]));
          // let featureId = modifiedFeature[0];
          // console.log(draw.get(featureId));
          // draw.changeMode("direct_select", { featureId: draw.get(featureId).id });
          map.on("draw.update", (e) => {
            console.log(e.features[0]);
            setUpdateFeat(e.features[0]);
          });

          // draw.deleteAll();
        });
    });
  }, [map]);

  return (
    <div style={{ zIndex: 1 }}>
      <button
        style={{ zIndex: 1, position: "absolute" }}
        type="button"
        onClick={clickHandlaer}
      >
        delete
      </button>

      <button
        style={{ zIndex: 1, position: "absolute", marginLeft: "50px" }}
        type="button"
        onClick={updateHandlaer}
      >
        update
      </button>
    </div>
  );
};

export default Layers;
