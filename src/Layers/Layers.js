import { useEffect } from "react";
import { useContext } from "react";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { MapContextOpenlayers } from "../Map/Openlayers";
import { Fill, Stroke, Circle, Style } from "ol/style";
import { Modify, Select, Snap } from "ol/interaction";
import Text from "ol/style/Text";
import Point from "ol/geom/Point";
import Route from "../data/Route.geojson";
import RoutePoints from "../data/RoutePoints.geojson";
import NewATS from "../data/NewATS.geojson";
import NewWayPoint from "../data/NewWayPoint.geojson";
import LayerSwitcher from "ol-layerswitcher";
import { Group as LayerGroup } from "ol/layer";
import "ol-layerswitcher/dist/ol-layerswitcher.css";

const Layers = () => {
  const { map } = useContext(MapContextOpenlayers);

  const styles_point = new Style({
    image: new Circle({
      fill: new Fill({
        color: "yellow",
      }),
      stroke: new Stroke({
        color: "black",
        width: 1.25,
      }),
      radius: 1.5,
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
            radius: 2,
          }),
        })
      );
    });

    return styles;
  };

  const wayPointLabelStyle = (feature) => {
    const styles_point = new Style({
      image: new Circle({
        fill: new Fill({
          color: "blue",
        }),
        stroke: new Stroke({
          color: "#3399CC",
          width: 1.25,
        }),
        radius: 0,
      }),
      text: new Text({
        font: '7px "Open Sans""',
        scale: 0.75,
        offsetY: 10,
        fill: new Fill({ color: "black" }),
        stroke: new Stroke({ color: "black", width: 0.3 }),
      }),
    });
    styles_point.getText().setText(feature.get("PNAME"));
    return styles_point;
  };

  const route = new VectorLayer({
    title: "Route",
    zIndex: 1000,
    source: new VectorSource({
      // url: "http://localhost:8080/Route.geojson",
      url: Route,
      format: new GeoJSON(),
      wrapX: false,
    }),
    style: vertexPolylineStyle,
  });

  const routePoints = new VectorLayer({
    title: "Route Points",
    zIndex: 1000,
    source: new VectorSource({
      // url: "http://localhost:8080/Route.geojson",
      url: RoutePoints,
      format: new GeoJSON(),
      wrapX: false,
    }),
    style: (feature) => {
      const styles_point = new Style({
        image: new Circle({
          fill: new Fill({
            color: "blue",
          }),
          stroke: new Stroke({
            color: "#3399CC",
            width: 1.25,
          }),
          radius: 3,
        }),
        text: new Text({
          font: '7px "Open Sans""',
          offsetX: -30,
          scale: 0.75,
          fill: new Fill({ color: "blue" }),
          stroke: new Stroke({ color: "blue", width: 0.3 }),
        }),
      });
      styles_point.getText().setText(feature.get("PointFromName"));
      return styles_point;
    },
  });

  const newAts = new VectorLayer({
    title: "ATS",
    visible: true,
    source: new VectorSource({
      // url: "http://localhost:8080/NewATS.geojson",
      url: NewATS,
      format: new GeoJSON(),
    }),
    style: styles_grey,
  });

  const newWayPoint = new VectorLayer({
    title: "Way Point",
    visible: true,
    source: new VectorSource({
      // url: "http://localhost:8080/NewWayPoint.geojson",
      url: NewWayPoint,
      format: new GeoJSON(),
    }),
    style: styles_point,
  });

  const newWayPointLabel = new VectorLayer({
    title: "Way Point Label",
    visible: false,
    source: new VectorSource({
      // url: "http://localhost:8080/NewWayPoint.geojson",
      url: NewWayPoint,
      format: new GeoJSON(),
    }),
    style: wayPointLabelStyle,
  });

  const layerGroup = new LayerGroup({
    title: "LAYERS",
    visible: true,
    layers: [routePoints, route, newAts, newWayPoint, newWayPointLabel],
  });

  useEffect(() => {
    if (!map) {
      return;
    }

    map.addLayer(layerGroup);

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [map, layerGroup]);

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
      source: route.getSource(),
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

    const snap = new Snap({ source: newWayPoint.getSource() });

    map.addInteraction(snap);

    return () => {
      map.removeInteraction(snap);
      // map.removeInteraction(select);
      map.removeInteraction(modify);
    };
  }, [map, newWayPoint, route]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const layerSwitcher = new LayerSwitcher({
      // activationMode: "click",
      startActive: false,
      tipLabel: "Layers", // Optional label for button
      groupSelectStyle: "children", // Can be 'children' [default], 'group' or 'none'
      collapseTipLabel: "Collapse layers",
    });
    map.addControl(layerSwitcher);

    return () => map.controls.remove(layerSwitcher);
  }, [map]);

  return null;
};

export default Layers;
