import { useEffect } from "react";
import { useState, useContext } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { MapContextOpenlayers } from "../Map/Openlayers";
import { Fill, Stroke, Circle, Style } from "ol/style";
import { Modify, Select, Snap } from "ol/interaction";
import Text from "ol/style/Text";
import Point from "ol/geom/Point";
import Route from "../data/Route.geojson";
import NewATS from "../data/NewATS.geojson";
import NewWayPoint from "../data/NewWayPoint.geojson";

const Layers = () => {
  const { map } = useContext(MapContextOpenlayers);

  const styles_point = new Style({
    image: new Circle({
      fill: new Fill({
        color: "blue",
      }),
      stroke: new Stroke({
        color: "#3399CC",
        width: 1.25,
      }),
      radius: 4,
    }),
    fill: new Fill({
      color: "rgba(255,255,255,0.4)",
    }),
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    text: new Text({
      font: 'bold 7px "Open Sans""',
      placement: "point",
      fill: new Fill({ color: "red" }),
      stroke: new Stroke({ color: "magenta", width: 0.7 }),
    }),
  });

  const styles_grey = new Style({
    stroke: new Stroke({
      color: "grey",
      width: 1.25,
    }),
  });

  const vertexPolylineStyle = function (feature) {
    const geometry = feature.getGeometry();
    // let styles = [];
    const styles = [
      // linestring
      new Style({
        stroke: new Stroke({
          color: "blue",
          width: 2,
        }),
      }),
    ];

    geometry.forEachSegment(function (end) {
      // arrows
      styles.push(
        new Style({
          geometry: new Point(end),
          image: new Circle({
            fill: new Fill({
              color: "black",
            }),
            stroke: new Stroke({
              color: "#3399CC",
              width: 1.25,
            }),
            radius: 4,
          }),
        })
      );
    });

    return styles;
  };

  const styleFunction = (feature) => {
    styles_point.getText().setText(feature.get("PNAME"));
    return styles_point;
  };

  const [overlayLayers1, setOverlayLayers1] = useState(
    new VectorLayer({
      zIndex: 1000,
      source: new VectorSource({
        // url: "http://localhost:8080/Route.geojson",
        url: Route,
        format: new GeoJSON(),
        wrapX: false,
      }),
      style: vertexPolylineStyle,
    })
  );

  const [overlayLayers2, setOverlayLayers2] = useState(
    new VectorLayer({
      source: new VectorSource({
        // url: "http://localhost:8080/NewATS.geojson",
        url: NewATS,
        format: new GeoJSON(),
      }),
      style: styles_grey,
    })
  );

  const [overlayLayers3, setOverlayLayers3] = useState(
    new VectorLayer({
      source: new VectorSource({
        // url: "http://localhost:8080/NewWayPoint.geojson",
        url: NewWayPoint,
        format: new GeoJSON(),
      }),
      style: styleFunction,
    })
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    map.addLayer(overlayLayers2);
    map.addLayer(overlayLayers3);
    map.addLayer(overlayLayers1);

    return () => {
      map.removeLayer(overlayLayers1);
      map.removeLayer(overlayLayers2);
      map.removeLayer(overlayLayers3);
    };

    // map.getLayers.extend([overlayLayers1, overlayLayers2, overlayLayers3]);
  }, [map, overlayLayers1, overlayLayers2, overlayLayers3]);

  useEffect(() => {
    if (!map) {
      return;
    }

    // const select = new Select({
    //   wrapX: false,
    // });

    // map.addInteraction(select);
    const modify = new Modify({
      // features: select.getFeatures(),
      source: overlayLayers1.getSource(),
      snapToPointer: true,
      insertVertexCondition: () => {
        return false;
      },
    });

    modify.on("modifyend", function (e) {
      var features = e.features;
      features.forEach((feature) => {
        let featureLength = Object.keys(
          feature.getGeometry().getCoordinates()
        ).length;
        for (let i = 0; i < featureLength; i++) {
          console.log(feature.getGeometry().getCoordinates()[i]);
        }
        // console.log(feature.getGeometry().getCoordinates());
      });
    });

    map.addInteraction(modify);

    const snap = new Snap({ source: overlayLayers3.getSource() });

    map.addInteraction(snap);

    return () => {
      map.removeInteraction(snap);
      // map.removeInteraction(select);
      map.removeInteraction(modify);
    };
  }, [map, overlayLayers1, overlayLayers3]);

  return null;
};

export default Layers;
