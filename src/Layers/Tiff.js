import React, { useContext, useEffect, useState } from "react";
import mytif from "./../data/test3.png";
import { MapContextMapbox } from "../Map/Mapbox";
import { Modal } from "antd";
import Image from "./Image";

const Tiff = () => {
  const { map } = useContext(MapContextMapbox);
  const [val, setVal] = useState(100);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!map) return;

    map.on("load", () => {
      map.addSource("mytiff", {
        type: "image",
        url: mytif,
        coordinates: [
          [-87.4975413, 36.8629185],
          [-87.4930459, 36.8629185],
          [-87.4930459, 36.8595479],
          [-87.4975413, 36.8595479],
        ],
      });
      map.addLayer({
        id: "mytiff",
        type: "raster",
        source: "mytiff",
        layout: { visibility: "visible" },
      });
    });
  }, [map]);
  return (
    <div>
      <div style={{ zIndex: "1", position: "absolute" }}>
        <input
          type="range"
          min={1}
          max={100}
          value={val}
          className="slider"
          onChange={(e) => {
            setVal(parseInt(e.target.value));
            if (map)
              map.setPaintProperty("mytiff", "raster-opacity", val / 100);
          }}
        />
        <button className="btn btn-primary" onClick={showModal}>
          Upload non-georef / Edit
        </button>
        <Modal
          title="Georeferencer"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Save"
          bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
        >
          <Image />
        </Modal>
      </div>
    </div>
  );
};

export default Tiff;
