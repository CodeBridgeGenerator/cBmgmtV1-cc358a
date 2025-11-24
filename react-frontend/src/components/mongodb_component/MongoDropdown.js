import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import client from "../../../services/restClient";

export default function BasicDemo() {
  const [selectedMongoTier, setMongoTier] = useState({
    name: "New York",
    code: "NY",
  });
  const [data, setData] = useState([]);
  const mongoTypes = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  useEffect(getMongoTypes, [selectedMongoTier]);

  const getMongoTypes = () => {
    client
      .service("mongoService")
      .find({})
      .then((res) => {
        let results = res.data;

        setData(results);
        props.hide();
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        props.hide();
        props.alert({
          title: "Mongo Service",
          type: "error",
          message: error.message || "Failed get Mongo Types",
        });
      });
  };

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={selectedMongoTier}
        onChange={(e) => setMongoTier(e.value)}
        options={mongoTypes}
        optionLabel="name"
        placeholder="Select Mongo Db Tier"
        className="w-full md:w-14rem"
      />
    </div>
  );
}
