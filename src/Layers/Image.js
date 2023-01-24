import React, { useEffect, useRef, useState, useContext } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import mytif from "./../data/test3.png";
import "./Image.css";

const Image = ({ data }) => {
  const { map } = useContext(MapContextMapbox);
  const imgId = useRef(null);
  const [imgDimension, setImgDimension] = useState({
    height: 400,
    width: 400,
  });

  const [payload, setPayload] = useState([]);

  console.log(payload);

  useEffect(() => {
    if (!map) return;
    map.on("click", (e) => {
      let { lng, lat } = e.lngLat;
      console.log(lng, lat);
      setPayload((prev) => [...prev, [lng, lat]]);
    });

    if (data) {
      data(payload);
    }
  }, [map]);

  return (
    <>
      <div className="d-flex justify-content-center">
        <img
          ref={imgId}
          src={mytif}
          style={{
            width: imgDimension.width,
            height: imgDimension.height,
          }}
          onClick={(e) => {
            let bounds = imgId.current.getBoundingClientRect();
            let left = bounds.left;
            let top = bounds.top;
            let x = e.pageX - left;
            let y = e.pageY - top;
            let cw = imgId.current.clientWidth;
            let ch = imgId.current.clientHeight;
            let iw = imgId.current.naturalWidth;
            let ih = imgId.current.naturalHeight;
            let px = (x / cw) * iw;
            let py = (y / ch) * ih;

            setPayload((prev) => [...prev, [px, py]]);
          }}
          onWheel={(evt) => {
            const height = imgId.current.clientHeight;
            const width = imgId.current.clientWidth;
            if (evt.deltaY > 0) {
              if (imgDimension.width < 400) return;
              setImgDimension({ width: width - 25 });
            } else if (evt.deltaY < 0) {
              setImgDimension({ height: height + 25 });
            }
          }}
        />
      </div>
      
    </>
  );
};

export default Image;
